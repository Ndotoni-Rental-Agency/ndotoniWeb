'use client';

import React from 'react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  property: Property;
  formatPrice: (n: number, c?: string) => string;
};

export default function PropertyPricing({ property, formatPrice }: Props) {
  const { t } = useLanguage();
  if (!property?.pricing) return null;

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-ink-900 dark:text-white">
        {t('propertyDetails.pricingDetails')}
      </h2>

      <dl className="max-w-xl divide-y divide-stone-200 border-y border-stone-200 dark:divide-gray-700 dark:border-gray-700">
        <div className="flex items-center justify-between gap-4 py-3">
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

        {property.pricing.deposit != null && property.pricing.deposit > 0 && (
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink-500 dark:text-gray-400">
              {t('propertyDetails.securityDeposit')}
            </dt>
            <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
              {formatPrice(property.pricing.deposit, property.pricing.currency)}
            </dd>
          </div>
        )}

        {property.pricing.serviceCharge != null &&
          property.pricing.serviceCharge > 0 && (
            <div className="flex items-center justify-between gap-4 py-3">
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
          <div className="flex items-center justify-between gap-4 py-3">
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
    </section>
  );
}
