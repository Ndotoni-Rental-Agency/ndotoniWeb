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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
        Pricing Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nightly Rate */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nightly Rate</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatPrice(property.nightlyRate, property.currency)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">per night</p>
        </div>

        {/* Cleaning Fee */}
        {property.cleaningFee && property.cleaningFee > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cleaning Fee</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(property.cleaningFee, property.currency)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">one-time fee</p>
          </div>
        )}

        {/* Service Fee */}
        {property.serviceFeePercentage && property.serviceFeePercentage > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Fee</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {property.serviceFeePercentage}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of booking subtotal</p>
          </div>
        )}

        {/* Tax */}
        {property.taxPercentage && property.taxPercentage > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tax</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {property.taxPercentage}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of booking subtotal</p>
          </div>
        )}
      </div>

      {/* Booking Policies */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
