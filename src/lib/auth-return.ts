/**
 * Global auth return state — preserves page context and pending actions
 * across sign-in/sign-up (including OAuth full-page redirects).
 *
 * Stored in sessionStorage so it survives OAuth redirects but not new tabs.
 */

export const AUTH_RETURN_STORAGE_KEY = 'ndotoni_auth_return';

/** Max age before pending auth state is discarded (30 minutes). */
const MAX_AGE_MS = 30 * 60 * 1000;

export type AuthPendingAction =
  | { type: 'contact-agent'; propertyId: string }
  | { type: 'chat'; propertyId: string }
  | { type: 'favorite'; propertyId: string }
  | { type: 'book'; propertyId: string; checkIn: string; checkOut: string; guests: number }
  | { type: 'navigate'; path: string };

export interface AuthReturnState {
  returnUrl: string;
  action?: AuthPendingAction;
  timestamp: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** Current path + query string (relative, no origin). */
export function getCurrentReturnUrl(): string {
  if (!isBrowser()) return '/';
  return window.location.pathname + window.location.search;
}

export function saveAuthReturnState(state: Omit<AuthReturnState, 'timestamp'>): void {
  if (!isBrowser()) return;

  const payload: AuthReturnState = {
    ...state,
    returnUrl: state.returnUrl || getCurrentReturnUrl(),
    timestamp: Date.now(),
  };

  sessionStorage.setItem(AUTH_RETURN_STORAGE_KEY, JSON.stringify(payload));
}

export function getAuthReturnState(): AuthReturnState | null {
  if (!isBrowser()) return null;

  try {
    const raw = sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw) as AuthReturnState;
    if (!state.returnUrl || !state.timestamp) return null;

    if (Date.now() - state.timestamp > MAX_AGE_MS) {
      clearAuthReturnState();
      return null;
    }

    return state;
  } catch {
    clearAuthReturnState();
    return null;
  }
}

export function clearAuthReturnState(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(AUTH_RETURN_STORAGE_KEY);
}

/** Strip auth redirect query params without a full navigation. */
export function stripAuthRedirectParams(): void {
  if (!isBrowser()) return;

  const url = new URL(window.location.href);
  if (!url.searchParams.has('auth') && !url.searchParams.has('redirect')) return;

  url.searchParams.delete('auth');
  url.searchParams.delete('redirect');
  const next = url.pathname + (url.search ? url.search : '') + url.hash;
  window.history.replaceState(null, '', next);
}
