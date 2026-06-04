'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function ReferSubmitHeader() {
  const { t } = useLanguage();

  return (
    <header className="max-w-xl mx-auto text-center mb-10 space-y-2">
      <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 dark:text-white">
        {t('referPage.journey.pageTitle')}
      </h1>
      <p className="text-sm text-ink-500 dark:text-gray-400">
        {t('referPage.journey.pageSubtitle')}
      </p>
    </header>
  );
}
