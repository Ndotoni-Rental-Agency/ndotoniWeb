'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { KangaBand } from '@/components/ui/KangaBand';

export function ReferSubmitHeader() {
  const { t } = useLanguage();

  return (
    <header className="mx-auto mb-10 max-w-xl space-y-3 text-center">
      <h1 className="font-poster text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-5xl dark:text-white" style={{ fontStretch: '90%' }}>
        {t('referPage.journey.pageTitle')}
      </h1>
      <p className="text-base text-ink-500 dark:text-gray-400">
        {t('referPage.journey.pageSubtitle')}
      </p>
      <KangaBand variant="thin" className="mx-auto mt-5 max-w-[9rem]" />
    </header>
  );
}
