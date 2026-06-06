'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function LandlordsHero() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const trustChips = [
    t('landlordsPage.hero.chip1'),
    t('landlordsPage.hero.chip2'),
    t('landlordsPage.hero.chip3'),
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Green gradient glow — top right */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      {/* Secondary glow — bottom left */}
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.04] blur-3xl"
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
              {t('landlordsPage.hero.eyebrow')}
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-900 dark:text-white leading-[1.08]">
              {t('landlordsPage.hero.headline1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('landlordsPage.hero.headlineHighlight')}
              </span>{' '}
              {t('landlordsPage.hero.headline2') || ''}
            </h1>

            {/* Subheadline */}
            <p className="text-ink-500 dark:text-gray-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('landlordsPage.hero.subheadline')}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Link
                href="/myProps/properties/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-base transition-all hover:scale-[1.02] shadow-green-sm hover:shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {t('landlordsPage.hero.ctaPrimary')}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-ink-900 dark:text-white rounded-full font-semibold text-base transition-all hover:bg-stone-50 dark:hover:bg-gray-800 hover:scale-[1.02] shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 focus:ring-offset-2"
              >
                {t('landlordsPage.hero.ctaSecondary')}
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-1">
              {trustChips.map((chip) => (
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
        {/* Property image */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 aspect-[16/9] flex items-center justify-center mb-5">
          <img
            src="/property-hero.jpeg"
            alt="Modern rental property"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property details */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-ink-900 dark:text-white text-base">
                {t('landlordsPage.hero.propertyCardTitle')}
              </h3>
              <p className="text-sm text-ink-500 dark:text-gray-400 mt-0.5">
                {t('landlordsPage.hero.propertyCardLocation')}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold whitespace-nowrap">
              {t('landlordsPage.hero.propertyCardStatus')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-gray-800">
            <span className="text-ink-900 dark:text-white font-bold text-sm">
              {t('landlordsPage.hero.propertyCardPrice')}
            </span>
            <span className="text-sm text-ink-500 dark:text-gray-400">
              {t('landlordsPage.hero.propertyCardEnquiries')}
            </span>
          </div>
        </div>
      </div>

      {/* Floating stats chip — top right */}
      <div className="absolute -top-4 -right-4 sm:-right-6 bg-brand-600 rounded-2xl shadow-green px-4 py-3 text-white animate-float">
        <p className="text-xs font-medium opacity-80">
          {t('landlordsPage.hero.floatingStatLabel')}
        </p>
        <p className="text-xl font-bold mt-0.5">94%</p>
      </div>

      {/* Floating enquiry notification — bottom left */}
      <div className="absolute -bottom-3 -left-3 sm:-left-5 bg-white dark:bg-gray-900 rounded-xl shadow-editorial border border-stone-100 dark:border-gray-800 px-4 py-2.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={14} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-900 dark:text-white">
            {t('landlordsPage.hero.floatingEnquiryTitle')}
          </p>
          <p className="text-[10px] text-ink-400 dark:text-gray-500">
            {t('landlordsPage.hero.floatingEnquirySubtitle')}
          </p>
        </div>
      </div>

      {/* Floating metric — right middle */}
      <div className="hidden sm:flex absolute top-1/2 -right-6 lg:-right-8 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-editorial border border-stone-100 dark:border-gray-800 px-3 py-2.5 items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
          <TrendingUp size={14} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <p className="text-[10px] text-ink-400 dark:text-gray-500">Maswali</p>
          <p className="text-xs font-bold text-ink-900 dark:text-white">+340%</p>
        </div>
      </div>
    </div>
  );
}
