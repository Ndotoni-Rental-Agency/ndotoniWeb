'use client';

import { Building2, TrendingUp } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function ReferQuickEarn() {
  const { ref, isVisible } = useFadeIn({ delay: 80 });
  const { t } = useLanguage();

  const items = [
    {
      icon: Building2,
      title: t('referPage.quickEarn.item1Title'),
      amount: t('referPage.quickEarn.item1Amount'),
    },
    {
      icon: TrendingUp,
      title: t('referPage.quickEarn.item2Title'),
      amount: t('referPage.quickEarn.item2Amount'),
    },
  ];

  return (
    <section className="bg-cream-50 dark:bg-gray-900 border-y border-stone-100 dark:border-gray-800">
      <div className="container py-12 sm:py-14">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-center text-sm text-ink-500 dark:text-gray-400 mb-8">
            {t('referPage.quickEarn.intro')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ icon: Icon, title, amount }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 p-5 shadow-soft"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-sm text-ink-500 dark:text-gray-400">{title}</p>
                  <p className="text-lg font-bold text-ink-900 dark:text-white mt-0.5">{amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
