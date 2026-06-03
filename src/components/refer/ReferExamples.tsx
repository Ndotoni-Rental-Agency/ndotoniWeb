'use client';

import { REFERRAL_EXAMPLES } from '@/data/refer';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function ReferExamples() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow">{t('referPage.examples.eyebrow')}</span>
            <h2 className="section-heading">
              {t('referPage.examples.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('referPage.examples.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-md mx-auto">
              {t('referPage.examples.subheading')}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {REFERRAL_EXAMPLES.map((example, index) => (
              <div
                key={example.name}
                className="relative group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-stone-100 dark:border-gray-800 shadow-soft hover:shadow-editorial hover:border-brand-100 dark:hover:border-brand-800 transition-all duration-300 hover:-translate-y-0.5"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Quote */}
                <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed mb-6">
                  &ldquo;{t(`referPage.examples.${example.quoteKey}`)}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${example.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-xs font-bold text-white">{example.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-white leading-tight">
                        {example.name}
                      </p>
                      <p className="text-xs text-ink-400 dark:text-gray-500">{example.location}</p>
                    </div>
                  </div>

                  {/* Reward earned */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-medium text-ink-400 dark:text-gray-500 uppercase tracking-widest">
                      {t('referPage.examples.rewardLabel')}
                    </p>
                    <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      {example.rewardEarned}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
