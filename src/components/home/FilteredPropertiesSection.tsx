'use client';

import React from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from '@/components/property/PropertyCard';
import ClientOnly from '@/components/ui/ClientOnly';
import { Button } from '@/components/ui/Button';

interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  priceSort?: 'asc' | 'desc';
}

interface FilteredPropertiesSectionProps {
  properties: PropertyCardType[];
  filters: PropertyFilters;
  onClearFilters: () => void;
  onFavoriteToggle: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
}

/**
 * Displays filtered properties with header and clear filters option
 */
export const FilteredPropertiesSection: React.FC<FilteredPropertiesSectionProps> = ({
  properties,
  filters,
  onClearFilters,
  onFavoriteToggle,
  isFavorited,
}) => {
  return (
    <div className="mb-8">
      {/* Header with count and actions */}
      <div className="flex items-center justify-between mb-4">
        <ClientOnly fallback={
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
              Loading stays...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
              Rent monthly or longer
            </p>
          </div>
        }>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
              {properties.length > 300 ? '300+' : properties.length} stays
              {filters.ward ? (
                <span className="text-gray-600 dark:text-gray-400 font-normal transition-colors"> in {filters.ward}</span>
              ) : filters.region && (
                <span className="text-gray-600 dark:text-gray-400 font-normal transition-colors"> in {filters.region}</span>
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
              {filters.ward ? `${filters.ward}, ${filters.district} • ` : filters.district ? `${filters.district} • ` : ''}
              Rent monthly or longer
            </p>
          </div>
        </ClientOnly>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            onClick={onClearFilters}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Clear filters
          </Button>
          <Button 
            variant="outline"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            }
          >
            Sort
          </Button>
        </div>
      </div>
      
      {/* Property Grid */}
      <ClientOnly fallback={
        <div className="property-grid">
          {/* Skeleton loading cards */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse transition-colors">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
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
