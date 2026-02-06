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
    <div className="transition-colors">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
        {t('propertyDetails.pricingDetails')}
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{t('propertyDetails.monthlyRent')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(property.pricing.monthlyRent, property.pricing.currency)}
          </span>
        </div>
        
        {property.pricing.deposit != null && property.pricing.deposit > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{t('propertyDetails.securityDeposit')}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(property.pricing.deposit, property.pricing.currency)}
            </span>
          </div>
        )}
        
        {property.pricing.serviceCharge != null && property.pricing.serviceCharge > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{t('propertyDetails.serviceCharge')}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(property.pricing.serviceCharge, property.pricing.currency)}
            </span>
          </div>
        )}
        
        {property.pricing.utilitiesIncluded != null && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{t('propertyDetails.utilitiesIncluded')}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {property.pricing.utilitiesIncluded ? t('common.yes') : t('common.no')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}