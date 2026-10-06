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

  return (
    <section id="costs">
      <h2 className="mb-3 text-xl font-bold text-ink-900 dark:text-white">
        {t('propertyDetails.pricingDetails')}
      </h2>

      <dl className="divide-y divide-stone-200 rounded-2xl bg-cream-100 px-5 py-2 sm:px-7 dark:divide-gray-700 dark:bg-gray-800">
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

        {property.pricing.deposit != null && (
          <div className="flex items-center justify-between gap-4 py-5">
            <dt className="text-ink-500 dark:text-gray-400">
              {t('propertyDetails.securityDeposit')}
            </dt>
            <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
              {formatPrice(property.pricing.deposit, property.pricing.currency)}
            </dd>
          </div>
        )}

        {property.pricing.serviceCharge != null && (
          <div className="flex items-center justify-between gap-4 py-5">
            <dt className="text-ink-500 dark:text-gray-400">
              {t('propertyDetails.serviceCharge')}
            </dt>
            <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
              {formatPrice(
                property.pricing.serviceCharge,
                property.pricing.currency,
              )}
            </dd>
          </div>
        )}

        {property.pricing.utilitiesIncluded != null && (
          <div className="flex items-center justify-between gap-4 py-5">
            <dt className="text-ink-500 dark:text-gray-400">
              {t('propertyDetails.utilitiesIncluded')}
            </dt>
            <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
              {property.pricing.utilitiesIncluded
                ? t('common.yes')
                : t('common.no')}
            </dd>
          </div>
        )}
      </dl>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-500 dark:text-gray-400">
        {language === 'sw'
          ? 'Kabla ya kuhamia, thibitisha miezi ya kodi ya kulipia mapema, amana na ada zote na mwenye tangazo. Gharama zisizoonyeshwa hapa hazijathibitishwa.'
          : 'Before moving in, confirm rent months payable in advance, deposit and all fees with the contact. Costs not shown here have not been confirmed.'}
      </p>
    </section>
  );
}
