'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Gift, Banknote, Users } from 'lucide-react';
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
      {/* Background decorations */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container py-20 sm:py-28 lg:py-32">
        <div
          ref={ref}
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left — copy */}
          <div className="flex-1 text-center lg:text-left space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              {t('referPage.hero.eyebrow')}
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] tracking-tight text-ink-900 dark:text-white leading-[1.08]">
              {t('referPage.hero.headline1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('referPage.hero.headlineHighlight')}
              </span>{' '}
              {t('referPage.hero.headline2')}
            </h1>

            {/* Subheadline */}
            <p className="text-ink-500 dark:text-gray-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('referPage.hero.subheadline')}
            </p>

            {/* Earning summary inline */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-5 py-3 rounded-2xl bg-cream-50 dark:bg-gray-900/50 border border-stone-100 dark:border-gray-800">
              <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                {t('referPage.hero.earnAmount')}
              </span>
              <span className="hidden sm:block w-px h-4 bg-stone-200 dark:bg-gray-700" />
              <span className="text-sm text-ink-500 dark:text-gray-400">
                {t('referPage.hero.maxReferrals')}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Link
                href="/refer/submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-base transition-all hover:scale-[1.02] shadow-green-sm hover:shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {t('referPage.hero.ctaPrimary')}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-ink-900 dark:text-white rounded-full font-semibold text-base transition-all hover:bg-stone-50 dark:hover:bg-gray-800 hover:scale-[1.02] shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 focus:ring-offset-2"
              >
                {t('referPage.hero.ctaSecondary')}
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start pt-1">
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

          {/* Right — visual reward card */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <RewardIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function RewardIllustration() {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {/* Main reward card */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-800 overflow-hidden p-7 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
            <Gift size={20} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">
              {t('referPage.hero.rewardCardTitle')}
            </p>
            <p className="text-xs text-ink-400 dark:text-gray-500">
              {t('referPage.hero.rewardCardBadge')}
            </p>
          </div>
        </div>

        {/* Reward steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-center gap-4 rounded-2xl bg-cream-50 dark:bg-gray-800 border border-stone-100 dark:border-gray-700 p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-ink-500 dark:text-gray-400">
                {t('referPage.hero.rewardCardStep1')}
              </p>
              <p className="text-lg font-bold text-ink-900 dark:text-white">
                {t('referPage.hero.rewardCardStep1Amount')}
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={14} className="text-white" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/40 p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-200 dark:bg-brand-800/60 flex items-center justify-center flex-shrink-0">
              <Banknote size={18} className="text-brand-700 dark:text-brand-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-brand-600 dark:text-brand-400">
                {t('referPage.hero.rewardCardStep2')}
              </p>
              <p className="text-lg font-bold text-brand-700 dark:text-brand-300">
                {t('referPage.hero.rewardCardStep2Amount')}
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={14} className="text-white" />
            </div>
          </div>
        </div>

        {/* Bottom highlight bar */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-400 dark:text-gray-500 uppercase tracking-wider">M-Pesa</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Malipo ya papo hapo
            </span>
          </div>
        </div>
      </div>

      {/* Floating badge — top right */}
      <div className="absolute -top-4 -right-4 sm:-right-6 bg-brand-600 rounded-2xl shadow-green px-4 py-3 text-white animate-float">
        <p className="text-xs font-medium opacity-80">Zawadi</p>
        <p className="text-xl font-bold mt-0.5">TZS 2K+</p>
      </div>

      {/* Floating notification — bottom left */}
      <div className="absolute -bottom-3 -left-3 sm:-left-5 bg-white dark:bg-gray-900 rounded-xl shadow-editorial border border-stone-100 dark:border-gray-800 px-4 py-2.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-900 dark:text-white">M-Pesa imetumwa</p>
          <p className="text-[10px] text-ink-400 dark:text-gray-500">Sasa hivi</p>
        </div>
      </div>
    </div>
  );
}
