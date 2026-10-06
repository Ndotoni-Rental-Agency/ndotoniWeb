'use client';

import type { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';
import { KangaBand } from '@/components/ui/KangaBand';

/**
 * Green poster hero shared by the marketing pages (landlords, refer).
 * Same vocabulary as the homepage hero: poster type, cream sticker, kanga band.
 */
export function PosterHero({
  lead,
  sticker,
  tail,
  subheadline,
  chips = [],
  actions,
}: {
  lead: string;
  sticker?: string;
  tail?: string;
  subheadline: string;
  chips?: string[];
  actions: ReactNode;
}) {
  return (
    <section className="relative">
      <div className="bg-brand-500 dark:bg-brand-800">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
          <h1
            className="max-w-4xl font-poster text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink-900 sm:text-6xl lg:text-7xl dark:text-white"
            style={{ fontStretch: '88%' }}
          >
            {lead}
            {sticker && (
              <>
                {' '}
                <span className="hero-sticker mt-2 inline-block -rotate-2 rounded-lg bg-cream-50 px-3 py-0.5 text-brand-800 shadow-[0_14px_28px_-12px_rgba(17,24,39,0.55)] sm:px-4 dark:bg-sand-300 dark:text-ink-900">
                  {sticker}
                </span>
              </>
            )}
            {tail && <> {tail}</>}
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-ink-800 sm:text-lg dark:text-brand-50">
            {subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions}
          </div>
          {chips.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-900 dark:text-white">
              {chips.map((chip) => (
                <li key={chip} className="inline-flex items-center gap-2">
                  <CheckCircle size={16} strokeWidth={2.5} aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <KangaBand />
    </section>
  );
}

/** t() falls back to the key for empty strings; treat that as "no text". */
export function optionalText(
  t: (key: string) => string,
  key: string,
): string | undefined {
  const value = t(key);
  return value === key || !value.trim() ? undefined : value;
}

/** Button styles for use on the green hero and on white sections. */
export const posterButton = {
  onGreen:
    'inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink-900 px-7 text-base font-bold text-white transition-colors hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900',
  onGreenSecondary:
    'inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-bold text-ink-900 transition-colors hover:bg-cream-100',
  primary:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 text-base font-bold text-ink-900 transition-colors hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900',
  onDark:
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-bold text-ink-900 transition-colors hover:bg-cream-100',
} as const;
