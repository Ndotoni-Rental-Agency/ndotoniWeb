'use client';

import React from 'react';

type Props = {
  property: any;
  formatPrice: (n: number, c?: string) => string;
  onQuickApply: () => void;
  onContactAgent: () => void;
  isInitializingChat: boolean;
  region: string;
  district: string;
  ward?: string;
  street?: string;
};

export default function DetailsSidebar({
  property,
  formatPrice,
  onQuickApply,
  onContactAgent,
  isInitializingChat,
  region,
  district,
  ward,
  street,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {property.title}
        </h1>

        {property?.verificationStatus === 'VERIFIED' && (
          <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified Property
          </div>
        )}
      </div>

      {/* Location */}
      <div className="flex items-start gap-3 mb-4">
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>

        <div className="min-w-0">
          {/* Primary */}
          {street && (
            <div className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {street}
            </div>
          )}

          {/* Secondary */}
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {[ward, district, region].filter(Boolean).join(' • ')}
          </div>
        </div>
      </div>

      {/* Pricing */}
      {property?.pricing && (
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <div className="text-3xl sm:text-2xl font-extrabold text-red-600 leading-tight">
              {formatPrice(
                property.pricing.monthlyRent,
                property.pricing.currency
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per month
            </div>
          </div>
        </div>
      )}

      {/* Specifications */}
      {property?.specifications && (
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {property.specifications.bedrooms && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {property.specifications.bedrooms}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bedrooms
              </div>
            </div>
          )}

          {property.specifications.bathrooms && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {property.specifications.bathrooms}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bathrooms
              </div>
            </div>
          )}

          {property.specifications.squareMeters && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {property.specifications.squareMeters}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                m² Area
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onQuickApply}
          className="w-full border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-full font-medium transition-colors"
        >
          Quick Apply
        </button>

        <button
          onClick={onContactAgent}
          disabled={isInitializingChat}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-full font-medium transition-colors"
        >
          {isInitializingChat ? 'Starting chat...' : 'Contact Agent'}
        </button>
      </div>
    </div>
  );
}
