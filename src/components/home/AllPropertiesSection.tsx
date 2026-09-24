'use client';

import React from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import SearchPropertyGrid from '@/components/property/SearchPropertyGrid';
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
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                <span>Loading more houses…</span>
              </div>
            ) : (
              <Button
                onClick={onLoadMore}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Show more houses
              </Button>
            )}
          </div>
        )}
        
        {!hasMore && properties.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've seen all the houses for this search</p>
          </div>
        )}
    </section>
  );
};
