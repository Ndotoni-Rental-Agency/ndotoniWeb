'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function PropertyDescription({
  description,
}: {
  description?: string;
}) {
  const { t } = useLanguage();
  if (!description) return null;

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-ink-900 dark:text-white">
        {t('propertyDetails.description')}
      </h2>
      <p className="max-w-prose whitespace-pre-line text-base leading-relaxed text-ink-700 dark:text-gray-300">
        {description}
      </p>
    </section>
  );
}
