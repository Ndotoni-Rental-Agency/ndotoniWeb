'use client';

import React from 'react';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Property } from '@/API';
import { toTitleCase } from '@/utils/common';

type Props = {
  property: Property;
  formatPrice: (n: number, c?: string) => string;
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
  onContactAgent,
  isInitializingChat,
  region,
  district,
  ward,
  street,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-6 h-full flex flex-col">
      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
          {property.title}
        </h1>
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
              {toTitleCase(street)}
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {toTitleCase([ward, district, region].filter(Boolean).join(' • '))}
          </div>
        </div>
      </div>

      {/* Price */}
      {property?.pricing && (
        <div className="pt-2">
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
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
        <div className="grid grid-cols-2 gap-3">
          {property.specifications.bedrooms != null && (
            <SpecItem
              label="Bedrooms"
              value={property.specifications.bedrooms}
              icon="bed"
            />
          )}
          {property.specifications.bathrooms != null && (
            <SpecItem
              label="Bathrooms"
              value={property.specifications.bathrooms}
              icon="bath"
            />
          )}
          {property.specifications.squareMeters != null
          && property.specifications.squareMeters > 0
           && (
            <SpecItem
              label="Area"
              value={`${property.specifications.squareMeters} m²`}
              icon="area"
            />
          )}
          {property.specifications.parkingSpaces != null && property.specifications.parkingSpaces > 0 && (
            <SpecItem
              label="Parking"
              value={property.specifications.parkingSpaces}
              icon="parking"
            />
          )}
          {property.specifications.floors != null && property.specifications.floors > 0 && (
            <SpecItem
              label="Floors"
              value={property.specifications.floors}
              icon="floors"
            />
          )}
          {property.specifications.furnished != null && (
            <SpecItem
              label="Furnished"
              value={property.specifications.furnished ? "Yes" : "No"}
              icon="furnished"
            />
          )}
        </div>
      )}

      {/* Contact Information */}
      {(property.landlord || property.agent) && (
        <div className="space-y-3">
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {(property.landlord || property.agent)?.firstName} {(property.landlord || property.agent)?.lastName}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Property {property.landlord ? 'Landlord' : 'Agent'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onContactAgent}
          disabled={isInitializingChat}
          className="w-full rounded-full bg-gray-900 hover:bg-gray-600 dark:hover:bg-gray-800 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white text-white py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializingChat ? 'Starting chat…' : 'Contact Agent'}
        </button>

        {/* WhatsApp Contact Button - Only show if WhatsApp number is available */}
        {(property?.landlord?.whatsappNumber || property?.agent?.whatsappNumber) && (
          <button
            onClick={() => {
              const whatsappNumber = property?.landlord?.whatsappNumber || property?.agent?.whatsappNumber;
              if (whatsappNumber) {
                const whatsappUrl = generateWhatsAppUrl(whatsappNumber, property.title, property.propertyId);
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
function SpecItem({ label, value, icon }: { label: string; value: any; icon?: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'bed':
        return (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'bath':
        return (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l2-4h14l2 4M4 10h16v4H4v-4z" />
          </svg>
        );
      case 'area':
        return (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        );
      case 'parking':
        return (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
      case 'floors':
        return (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'furnished':
        return (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 p-3 text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        {getIcon()}
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
