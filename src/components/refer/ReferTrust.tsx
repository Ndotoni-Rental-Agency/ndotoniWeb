'use client';

import { REFER_STATS } from '@/data/refer';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function ReferTrust() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-ink-900 dark:bg-gray-950">
      <div className="container py-14 sm:py-16">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-400">
              {t('referPage.trust.eyebrow')}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('referPage.trust.heading1')}{' '}
              <span className="text-brand-400">{t('referPage.trust.headingHighlight')}</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              {t('referPage.trust.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {REFER_STATS.map((stat, index) => (
              <div
                key={stat.labelKey}
                className="text-center space-y-1"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-brand-400">
                  {t(`referPage.trust.${stat.labelKey}`)}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed hidden sm:block">
                  {t(`referPage.trust.${stat.descriptionKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
