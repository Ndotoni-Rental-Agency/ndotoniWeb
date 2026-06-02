'use client';

import {
  Zap,
  TrendingDown,
  Eye,
  Headphones,
  Settings,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { BENEFITS } from '@/data/landlords';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  'trending-down': TrendingDown,
  eye: Eye,
  headphones: Headphones,
  settings: Settings,
  shield: Shield,
};

export function LandlordsBenefits() {
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
            <span className="eyebrow">{t('landlordsPage.benefits.eyebrow')}</span>
            <h2 className="section-heading">
              {t('landlordsPage.benefits.heading1')}
              <br />
              <span className="text-brand-600 dark:text-brand-400">
                {t('landlordsPage.benefits.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-md mx-auto">
              {t('landlordsPage.benefits.subheading')}
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = ICON_MAP[benefit.icon] ?? Shield;
              return (
                <div
                  key={benefit.titleKey}
                  className={cn(
                    'relative group rounded-2xl p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-0.5',
                    benefit.highlight
                      ? 'bg-brand-600 border-brand-700 shadow-green text-white'
                      : 'bg-white dark:bg-gray-900 border-stone-100 dark:border-gray-800 shadow-soft hover:shadow-editorial hover:border-brand-100 dark:hover:border-brand-800',
                  )}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
                      benefit.highlight
                        ? 'bg-white/20'
                        : 'bg-brand-50 dark:bg-brand-900/30',
                    )}
                  >
                    <Icon
                      size={20}
                      className={
                        benefit.highlight
                          ? 'text-white'
                          : 'text-brand-600 dark:text-brand-400'
                      }
                    />
                  </div>

                  <h3
                    className={cn(
                      'font-semibold text-base mb-2 tracking-tight',
                      benefit.highlight
                        ? 'text-white'
                        : 'text-ink-900 dark:text-white',
                    )}
                  >
                    {t(`landlordsPage.benefits.${benefit.titleKey}`)}
                  </h3>
                  <p
                    className={cn(
                      'text-sm leading-relaxed',
                      benefit.highlight
                        ? 'text-white/80'
                        : 'text-ink-500 dark:text-gray-400',
                    )}
                  >
                    {t(`landlordsPage.benefits.${benefit.descriptionKey}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
