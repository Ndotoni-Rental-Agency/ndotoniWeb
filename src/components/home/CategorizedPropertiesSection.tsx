import React, { memo } from 'react';
import { PropertyCard } from '@/API';
import { ScrollablePropertySection } from './ScrollablePropertySection';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { PAGINATION } from '@/constants/pagination';
import { PropertyCategory } from '@/hooks/useCategorizedProperties';

interface CategoryPropertyResponse {
  properties: PropertyCard[];
  nextToken?: string;
  count: number;
  category: string;
}

interface CategorizedPropertiesSectionProps {
  nearby: CategoryPropertyResponse;
  lowestPrice: CategoryPropertyResponse;
  mostViewed: CategoryPropertyResponse;
  favorites?: CategoryPropertyResponse;
  recentlyViewed?: CategoryPropertyResponse;
  more: CategoryPropertyResponse;
  onFavoriteToggle: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
  isLoading?: boolean;
  onLoadMoreForCategory: (category: PropertyCategory) => Promise<void>;
  hasMoreForCategory: (category: PropertyCategory) => boolean;
}

const CategorySection = memo(({ 
  title, 
  description, 
  properties, 
  onFavoriteToggle, 
  isFavorited,
  isLoading = false,
  id,
  category,
  onLoadMore,
  hasMore
}: {
  title: string;
  description: string;
  properties: PropertyCard[];
  onFavoriteToggle: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
  isLoading?: boolean;
  id: string;
  category: PropertyCategory;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
}) => {
  const { scrollContainerRef } = useHorizontalScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold: PAGINATION.SCROLL_THRESHOLD
  });

  if (!properties.length && !isLoading) {
    return null; // Don't render empty sections
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>

      {/* Properties Scroll Section */}
      <ScrollablePropertySection
        id={id}
        title="" // Empty title since we have custom header above
        description=""
        properties={properties}
        scrollRef={scrollContainerRef}
        hasMore={hasMore}
        isLoading={isLoading}
        displayedCount={properties.length}
        totalCount={properties.length}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        hideHeader={true} // Hide the default header
      />
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export const CategorizedPropertiesSection = memo(({
  nearby,
  lowestPrice,
  mostViewed,
  favorites,
  recentlyViewed,
  more,
  onFavoriteToggle,
  isFavorited,
  isLoading = false,
  onLoadMoreForCategory,
  hasMoreForCategory
}: CategorizedPropertiesSectionProps) => {
  return (
    <div className="space-y-12">
      {/* Nearby Properties */}
      <CategorySection
        id="nearby-properties"
        title="Near You"
        description="Properties in your area"
        properties={nearby.properties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        isLoading={isLoading}
        category="NEARBY"
        onLoadMore={() => onLoadMoreForCategory('NEARBY')}
        hasMore={hasMoreForCategory('NEARBY')}
      />

      {/* Lowest Price Properties */}
      <CategorySection
        id="lowest-price-properties"
        title="Best Prices"
        description="Most affordable properties"
        properties={lowestPrice.properties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        isLoading={isLoading}
        category="LOWEST_PRICE"
        onLoadMore={() => onLoadMoreForCategory('LOWEST_PRICE')}
        hasMore={hasMoreForCategory('LOWEST_PRICE')}
      />

      {/* Most Viewed Properties */}
      <CategorySection
        id="most-viewed-properties"
        title="Most Popular"
        description="Properties everyone is viewing"
        properties={mostViewed.properties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        isLoading={isLoading}
        category="MOST_VIEWED"
        onLoadMore={() => onLoadMoreForCategory('MOST_VIEWED')}
        hasMore={hasMoreForCategory('MOST_VIEWED')}
      />

      {/* Favorites Section - Only show if user is authenticated and has favorites */}
      {favorites && favorites.properties.length > 0 && (
        <CategorySection
          id="favorites-properties"
          title="Your Favorites"
          description="Properties you've saved"
          properties={favorites.properties}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
          isLoading={isLoading}
          category="FAVORITES"
          onLoadMore={() => onLoadMoreForCategory('FAVORITES')}
          hasMore={hasMoreForCategory('FAVORITES')}
        />
      )}

      {/* Recently Viewed Section - Only show if user is authenticated and has recently viewed */}
      {recentlyViewed && recentlyViewed.properties.length > 0 && (
        <CategorySection
          id="recently-viewed-properties"
          title="Recently Viewed"
          description="Properties you've recently looked at"
          properties={recentlyViewed.properties}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
          isLoading={isLoading}
          category="RECENTLY_VIEWED"
          onLoadMore={() => onLoadMoreForCategory('RECENTLY_VIEWED')}
          hasMore={hasMoreForCategory('RECENTLY_VIEWED')}
        />
      )}

      {/* More Properties Section */}
      <CategorySection
        id="more-properties"
        title="More Properties"
        description="Explore all available properties"
        properties={more.properties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        isLoading={isLoading}
        category="MORE"
        onLoadMore={() => onLoadMoreForCategory('MORE')}
        hasMore={hasMoreForCategory('MORE')}
      />
    </div>
  );
});

CategorizedPropertiesSection.displayName = 'CategorizedPropertiesSection';