import React, { memo } from 'react';
import { PropertyCard } from '@/API';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { PAGINATION } from '@/constants/pagination';
import { PropertyCategory } from '@/hooks/useCategorizedProperties';
import PropertyGrid from '../property/PropertyGrid';

interface CategoryPropertyResponse {
  properties: PropertyCard[];
  nextToken?: string;
  count: number;
  category: string;
}

interface CategorizedPropertiesSectionProps {
  nearby: CategoryPropertyResponse;
  lowestPrice: CategoryPropertyResponse;
  mostViewed?: CategoryPropertyResponse;
  favorites?: CategoryPropertyResponse;
  recentlyViewed?: CategoryPropertyResponse;
  more?: CategoryPropertyResponse;
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
    <div className="space-y-4" data-category={category}>
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
      <PropertyGrid
        properties={properties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        keyPrefix={category}
      />
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export const CategorizedPropertiesSection = memo(({
  nearby,
  lowestPrice,
  mostViewed,
  more,
  onFavoriteToggle,
  isFavorited,
  isLoading = false,
  onLoadMoreForCategory,
  hasMoreForCategory
}: CategorizedPropertiesSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-12">
      {/* Nearby Properties (Recently Added) */}
      <CategorySection
        id="nearby-properties"
        title={t('properties.nearbyTitle')}
        description={t('properties.nearbySubtitle')}
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
        title={t('properties.bestPricesTitle')}
        description={t('properties.bestPricesSubtitle')}
        properties={lowestPrice.properties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        isLoading={isLoading}
        category="LOWEST_PRICE"
        onLoadMore={() => onLoadMoreForCategory('LOWEST_PRICE')}
        hasMore={hasMoreForCategory('LOWEST_PRICE')}
      />

      {/* Most Viewed Properties (Featured) */}
      {mostViewed && mostViewed.properties.length > 0 && (
        <CategorySection
          id="most-viewed-properties"
          title={t('properties.featuredTitle') || 'Featured Properties'}
          description={t('properties.featuredSubtitle') || 'Most popular properties'}
          properties={mostViewed.properties}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
          isLoading={isLoading}
          category="MOST_VIEWED"
          onLoadMore={() => onLoadMoreForCategory('MOST_VIEWED')}
          hasMore={hasMoreForCategory('MOST_VIEWED')}
        />
      )}

      {/* Premium Properties (Highest Price) */}
      {more && more.properties.length > 0 && (
        <CategorySection
          id="more-properties"
          title={t('properties.premiumTitle') || 'Premium Properties'}
          description={t('properties.premiumSubtitle') || 'Luxury and high-end properties'}
          properties={more.properties}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={isFavorited}
          isLoading={isLoading}
          category="MORE"
          onLoadMore={() => onLoadMoreForCategory('MORE')}
          hasMore={hasMoreForCategory('MORE')}
        />
      )}
    </div>
  );
});

CategorizedPropertiesSection.displayName = 'CategorizedPropertiesSection';