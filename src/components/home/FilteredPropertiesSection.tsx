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
 * Displays properties in a grid layout
 */
export const FilteredPropertiesSection = ({
  properties,
  onFavoriteToggle,
  isFavorited,
}: FilteredPropertiesSectionProps) => {
  return (
    <div className="mb-8">
      {/* Property Grid */}
      <ClientOnly fallback={
        <div className="property-grid">
          {/* Skeleton loading cards */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse transition-colors">
              <div className="aspect-[5/4] bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      }>
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard 
              key={property.propertyId} 
              property={property}
              onFavoriteToggle={onFavoriteToggle}
              isFavorited={isFavorited(property.propertyId)}
            />
          ))}
        </div>
      </ClientOnly>
    </div>
  );
};
