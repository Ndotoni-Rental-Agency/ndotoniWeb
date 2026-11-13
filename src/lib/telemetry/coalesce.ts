import type { ClientTelemetryEventPayload } from './types';

export type CoalesceKey = string;

export function buildCoalesceKey(event: ClientTelemetryEventPayload): CoalesceKey {
  const parts = [
    event.type,
    event.step ?? '',
    event.operationName ?? '',
    event.errorCode ?? '',
    String(event.httpStatus ?? ''),
  ];
  if (event.type === 'MEDIA_UPLOAD_BATCH') {
    parts.push(String(event.successCount ?? ''), String(event.failedCount ?? ''));
  }
  return parts.join('|');
}

export interface QueuedTelemetryEvent extends ClientTelemetryEventPayload {
  count: number;
}

export function mergeCoalescedEvents(
  existing: QueuedTelemetryEvent,
  incoming: ClientTelemetryEventPayload
): QueuedTelemetryEvent {
  const add = incoming.count ?? 1;
  return {
    ...existing,
    count: existing.count + add,
  };
}
