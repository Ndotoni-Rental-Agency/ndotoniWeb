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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Title + Verification */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
          {property.title}
        </h1>

        {property?.verificationStatus === 'VERIFIED' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-start gap-3">
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
          {street && (
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {street}
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {[ward, district, region].filter(Boolean).join(' • ')}
          </div>
        </div>
      </div>

      {/* Price */}
      {property?.pricing && (
        <div className="pt-2">
          <div className="text-3xl font-extrabold text-red-600">
            {formatPrice(
              property.pricing.monthlyRent,
              property.pricing.currency
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            per month
          </div>
        </div>
      )}

      {/* Key Specs */}
      {property?.specifications && (
        <div className="grid grid-cols-3 gap-3">
          {property.specifications.bedrooms != null && (
            <SpecItem
              label="Beds"
              value={property.specifications.bedrooms}
            />
          )}
          {property.specifications.bathrooms != null && (
            <SpecItem
              label="Baths"
              value={property.specifications.bathrooms}
            />
          )}
          {property.specifications.squareMeters != null && (
            <SpecItem
              label="Area"
              value={`${property.specifications.squareMeters} m²`}
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onQuickApply}
          className="w-full rounded-full border border-gray-300 dark:border-gray-600 py-3 font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Quick Apply
        </button>

        <button
          onClick={onContactAgent}
          disabled={isInitializingChat}
          className="w-full rounded-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 font-semibold transition"
        >
          {isInitializingChat ? 'Starting chat…' : 'Contact Agent'}
        </button>
      </div>
    </div>
  );
}

/* Small stat card */
function SpecItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-3 text-center">
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
