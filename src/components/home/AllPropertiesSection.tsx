'use client';

import React from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyGrid from '@/components/property/PropertyGrid';
import ClientOnly from '@/components/ui/ClientOnly';
import { Button } from '@/components/ui/Button';

interface AllPropertiesSectionProps {
  properties: PropertyCardType[];
  loadingRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onFavoriteToggle: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
  showHeader?: boolean;
}

/**
 * Displays all properties with infinite scroll and load more functionality
 */
export const AllPropertiesSection: React.FC<AllPropertiesSectionProps> = ({
  properties,
  loadingRef,
  hasMore,
  isLoading,
  onLoadMore,
  onFavoriteToggle,
  isFavorited,
  showHeader = true,
}) => {
  return (
    <section>
      {/* Section Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
            Explore all properties
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
            Discover more places to stay
          </p>
        </div>
      </div>
      )}

      {/* Property Grid */}
      <ClientOnly fallback={
        <div className="property-grid">
          {/* Skeleton loading cards */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse transition-colors">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-3 h-20 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      }>
        <PropertyGrid
          properties={properties}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
          className="mb-8"
        />
        
        {/* Infinite scroll trigger and Load More button */}
        {hasMore && (
          <div ref={loadingRef} className="flex flex-col items-center py-8 space-y-4">
            {isLoading ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Loading more properties...</span>
              </div>
            ) : (
              <Button
                onClick={onLoadMore}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Load More Properties
              </Button>
            )}
          </div>
        )}
        
        {!hasMore && properties.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've seen all available properties</p>
          </div>
        )}
      </ClientOnly>
    </section>
  );
};
