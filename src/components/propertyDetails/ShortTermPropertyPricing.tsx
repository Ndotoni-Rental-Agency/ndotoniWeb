'use client';

import React from 'react';
import { ShortTermProperty } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShortTermPropertyPricingProps {
  property: ShortTermProperty;
  formatPrice: (amount: number, currency?: string) => string;
}

export function ShortTermPropertyPricing({ property, formatPrice }: ShortTermPropertyPricingProps) {
  const { t } = useLanguage();

  return (
    <section className="border-t border-gray-200 dark:border-gray-700 pt-8">

      {/* Compact Pricing Grid */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Nightly Rate */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nightly Rate</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(property.nightlyRate, property.currency)}
            </p>
          </div>

          {/* Cleaning Fee */}
          {property.cleaningFee && property.cleaningFee > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cleaning Fee</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatPrice(property.cleaningFee, property.currency)}
              </p>
            </div>
          )}

          {/* Service Fee */}
          {property.serviceFeePercentage && property.serviceFeePercentage > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Service Fee</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {property.serviceFeePercentage}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Policies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {property.minimumStay && (
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minimum Stay</p>
              <p className="font-semibold text-gray-900 dark:text-white">{property.minimumStay} {property.minimumStay === 1 ? 'night' : 'nights'}</p>
            </div>
          </div>
        )}

        {property.advanceBookingDays && (
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Advance Booking</p>
              <p className="font-semibold text-gray-900 dark:text-white">{property.advanceBookingDays} days</p>
            </div>
          </div>
        )}

        {property.cancellationPolicy && (
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cancellation</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{property.cancellationPolicy.toLowerCase()}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
