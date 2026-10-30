import { reportClientTelemetry } from '@/graphql/telemetry';
import { extractOperationName } from './extractOperationName';
import {
  buildCoalesceKey,
  mergeCoalescedEvents,
  type QueuedTelemetryEvent,
} from './coalesce';
import type { ClientTelemetryEventPayload } from './types';

const DEBOUNCE_MS = 2000;
const MAX_QUEUE_ENTRIES = 10;
const FLUSH_BUDGET_PER_KEY = 3;
const BUDGET_WINDOW_MS = 10 * 60 * 1000;
const THROTTLED_FLUSH_MS = 60 * 1000;
const SESSION_REQUEST_CAP = 200;

const queue = new Map<string, QueuedTelemetryEvent>();
const keyFlushCounts = new Map<string, { count: number; windowStart: number }>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let sessionRequestCount = 0;
let circuitOpen = false;

function scheduleFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushQueue();
  }, DEBOUNCE_MS);
}

function shouldUseThrottledFlush(key: string): boolean {
  const now = Date.now();
  const entry = keyFlushCounts.get(key);
  if (!entry || now - entry.windowStart > BUDGET_WINDOW_MS) {
    keyFlushCounts.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  if (entry.count <= FLUSH_BUDGET_PER_KEY) return false;
  return true;
}

export function enqueueTelemetryEvent(event: ClientTelemetryEventPayload): void {
  try {
    if (circuitOpen) return;

    const key = buildCoalesceKey(event);
    const existing = queue.get(key);
    if (existing) {
      queue.set(key, mergeCoalescedEvents(existing, event));
    } else {
      queue.set(key, { ...event, count: event.count ?? 1 });
    }

    if (queue.size >= MAX_QUEUE_ENTRIES) {
      void flushQueue();
      return;
    }

    if (shouldUseThrottledFlush(key)) {
      if (flushTimer) clearTimeout(flushTimer);
      flushTimer = setTimeout(() => {
        flushTimer = null;
        void flushQueue();
      }, THROTTLED_FLUSH_MS);
      return;
    }

    scheduleFlush();
  } catch {
    // never throw
  }
}

async function sendBatch(events: QueuedTelemetryEvent[]): Promise<void> {
  if (circuitOpen || events.length === 0) return;
  if (sessionRequestCount >= SESSION_REQUEST_CAP) {
    circuitOpen = true;
    return;
  }

  sessionRequestCount += 1;

  const variables = {
    events: events.map((e) => ({
      type: e.type,
      platform: e.platform,
      appVersion: e.appVersion,
      updateId: e.updateId,
      step: e.step,
      operationName: e.operationName,
      successCount: e.successCount,
      failedCount: e.failedCount,
      httpStatus: e.httpStatus,
      errorCode: e.errorCode,
      count: e.count,
    })),
  };

  try {
    const { GraphQLClient } = await import('@/lib/graphql-client');
    await GraphQLClient.execute(reportClientTelemetry, variables);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication')) {
      try {
        const { GraphQLClient } = await import('@/lib/graphql-client');
        await GraphQLClient.execute(reportClientTelemetry, variables, true);
        return;
      } catch {
        // drop
      }
    }
  }
}

export async function flushQueue(): Promise<void> {
  try {
    if (queue.size === 0) return;
    const batch = Array.from(queue.values());
    queue.clear();
    await sendBatch(batch);
  } catch {
    // never throw
  }
}

export function initTelemetryTransportLifecycle(): void {
  if (typeof window === 'undefined') return;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      void flushQueue();
    }
  });

  window.addEventListener('pagehide', () => {
    void flushQueue();
  });
}
