'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
  ReactNode,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicAuthModal } from '@/components/ui/DynamicModal';
import { useAuthActionExecutor } from '@/hooks/useAuthActionExecutor';
import {
  AuthPendingAction,
  clearAuthReturnState,
  getAuthReturnState,
  getCurrentReturnUrl,
  saveAuthReturnState,
  stripAuthRedirectParams,
} from '@/lib/auth-return';
import { logger } from '@/lib/utils/logger';

export interface RequireAuthOptions {
  /** Action to resume after authentication (survives OAuth redirect). */
  action?: AuthPendingAction;
  /** Same-page callback after email/password sign-in (optional supplement to action). */
  onSuccess?: () => void | Promise<void>;
  /** Initial modal mode. */
  mode?: 'signin' | 'signup';
  /** Override return URL (defaults to current path + query). */
  returnUrl?: string;
}

interface AuthPromptContextType {
  /** Gate an authenticated action — saves context and opens the sign-in modal. */
  requireAuth: (options?: RequireAuthOptions) => void;
  /** Open sign-in/sign-up without a pending action (e.g. header menu). */
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthPromptContext = createContext<AuthPromptContextType | undefined>(undefined);

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, '') || '/';
}

function shouldExecuteAction(action: AuthPendingAction, currentUrl: string): boolean {
  if (action.type === 'navigate' && normalizeUrl(action.path) === normalizeUrl(currentUrl)) {
    return false;
  }
  return true;
}

function AuthRedirectQueryHandler() {
  const searchParams = useSearchParams();
  const { requireAuth } = useAuthPrompt();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const authRequired = searchParams.get('auth') === 'required';
    const redirectPath = searchParams.get('redirect');

    if (!authRequired) return;

    handledRef.current = true;

    const returnUrl = redirectPath || getCurrentReturnUrl();
    requireAuth({
      returnUrl,
      action: redirectPath ? { type: 'navigate', path: redirectPath } : undefined,
      mode: 'signin',
    });

    stripAuthRedirectParams();
  }, [searchParams, requireAuth]);

  return null;
}

function AuthActionResume() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { executeAuthAction } = useAuthActionExecutor();
  const resumingRef = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || resumingRef.current) return;

    const state = getAuthReturnState();
    if (!state?.action) return;

    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const normalize = (url: string) => url.replace(/\/$/, '') || '/';

    if (normalize(currentUrl) !== normalize(state.returnUrl)) return;
    if (!shouldExecuteAction(state.action!, currentUrl)) {
      clearAuthReturnState();
      return;
    }

    resumingRef.current = true;

    (async () => {
      try {
        await executeAuthAction(state.action!);
      } catch (error) {
        logger.error('Failed to resume auth action:', error);
      } finally {
        clearAuthReturnState();
        resumingRef.current = false;
      }
    })();
  }, [isAuthenticated, isLoading, pathname, searchParams, executeAuthAction]);

  return null;
}

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'signin' | 'signup'>('signin');
  const onSuccessRef = useRef<(() => void | Promise<void>) | null>(null);
  const { executeAuthAction } = useAuthActionExecutor();

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
    onSuccessRef.current = null;
    clearAuthReturnState();
  }, []);

  const openAuthModal = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    saveAuthReturnState({ returnUrl: getCurrentReturnUrl() });
    onSuccessRef.current = null;
    setInitialMode(mode);
    setIsOpen(true);
  }, []);

  const requireAuth = useCallback((options: RequireAuthOptions = {}) => {
    const returnUrl = options.returnUrl ?? getCurrentReturnUrl();

    saveAuthReturnState({
      returnUrl,
      action: options.action,
    });

    onSuccessRef.current = options.onSuccess ?? null;
    setInitialMode(options.mode ?? 'signin');
    setIsOpen(true);
  }, []);

  const handleAuthSuccess = useCallback(async () => {
    setIsOpen(false);

    const state = getAuthReturnState();
    const callback = onSuccessRef.current;
    onSuccessRef.current = null;

    try {
      if (callback) {
        await callback();
      } else if (state?.action && shouldExecuteAction(state.action, getCurrentReturnUrl())) {
        await executeAuthAction(state.action);
      }
    } catch (error) {
      logger.error('Auth success handler failed:', error);
    } finally {
      clearAuthReturnState();
    }
  }, [executeAuthAction]);

  const handleModalClose = useCallback(() => {
    setIsOpen(false);
    onSuccessRef.current = null;
    clearAuthReturnState();
  }, []);

  const value: AuthPromptContextType = {
    requireAuth,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen: isOpen,
  };

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <AuthRedirectQueryHandler />
        <AuthActionResume />
      </Suspense>
      <DynamicAuthModal
        isOpen={isOpen}
        onClose={handleModalClose}
        initialMode={initialMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt(): AuthPromptContextType {
  const context = useContext(AuthPromptContext);
  if (context === undefined) {
    throw new Error('useAuthPrompt must be used within an AuthPromptProvider');
  }
  return context;
}

/** Returns requireAuth if provider is mounted, otherwise a no-op fallback. */
export function useRequireAuth(): AuthPromptContextType['requireAuth'] {
  const context = useContext(AuthPromptContext);
  return context?.requireAuth ?? (() => {});
}
