/**
 * Next.js 14.2 + experimental instrumentationHook: init Sentry on Node only.
 * Not wired here: edge SDK (middleware) and onRequestError — upgrade to Next 15+ and
 * follow https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }
}
