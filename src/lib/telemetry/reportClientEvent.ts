import { classifyGraphQLError } from './classifyGraphQLError';
import { GraphQLRequestError } from './graphqlRequestError';
import { captureException } from './user';
import { enqueueTelemetryEvent } from './transport';
import type { ClientTelemetryEventPayload } from './types';

function appVersion(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
    process.env.NEXT_PUBLIC_APP_VERSION ??
    undefined
  );
}

export function reportClientEvent(
  event: Omit<ClientTelemetryEventPayload, 'platform' | 'appVersion'>,
  error?: unknown
): void {
  try {
    const payload: ClientTelemetryEventPayload = {
      ...event,
      platform: 'WEB',
      appVersion: appVersion(),
    };

    if (event.type === 'GRAPHQL_ERROR' && error) {
      const classification = classifyGraphQLError(error);
      if (classification === 'skip') return;
      enqueueTelemetryEvent(payload);
      if (classification === 'unexpected') {
        const gql =
          error instanceof GraphQLRequestError
            ? error
            : error instanceof Error
              ? error
              : new Error('GraphQL error');
        captureException(gql, {
          tags: {
            step: event.step ?? 'graphql',
            operationName: event.operationName ?? 'unknown',
          },
          fingerprint: [
            'graphql',
            event.operationName ?? 'unknown',
            error instanceof GraphQLRequestError ? error.errorType ?? 'unknown' : 'unknown',
          ],
        });
      }
      return;
    }

    if (event.type === 'LISTING_SUBMIT_FAILED' && error) {
      enqueueTelemetryEvent(payload);
      if (classifyGraphQLError(error) === 'unexpected') {
        captureException(error, {
          tags: { step: event.step ?? 'listing_submit' },
        });
      }
      return;
    }

    if (event.type === 'MEDIA_UPLOAD_BATCH') {
      enqueueTelemetryEvent(payload);
      if ((event.failedCount ?? 0) > 0 && error) {
        captureException(error, {
          tags: {
            step: 'media_upload',
            phase: (error as { phase?: string }).phase ?? 'unknown',
          },
        });
      }
      return;
    }

    enqueueTelemetryEvent(payload);
  } catch {
    // never throw
  }
}
