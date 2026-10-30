import * as Sentry from '@sentry/node';
import { scrubBreadcrumb, scrubEventInPlace } from './src/lib/telemetry/scrub';

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  enabled: Boolean(dsn),
  tracesSampleRate: 0,
  beforeSend: (event) => {
    scrubEventInPlace(event);
    return event;
  },
  beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
});
