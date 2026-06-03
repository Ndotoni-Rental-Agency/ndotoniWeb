'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, TrendingUp, Building2 } from 'lucide-react';
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
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Green gradient glow — top left */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      {/* Green gradient glow — bottom right */}
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container py-20 sm:py-28 lg:py-32">
        <div
          ref={ref}
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 transition-all duration-700 ease-out ${
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
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-900 dark:text-white leading-[1.1]">
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

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Link
                href="#referral-form"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all hover:scale-[1.02] shadow-green-sm hover:shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {t('referPage.hero.ctaPrimary')}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-ink-900 dark:text-white rounded-full font-semibold text-sm transition-all hover:bg-stone-50 dark:hover:bg-gray-800 hover:scale-[1.02] shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 focus:ring-offset-2"
              >
                {t('referPage.hero.ctaSecondary')}
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-1">
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

          {/* Right — visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {/* Main card */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-800 overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-ink-900 dark:text-white text-base">
            {t('referPage.hero.rewardCardTitle')}
          </h3>
          <span className="inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold">
            {t('referPage.hero.rewardCardBadge')}
          </span>
        </div>

        {/* Reward Step 1 */}
        <div className="relative flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
            <Building2 size={18} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink-500 dark:text-gray-400 mb-0.5">
              {t('referPage.hero.rewardCardStep1')}
            </p>
            <p className="font-bold text-ink-900 dark:text-white text-base">
              {t('referPage.hero.rewardCardStep1Amount')}
            </p>
          </div>
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
            <CheckCircle size={12} className="text-brand-600 dark:text-brand-400" />
          </span>
        </div>

        {/* Divider with connector */}
        <div className="relative flex items-center gap-3 my-2 pl-5">
          <div className="absolute left-9 top-0 bottom-0 w-px bg-brand-200 dark:bg-brand-800" aria-hidden="true" />
        </div>

        {/* Reward Step 2 */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-600/10 dark:bg-brand-900/50 flex items-center justify-center ring-2 ring-brand-200 dark:ring-brand-700">
            <TrendingUp size={18} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink-500 dark:text-gray-400 mb-0.5">
              {t('referPage.hero.rewardCardStep2')}
            </p>
            <p className="font-bold text-ink-900 dark:text-white text-base">
              {t('referPage.hero.rewardCardStep2Amount')}
            </p>
          </div>
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">∞</span>
          </span>
        </div>

        {/* Bottom total */}
        <div className="border-t border-stone-100 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 dark:text-gray-500 font-medium uppercase tracking-widest">
              Potential
            </span>
            <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">
              Unlimited ↑
            </span>
          </div>
        </div>
      </div>

      {/* Floating chip — referral submitted */}
      <div className="absolute -top-4 -right-4 sm:-right-6 bg-brand-600 rounded-2xl shadow-green px-4 py-3 text-white">
        <p className="text-xs font-medium opacity-80">New referral</p>
        <p className="text-sm font-bold mt-0.5">+TZS 2,000 🎉</p>
      </div>

      {/* Floating chip — people */}
      <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-editorial border border-stone-100 dark:border-gray-700 px-4 py-3">
        <p className="text-xs font-medium text-ink-400 dark:text-gray-500">Active referrers</p>
        <div className="flex items-center gap-1.5 mt-1">
          {['bg-emerald-500', 'bg-blue-500', 'bg-violet-500'].map((color, i) => (
            <span
              key={i}
              className={`w-5 h-5 rounded-full ${color} border-2 border-white dark:border-gray-800 -ml-1 first:ml-0`}
            />
          ))}
          <span className="text-xs font-semibold text-ink-900 dark:text-white ml-1">340+</span>
        </div>
      </div>
    </div>
  );
}
