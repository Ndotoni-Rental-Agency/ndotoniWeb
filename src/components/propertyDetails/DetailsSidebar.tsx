'use client';

import React from 'react';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';

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
          {property.specifications.squareMeters != null
          && property.specifications.squareMeters > 0
           && (
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
          disabled={true}
          className="w-full rounded-full border border-gray-300 dark:border-gray-600 py-3 font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed transition opacity-50"
          title="Apply feature temporarily disabled"
        >
          Quick Apply (Coming Soon)
        </button>

        <button
          onClick={onContactAgent}
          disabled={isInitializingChat}
          className="w-full rounded-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 font-semibold transition"
        >
          {isInitializingChat ? 'Starting chat…' : 'Contact Agent'}
        </button>

        {/* WhatsApp Contact Button - Only show if WhatsApp number is available */}
        {((property as any)?.landlord?.whatsappNumber || (property as any)?.agent?.whatsappNumber) && (
          <button
            onClick={() => {
              const whatsappNumber = (property as any)?.landlord?.whatsappNumber || (property as any)?.agent?.whatsappNumber;
              if (whatsappNumber) {
                const whatsappUrl = generateWhatsAppUrl(whatsappNumber, property.title);
                window.open(whatsappUrl, '_blank');
              }
            }}
            className="w-full rounded-full bg-green-500 hover:bg-green-600 text-white py-3 font-semibold transition flex items-center justify-center gap-2"
            title="Contact via WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp
          </button>
        )}
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
