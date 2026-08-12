'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthActionExecutor } from '@/hooks/useAuthActionExecutor';
import { AuthBridge } from '@/lib/auth-bridge';
import {
  clearAuthReturnState,
  getAuthReturnState,
} from '@/lib/auth-return';
import { logger } from '@/lib/utils/logger';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { executeAuthAction } = useAuthActionExecutor();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const handleCallback = async () => {
      const returnState = getAuthReturnState();

      try {
        const sessionReady = await AuthBridge.waitForOAuthSession();
        if (sessionReady) {
          await refreshUser();
        }

        if (returnState?.action) {
          await executeAuthAction(returnState.action);

          // Favorite only toggles state — send user back to the property page
          if (returnState.action.type === 'favorite') {
            router.replace(returnState.returnUrl);
          }
        } else {
          router.replace(returnState?.returnUrl || '/');
        }
      } catch (error) {
        logger.error('Error handling OAuth callback:', error);
        router.replace(returnState?.returnUrl || '/');
      } finally {
        clearAuthReturnState();
      }
    };

    handleCallback();
  }, [router, refreshUser, executeAuthAction]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
