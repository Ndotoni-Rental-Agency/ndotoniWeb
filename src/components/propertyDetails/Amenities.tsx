'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  amenities: string[];
};

export default function Amenities({ amenities }: Props) {
  const { t } = useLanguage();
  if (!amenities || amenities.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-ink-900 dark:text-white">{t('propertyDetails.amenities')}</h2>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {amenities.map((amenity, index) => (
          <li key={index} className="flex items-center gap-2.5 text-base text-ink-700 dark:text-gray-300">
            <svg className="w-4 h-4 shrink-0 text-brand-700 dark:text-brand-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  );
}
