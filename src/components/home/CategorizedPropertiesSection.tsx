import React, { memo, useState, useMemo } from 'react';
import { PropertyCard } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { PropertyCategory } from '@/hooks/useCategorizedProperties';
import PropertyGrid from '../property/PropertyGrid';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Show 4 properties initially (1 row on lg), expand to show all
const INITIAL_VISIBLE = 8;

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
  const [expanded, setExpanded] = useState(false);
  const { t, language } = useLanguage();

  const visibleProperties = useMemo(() => {
    if (expanded) return properties;
    return properties.slice(0, INITIAL_VISIBLE);
  }, [properties, expanded]);

  const hasHiddenProperties = properties.length > INITIAL_VISIBLE;

  if (!properties.length && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-5" data-category={category}>
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 border-b border-stone-200/70 pb-3">
        <div>
          <h2 className="section-heading text-balance">{title}</h2>
          <p className="section-sub">{description}</p>
        </div>
      </div>
      <PropertyGrid
        properties={visibleProperties}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited}
        keyPrefix={category}
      />
      {/* View more / collapse button */}
      {(hasHiddenProperties || hasMore) && (
        <div className="flex justify-center pt-4 pb-2">
          <button
            onClick={() => {
              if (!expanded) {
                setExpanded(true);
                // Also fetch more from backend if available
                if (hasMore) onLoadMore();
              } else {
                setExpanded(false);
              }
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-stone-300 dark:border-gray-600 text-sm font-medium text-ink-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-400 dark:hover:text-brand-400 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {expanded
              ? (language === 'sw' ? 'Punguza' : 'Show less')
              : (language === 'sw' ? `Ona zaidi (${properties.length - INITIAL_VISIBLE}+)` : `View more (${properties.length - INITIAL_VISIBLE}+)`)}
            <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
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
    <div className="space-y-14 sm:space-y-16">
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
