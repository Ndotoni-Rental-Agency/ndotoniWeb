'use client';

import React from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import SearchPropertyGrid from '@/components/property/SearchPropertyGrid';
import ClientOnly from '@/components/ui/ClientOnly';
import { Button } from '@/components/ui/Button';

interface AllPropertiesSectionProps {
  properties: PropertyCardType[];
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
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors italic">
            Discover more places to stay
          </p>
        </div>
      </div>
      )}

      {/* Property Grid */}
      <ClientOnly fallback={
        <div className="search-property-grid">
          {/* Skeleton loading cards */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                <div className="flex-1 p-3 sm:p-4 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }>
        <SearchPropertyGrid
          properties={properties}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
          className="mb-8"
        />
        
        {/* Load More button (manual) */}
        {hasMore && (
          <div className="flex flex-col items-center py-8 space-y-4">
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
