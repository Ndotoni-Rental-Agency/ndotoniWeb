'use client';

import React from 'react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  property: Property;
  formatPrice: (n: number, c?: string) => string;
};

export default function PropertyPricing({ property, formatPrice }: Props) {
  const { t, language } = useLanguage();
  if (!property?.pricing) return null;

  const serviceCharge = Math.round(property.pricing.monthlyRent * 0.4);

  return (
    <section id="costs">
      <h2 className="mb-3 text-xl font-bold text-ink-900 dark:text-white">
        {t('propertyDetails.pricingDetails')}
      </h2>

      <dl className="divide-y divide-stone-200 rounded-2xl bg-stone-50 px-5 py-2 sm:px-7 dark:divide-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-4 py-5">
          <dt className="text-ink-500 dark:text-gray-400">
            {t('propertyDetails.monthlyRent')}
          </dt>
          <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
            {formatPrice(
              property.pricing.monthlyRent,
              property.pricing.currency,
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 py-5">
          <dt className="text-ink-500 dark:text-gray-400">
            {language === 'sw' ? 'Service charge ya Ndotoni' : 'Ndotoni service charge'}
            <span className="mt-1 block text-sm">
              {language === 'sw' ? 'Takriban 40% ya kodi ya mwezi · Inajadiliwa' : 'Around 40% of monthly rent · Negotiable'}
            </span>
          </dt>
          <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
            {language === 'sw' ? 'Takriban ' : 'Approx. '}{formatPrice(serviceCharge, property.pricing.currency)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-500 dark:text-gray-400">
        {language === 'sw'
          ? 'Thibitisha miezi ya kodi ya kulipia mapema na mwenye tangazo.'
          : 'Confirm the number of rent months payable in advance with the contact.'}
      </p>
    </section>
  );
}
