'use client';

import React from 'react';
import { Property } from '@/API';

type Props = {
  property: Property;
  formatPrice: (n: number, c?: string) => string;
};

export default function PropertyPricing({ property, formatPrice }: Props) {
  if (!property?.pricing) return null;

  return (
    <div className="transition-colors">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
        Pricing Details
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Monthly Rent</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(property.pricing.monthlyRent, property.pricing.currency)}
          </span>
        </div>
        
        {property.pricing.deposit != null && property.pricing.deposit > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Security Deposit</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(property.pricing.deposit, property.pricing.currency)}
            </span>
          </div>
        )}
        
        {property.pricing.serviceCharge != null && property.pricing.serviceCharge > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Service Charge</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(property.pricing.serviceCharge, property.pricing.currency)}
            </span>
          </div>
        )}
        
        {property.pricing.utilitiesIncluded != null && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Utilities Included</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {property.pricing.utilitiesIncluded ? "Yes" : "No"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}