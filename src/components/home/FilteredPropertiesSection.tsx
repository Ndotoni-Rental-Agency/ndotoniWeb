'use client';

import React from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from '@/components/property/PropertyCard';
import ClientOnly from '@/components/ui/ClientOnly';

interface FilteredPropertiesSectionProps {
  properties: PropertyCardType[];
  onFavoriteToggle: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
}

/**
 * Displays properties in a horizontal scrollable layout (like recently viewed)
 */
export const FilteredPropertiesSection = ({
  properties,
  onFavoriteToggle,
  isFavorited,
}: FilteredPropertiesSectionProps) => {
  return (
    <div className="mb-8">
      {/* Property Scrollable Container */}
      <ClientOnly fallback={
        <div className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-4 pb-4 -mx-4 px-4 sm:px-0 sm:mx-0 lg:mx-0 lg:px-0 scroll-smooth">
          {/* Skeleton loading cards */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-none w-44 sm:w-64 bg-white dark:bg-gray-800 rounded-lg sm:rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse transition-colors">
              <div className="w-full h-32 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-2 sm:p-3 min-h-[4.5rem] sm:min-h-[5rem] space-y-1 sm:space-y-2">
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20 mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      }>
        <div className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-4 pb-4 -mx-4 px-4 sm:px-0 sm:mx-0 lg:mx-0 lg:px-0 scroll-smooth">
          {properties.map((property) => (
            <div key={property.propertyId} className="flex-none w-44 sm:w-64">
              <PropertyCard 
                property={property}
                onFavoriteToggle={onFavoriteToggle}
                isFavorited={isFavorited(property.propertyId)}
              />
            </div>
          ))}
        </div>
      </ClientOnly>
    </div>
  );
};
