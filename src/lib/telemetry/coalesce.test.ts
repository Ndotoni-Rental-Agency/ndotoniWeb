import { describe, expect, it } from 'vitest';
import { buildCoalesceKey, mergeCoalescedEvents } from './coalesce';

describe('buildCoalesceKey', () => {
  it('builds a stable key for GraphQL errors', () => {
    const key = buildCoalesceKey({
      type: 'GRAPHQL_ERROR',
      platform: 'WEB',
      operationName: 'getProperty',
      errorCode: 'InternalError',
      httpStatus: 500,
    });
    expect(key).toBe('GRAPHQL_ERROR||getProperty|InternalError|500');
  });

  it('includes upload counts for media batches so different outcomes do not merge', () => {
    const a = buildCoalesceKey({
      type: 'MEDIA_UPLOAD_BATCH',
      platform: 'WEB',
      step: 'media_upload',
      successCount: 2,
      failedCount: 1,
    });
    const b = buildCoalesceKey({
      type: 'MEDIA_UPLOAD_BATCH',
      platform: 'WEB',
      step: 'media_upload',
      successCount: 3,
      failedCount: 0,
    });
    expect(a).not.toBe(b);
    expect(a).toContain('2|1');
    expect(b).toContain('3|0');
  });
});

describe('mergeCoalescedEvents', () => {
  it('adds incoming count to the queued event', () => {
    const merged = mergeCoalescedEvents(
      {
        type: 'GRAPHQL_ERROR',
        platform: 'WEB',
        operationName: 'getMe',
        count: 2,
      },
      {
        type: 'GRAPHQL_ERROR',
        platform: 'WEB',
        operationName: 'getMe',
        count: 3,
      }
    );
    expect(merged.count).toBe(5);
  });

  it('defaults incoming count to 1', () => {
    const merged = mergeCoalescedEvents(
      {
        type: 'UNHANDLED_ERROR',
        platform: 'WEB',
        count: 4,
      },
      {
        type: 'UNHANDLED_ERROR',
        platform: 'WEB',
      }
    );
    expect(merged.count).toBe(5);
  });
});
