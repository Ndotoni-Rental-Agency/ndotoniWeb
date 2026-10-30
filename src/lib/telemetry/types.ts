export const CLIENT_PLATFORMS = ['WEB', 'IOS', 'ANDROID'] as const;
export type ClientPlatform = (typeof CLIENT_PLATFORMS)[number];

export const CLIENT_TELEMETRY_EVENT_TYPES = [
  'MEDIA_UPLOAD_BATCH',
  'GRAPHQL_ERROR',
  'LISTING_SUBMIT_FAILED',
  'UNHANDLED_ERROR',
] as const;
export type ClientTelemetryEventType = (typeof CLIENT_TELEMETRY_EVENT_TYPES)[number];

/** Payload sent to reportClientTelemetry (server adds Source from auth). */
export interface ClientTelemetryEventPayload {
  type: ClientTelemetryEventType;
  platform: ClientPlatform;
  appVersion?: string;
  updateId?: string;
  step?: string;
  operationName?: string;
  successCount?: number;
  failedCount?: number;
  httpStatus?: number;
  errorCode?: string;
  count?: number;
}
