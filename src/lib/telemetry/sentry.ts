import * as Sentry from '@sentry/nextjs';
import { scrubBreadcrumb, scrubEventInPlace } from './scrub';
import { enqueueTelemetryEvent } from './transport';
import type { ClientTelemetryEventPayload } from './types';

let initialized = false;

function isUnhandledSentryEvent(event: Parameters<NonNullable<Sentry.NodeOptions['beforeSend']>>[0]): boolean {
  const exception = event.exception?.values?.[0];
  if (exception?.mechanism?.handled === false) return true;
  const tags = event.tags ?? {};
  return tags.boundary === 'react_render';
}

export function initTelemetry(): void {
  if (initialized || typeof window === 'undefined') return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    enabled: Boolean(dsn),
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    ignoreErrors: ['ResizeObserver loop limit exceeded', 'AbortError'],
    beforeSend(event) {
      if (isUnhandledSentryEvent(event)) {
        enqueueTelemetryEvent({
          type: 'UNHANDLED_ERROR',
          platform: 'WEB',
          count: 1,
        });
      }
      scrubEventInPlace(event);
      return event;
    },
    beforeSendTransaction(event) {
      scrubEventInPlace(event);
      return event;
    },
    beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
  });

  initialized = true;
}

export function captureException(
  error: unknown,
  context?: { tags?: Record<string, string>; fingerprint?: string[] }
): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.withScope((scope) => {
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, value);
      }
    }
    if (context?.fingerprint) {
      scope.setFingerprint(context.fingerprint);
    }
    Sentry.captureException(error);
  });
}

export function setTelemetryUser(userId: string): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.setUser({ id: userId });
}

export function clearTelemetryUser(): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.setUser(null);
}

export type { ClientTelemetryEventPayload };
