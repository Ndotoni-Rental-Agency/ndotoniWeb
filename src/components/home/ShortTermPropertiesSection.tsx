'use client';

import React from 'react';
import type { ShortTermPropertyCard as ShortTermPropertyCardType } from '@/lib/short-term-homepage-cache';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShortTermPropertiesSectionProps {
  lowestPrice: ShortTermPropertyCardType[];
  highestPrice: ShortTermPropertyCardType[];
  topRated: ShortTermPropertyCardType[];
  featured: ShortTermPropertyCardType[];
  recent: ShortTermPropertyCardType[];
}

/**
 * Display short-term properties in categorized sections
 * Similar to CategorizedPropertiesSection but for nightly rentals
 */
export function ShortTermPropertiesSection({
  lowestPrice,
  highestPrice,
  topRated,
  featured,
  recent,
}: ShortTermPropertiesSectionProps) {
  const { language } = useLanguage();

  const sections = [
    {
      title: language === 'sw' ? 'Bei Nafuu' : 'Budget-Friendly Stays',
      properties: lowestPrice,
      category: 'lowestPrice',
    },
    {
      title: language === 'sw' ? 'Zilizo na Ukadiriaji Bora' : 'Top Rated',
      properties: topRated,
      category: 'topRated',
    },
    {
      title: language === 'sw' ? 'Makazi ya Kifahari' : 'Luxury Accommodations',
      properties: highestPrice,
      category: 'highestPrice',
    },
    {
      title: language === 'sw' ? 'Zilizoongezwa Hivi Karibuni' : 'Recently Added',
      properties: recent,
      category: 'recent',
    },
  ];

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        section.properties.length > 0 && (
          <section key={section.category} data-category={section.category}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.properties.map((property) => (
                <ShortTermPropertyCard key={property.propertyId} property={property} />
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
}

/**
 * Short-term property card component
 */
function ShortTermPropertyCard({ property }: { property: ShortTermPropertyCardType }) {
  const { language } = useLanguage();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'sw' ? 'sw-TZ' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <a
      href={`/property/${property.propertyId}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        {property.thumbnail ? (
          <img
            src={property.thumbnail}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}

        {/* Instant Book Badge */}
        {property.instantBookEnabled && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
            {language === 'sw' ? 'Hifadhi Mara Moja' : 'Instant Book'}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.district}, {property.region}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {property.title}
        </h3>

        {/* Property Type & Guests */}
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>{property.propertyType}</span>
          {property.maxGuests > 0 && (
            <>
              <span>•</span>
              <span>{property.maxGuests} {language === 'sw' ? 'wageni' : 'guests'}</span>
            </>
          )}
        </div>

        {/* Rating */}
        {property.totalReviews > 0 && (
          <div className="flex items-center gap-1 text-sm mb-3">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ({property.totalReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(property.nightlyRate, property.currency)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            / {language === 'sw' ? 'usiku' : 'night'}
          </span>
        </div>
      </div>
    </a>
  );
}
