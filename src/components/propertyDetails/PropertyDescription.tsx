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
    <div className="transition-colors">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
        {t('propertyDetails.description')}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
