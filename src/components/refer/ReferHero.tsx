'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function ReferHero() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const chips = [
    t('referPage.hero.chip1'),
    t('referPage.hero.chip2'),
    t('referPage.hero.chip3'),
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container py-16 sm:py-24 lg:py-28">
        <div
          ref={ref}
          className={`max-w-2xl mx-auto text-center space-y-8 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            {t('referPage.hero.eyebrow')}
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] tracking-tight text-ink-900 dark:text-white leading-[1.12]">
              {t('referPage.hero.headline')}
            </h1>
            <p className="text-lg sm:text-xl text-ink-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
              {t('referPage.hero.subheadline')}
            </p>
          </div>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-5 py-3 rounded-2xl bg-cream-50 dark:bg-gray-900/50 border border-stone-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              {t('referPage.hero.earnAmount')}
            </span>
            <span className="hidden sm:block w-px h-4 bg-stone-200 dark:bg-gray-700" />
            <span className="text-sm text-ink-500 dark:text-gray-400">
              {t('referPage.hero.maxReferrals')}
            </span>
          </div>

          <Link
            href="/refer/submit"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-base transition-all hover:scale-[1.02] shadow-green-sm hover:shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {t('referPage.hero.ctaPrimary')}
            <ArrowRight size={18} />
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center pt-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 text-sm text-ink-500 dark:text-gray-400"
              >
                <CheckCircle size={14} className="text-brand-500 flex-shrink-0" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
