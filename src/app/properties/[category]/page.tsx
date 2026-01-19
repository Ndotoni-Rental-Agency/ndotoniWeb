'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCategoryProperties, PropertyCategory } from '@/hooks/useCategorizedProperties';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PAGINATION } from '@/constants/pagination';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyLoadingWrapper from '@/components/property/PropertyLoadingWrapper';

const categoryTitles: Record<PropertyCategory, { title: string; description: string }> = {
  NEARBY: { title: 'Properties Near You', description: 'Properties in your area' },
  LOWEST_PRICE: { title: 'Best Prices', description: 'Most affordable properties' },
  FAVORITES: { title: 'Your Favorites', description: 'Properties you\'ve saved' },
  MOST_VIEWED: { title: 'Most Popular', description: 'Properties everyone is viewing' },
  RECENTLY_VIEWED: { title: 'Recently Viewed', description: 'Properties you\'ve recently looked at' },
  MORE: { title: 'More Properties', description: 'Explore all available properties' },
};

export default function CategoryPage() {
  const params = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const category = (params.category as string)?.toUpperCase() as PropertyCategory;
  
  const { properties, isLoading, error, loadMore, hasMore } = useCategoryProperties(category);
  const { toggleFavorite, isFavorited } = usePropertyFavorites([]);

  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
    threshold: PAGINATION.SCROLL_THRESHOLD
  });

  if (!categoryTitles[category]) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The requested category does not exist.</p>
        </div>
      </div>
    );
  }

  const { title, description } = categoryTitles[category];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error loading properties</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Properties Grid with Loading */}
        <PropertyLoadingWrapper isLoading={isLoading && properties.length === 0} skeletonCount={8}>
          {properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.propertyId}
                  property={property}
                  onFavoriteToggle={toggleFavorite}
                  isFavorited={isFavorited(property.propertyId)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {properties.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties found</h3>
              <p className="text-gray-500 dark:text-gray-400">There are no properties in this category at the moment.</p>
            </div>
          )}
        </PropertyLoadingWrapper>

        {/* Loading More Indicator */}
        {hasMore && (
          <div ref={loadingRef} className="text-center py-8">
            {isLoading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}