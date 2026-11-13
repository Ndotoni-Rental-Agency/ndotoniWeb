/** SSR-safe wrappers — Sentry browser SDK loads only on the client. */

export function setTelemetryUser(userId: string): void {
  if (typeof window === 'undefined') return;
  void import('./sentry').then(({ setTelemetryUser: setUser }) => setUser(userId));
}

export function clearTelemetryUser(): void {
  if (typeof window === 'undefined') return;
  void import('./sentry').then(({ clearTelemetryUser: clearUser }) => clearUser());
}

export function captureException(
  error: unknown,
  context?: { tags?: Record<string, string>; fingerprint?: string[] }
): void {
  if (typeof window === 'undefined') return;
  void import('./sentry').then(({ captureException: capture }) => capture(error, context));
}
