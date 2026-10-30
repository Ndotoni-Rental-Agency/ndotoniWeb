import { describe, expect, it } from 'vitest';
import { scrubBreadcrumb, scrubEventInPlace, scrubText } from './scrub';

describe('scrub', () => {
  it('redacts emails and phone numbers', () => {
    expect(scrubText('call +255 712 345 678 or mail a@b.co')).toBe('call [phone] or mail [email]');
  });

  it('scrubs exception values and event messages', () => {
    const event = {
      message: 'fail for a@b.co',
      exception: { values: [{ value: 'phone 0712345678 invalid' }] },
    };
    scrubEventInPlace(event);
    expect(event.message).toBe('fail for [email]');
    expect(event.exception.values[0].value).toBe('phone [phone] invalid');
  });

  it('drops console breadcrumbs and scrubs urls', () => {
    expect(scrubBreadcrumb({ category: 'console' })).toBeNull();
    const b = scrubBreadcrumb({ data: { url: 'https://x.com/p/12345678?token=1' } });
    expect(b?.data?.url).toBe('https://x.com/p/:id');
  });
});
