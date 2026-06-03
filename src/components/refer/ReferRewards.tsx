'use client';

import { Building2, TrendingUp, Infinity } from 'lucide-react';
import { REWARDS } from '@/data/refer';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

const ICON_MAP: Record<string, React.ElementType> = {
  building: Building2,
  percent: TrendingUp,
};

export function ReferRewards() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-cream-50 dark:bg-gray-900">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow">{t('referPage.rewards.eyebrow')}</span>
            <h2 className="section-heading">
              {t('referPage.rewards.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('referPage.rewards.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              {t('referPage.rewards.subheading')}
            </p>
          </div>

          {/* Reward cards + timeline */}
          <div className="max-w-3xl mx-auto">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
              {REWARDS.map((reward, index) => {
                const Icon = ICON_MAP[reward.icon] ?? Building2;
                return (
                  <div
                    key={reward.id}
                    className={cn(
                      'relative group rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-0.5',
                      reward.highlight
                        ? 'bg-brand-600 border-brand-700 shadow-green text-white'
                        : 'bg-white dark:bg-gray-900 border-stone-100 dark:border-gray-800 shadow-soft hover:shadow-editorial hover:border-brand-100 dark:hover:border-brand-800',
                    )}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    {/* Step badge */}
                    <span
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5',
                        reward.highlight
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
                      )}
                    >
                      {t(`referPage.rewards.step${index + 1}Badge`)}
                    </span>

                    {/* Icon */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center mb-5',
                        reward.highlight ? 'bg-white/20' : 'bg-brand-50 dark:bg-brand-900/30',
                      )}
                    >
                      <Icon
                        size={22}
                        className={reward.highlight ? 'text-white' : 'text-brand-600 dark:text-brand-400'}
                      />
                    </div>

                    {/* Amount */}
                    <p
                      className={cn(
                        'font-display text-4xl font-bold tracking-tight mb-2',
                        reward.highlight ? 'text-white' : 'text-ink-900 dark:text-white',
                      )}
                    >
                      {reward.amountDisplay}
                    </p>

                    {/* Trigger */}
                    <p
                      className={cn(
                        'text-sm font-semibold mb-3',
                        reward.highlight ? 'text-white/90' : 'text-ink-700 dark:text-gray-200',
                      )}
                    >
                      {t(`referPage.rewards.${reward.triggerKey}`)}
                    </p>

                    {/* Description */}
                    <p
                      className={cn(
                        'text-sm leading-relaxed',
                        reward.highlight ? 'text-white/75' : 'text-ink-500 dark:text-gray-400',
                      )}
                    >
                      {t(`referPage.rewards.${reward.descriptionKey}`)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bonus card */}
            <div className="relative rounded-2xl border border-dashed border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/10 p-5 sm:p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
                <Infinity size={18} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 mb-2">
                  {t('referPage.rewards.bonusBadge')}
                </span>
                <h4 className="font-semibold text-ink-900 dark:text-white text-sm mb-1">
                  {t('referPage.rewards.bonusTitle')}
                </h4>
                <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed">
                  {t('referPage.rewards.bonusDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
