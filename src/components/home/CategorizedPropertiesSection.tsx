import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { PropertyCard } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { PropertyCategory } from '@/hooks/useCategorizedProperties';
import PropertyGrid from '../property/PropertyGrid';
import { ChevronRight } from 'lucide-react';

const INITIAL_VISIBLE = 4;
const INITIAL_VISIBLE_DESKTOP = 8;

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
  const { t, language } = useLanguage();

  // Shuffle and slice on each mount
  const visibleProperties = useMemo(() => {
    const shuffled = shuffle(properties);
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return shuffled.slice(0, INITIAL_VISIBLE);
    }
    return shuffled.slice(0, INITIAL_VISIBLE_DESKTOP);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  const hasMoreProperties = properties.length > INITIAL_VISIBLE || hasMore;

  if (!properties.length && !isLoading) {
    return null;
  }

  // Map category to search query param
  const categorySearchParam = category === 'NEARBY' ? 'nearby' 
    : category === 'LOWEST_PRICE' ? 'price_asc'
    : category === 'MOST_VIEWED' ? 'popular'
    : 'all';

  return (
    <div className="space-y-5 sm:space-y-6" data-category={category}>
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight text-ink-900 dark:text-white">
            {title}
          </h2>
          <p className="text-ink-500 text-xs sm:text-sm mt-1">{description}</p>
        </div>
        {hasMoreProperties && (
          <Link
            href={`/search?sort=${categorySearchParam}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap transition-colors"
          >
            {language === 'sw' ? 'Ona zote' : 'See all'}
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      <PropertyGrid
        properties={visibleProperties}
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
    <div className="space-y-12 sm:space-y-16">
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
