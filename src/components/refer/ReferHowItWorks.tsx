'use client';

import { Search, Send, Phone, Gift, type LucideIcon } from 'lucide-react';
import { REFER_HOW_IT_WORKS } from '@/data/refer';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  send: Send,
  phone: Phone,
  gift: Gift,
};

export function ReferHowItWorks() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="bg-white dark:bg-gray-950">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow">{t('referPage.howItWorks.eyebrow')}</span>
            <h2 className="section-heading">
              {t('referPage.howItWorks.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('referPage.howItWorks.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              {t('referPage.howItWorks.subheading')}
            </p>
          </div>

          {/* Steps */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connector line — desktop only, 4 columns */}
            <div
              className="hidden lg:block absolute top-14 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-transparent via-brand-200 dark:via-brand-800 to-transparent"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
              {REFER_HOW_IT_WORKS.map((step) => {
                const Icon = ICON_MAP[step.icon] ?? Search;
                return (
                  <div
                    key={step.titleKey}
                    className="relative flex flex-col items-center text-center group"
                    style={{ transitionDelay: `${step.stepIndex * 100}ms` }}
                  >
                    {/* Icon badge */}
                    <div className="relative mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 shadow-soft flex items-center justify-center group-hover:shadow-green-sm group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-all duration-300">
                        <Icon size={22} className="text-brand-600 dark:text-brand-400" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {step.stepIndex + 1}
                      </span>
                    </div>

                    <span className="text-xs font-semibold tracking-widest uppercase text-brand-500 dark:text-brand-400 mb-1">
                      {t('referPage.howItWorks.stepLabel')} {t(`referPage.howItWorks.${step.numberKey}`)}
                    </span>

                    <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white mb-2 tracking-tight">
                      {t(`referPage.howItWorks.${step.titleKey}`)}
                    </h3>
                    <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                      {t(`referPage.howItWorks.${step.descriptionKey}`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
