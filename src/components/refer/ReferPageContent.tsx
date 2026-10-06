'use client';

import { ArrowRight, Check, Gift } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  PosterHero,
  posterButton,
  optionalText,
} from '@/components/marketing/PosterHero';

export function ReferPageContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RewardsSection />
        <CTASection />
      </div>
    </div>
  );
}

function HeroSection() {
  const { t } = useLanguage();

  return (
    <PosterHero
      lead={t('referPage.hero.headline1')}
      sticker={t('referPage.hero.headlineHighlight')}
      tail={optionalText(t, 'referPage.hero.headline2')}
      subheadline={t('referPage.hero.subheadline')}
      chips={[t('referPage.hero.chip1'), t('referPage.hero.chip2'), t('referPage.hero.chip3')]}
      actions={
        <Link href="/refer/submit" className={posterButton.onGreen}>
          {t('referPage.hero.ctaPrimary')}
          <ArrowRight size={19} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      }
    />
  );
}

/** Money amounts wear the same yellow sticker as listing prices. */
function AmountSticker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 -rotate-2 items-baseline gap-1 rounded-md bg-sand-300 px-2.5 py-1 text-lg font-extrabold tabular-nums text-ink-900 shadow-[0_8px_16px_-6px_rgba(17,24,39,0.5)]">
      {children}
    </span>
  );
}

function RewardsSection() {
  const { t, language } = useLanguage();
  const sw = language === 'sw';
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const allRevealed = revealed[0] && revealed[1];

  const rewards = [
    { trigger: t('referPage.rewards.reward1Trigger'), amount: <>TZS 2,000</> },
    {
      trigger: t('referPage.rewards.reward2Trigger'),
      amount: (
        <>
          10% <span className="text-xs font-semibold">(TZS 10–50K)</span>
        </>
      ),
    },
  ];

  return (
    <section className="py-14 sm:py-20" aria-labelledby="refer-rewards">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <h2 id="refer-rewards" className="poster-heading max-w-md">
            {t('referPage.rewards.heading1')}{' '}
            <span className="text-brand-700 dark:text-brand-300">{t('referPage.rewards.headingHighlight')}</span>
          </h2>
          <p className="mt-3 max-w-md text-base text-ink-500 sm:text-lg dark:text-gray-400">
            {allRevealed
              ? sw
                ? 'Hivi ndivyo unavyolipwa kwa kila mwenye nyumba unayetuletea.'
                : 'This is what you earn for every landlord you bring us.'
              : sw
                ? 'Gusa kila kadi kuona zawadi yako.'
                : 'Tap each card to see your reward.'}
          </p>
        </div>

        <ol className="space-y-3">
          {rewards.map((reward, i) => (
            <li key={i}>
              {!revealed[i] ? (
                <button
                  type="button"
                  onClick={() => setRevealed((prev) => ({ ...prev, [i]: true }))}
                  className="group flex min-h-[4.5rem] w-full items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-5 text-left transition-colors hover:border-ink-900 active:scale-[0.99] dark:border-gray-600 dark:bg-gray-800 dark:hover:border-white"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-sm font-bold text-ink-900 dark:bg-gray-700 dark:text-white">
                      {i + 1}
                    </span>
                    <span className="text-base font-semibold text-ink-900 dark:text-white">{reward.trigger}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-800 dark:text-brand-300">
                    <Gift size={18} strokeWidth={2.25} className="transition-transform duration-300 ease-out group-hover:-rotate-12" aria-hidden="true" />
                    {sw ? 'Ona' : 'Reveal'}
                  </span>
                </button>
              ) : (
                <div className="flex min-h-[4.5rem] w-full animate-fade-in items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 dark:border-gray-700 dark:bg-gray-800">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-ink-900">
                      <Check size={18} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-base font-semibold text-ink-900 dark:text-white">{reward.trigger}</span>
                  </span>
                  <AmountSticker>{reward.amount}</AmountSticker>
                </div>
              )}
            </li>
          ))}
          {allRevealed && (
            <li className="flex animate-fade-in items-center justify-between gap-4 rounded-2xl bg-ink-900 px-5 py-4 dark:bg-gray-800">
              <span className="text-base font-semibold text-white">{t('referPage.rewards.bonusTitle')}</span>
              <span className="text-lg font-extrabold tabular-nums text-brand-400">TZS 12K – 52K</span>
            </li>
          )}
        </ol>
      </div>
    </section>
  );
}

function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="pb-16 sm:pb-20" aria-labelledby="refer-cta">
      <div className="rounded-3xl bg-ink-900 p-8 sm:p-12 dark:bg-gray-800">
        <h2
          id="refer-cta"
          className="max-w-2xl font-poster text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl"
          style={{ fontStretch: '90%' }}
        >
          {t('referPage.cta.heading1')}{' '}
          <span className="text-brand-400">{t('referPage.cta.headingHighlight')}</span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">{t('referPage.cta.subheading')}</p>
        <Link href="/refer/submit" className={`${posterButton.primary} mt-8`}>
          {t('referPage.cta.ctaPrimary')}
          <ArrowRight size={19} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
