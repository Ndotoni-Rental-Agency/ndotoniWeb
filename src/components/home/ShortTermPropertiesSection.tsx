'use client';

import React, { memo } from 'react';
import { ShortTermPropertyCard } from '@/lib/short-term-homepage-cache';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertyGrid from '../property/PropertyGrid';
import { PropertyCard } from '@/API';

interface ShortTermPropertiesSectionProps {
  lowestPrice: ShortTermPropertyCard[];
  highestPrice: ShortTermPropertyCard[];
  topRated: ShortTermPropertyCard[];
  featured: ShortTermPropertyCard[];
  recent: ShortTermPropertyCard[];
}

/**
 * Convert ShortTermPropertyCard to PropertyCard format for rendering
 */
function convertToPropertyCard(shortTermProp: ShortTermPropertyCard): PropertyCard {
  return {
    propertyId: shortTermProp.propertyId,
    title: shortTermProp.title,
    propertyType: shortTermProp.propertyType as any, // Cast to satisfy PropertyType enum
    region: shortTermProp.region,
    district: shortTermProp.district,
    monthlyRent: shortTermProp.nightlyRate, // Use nightlyRate as the price
    currency: shortTermProp.currency,
    thumbnail: shortTermProp.thumbnail,
    bedrooms: 0, // Not available in short-term card
    verified: false,
    __typename: 'PropertyCard',
  };
}

const CategorySection = memo(({ 
  title, 
  description, 
  properties,
  id,
}: {
  title: string;
  description: string;
  properties: ShortTermPropertyCard[];
  id: string;
}) => {
  if (!properties.length) {
    return null;
  }

  // Convert short-term properties to PropertyCard format
  const convertedProperties = properties.map(convertToPropertyCard);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-stone-200/70 dark:border-gray-700/70 pb-3">
        <div>
          <h2 className="section-heading text-balance">{title}</h2>
          <p className="section-sub">{description}</p>
        </div>
      </div>
      <PropertyGrid
        properties={convertedProperties}
        onFavoriteToggle={() => {}}
        isFavorited={() => false}
        keyPrefix={id}
        priceLabel="night"
        urlPath="/short-property/"
      />
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export const ShortTermPropertiesSection = memo(({
  lowestPrice,
  highestPrice,
  topRated,
  featured,
  recent,
}: ShortTermPropertiesSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-14 sm:space-y-16">
      {/* Recent Properties */}
      {recent.length > 0 && (
        <CategorySection
          id="recent-short-term"
          title={t('properties.nearbyTitle')}
          description="Recently added short-term stays"
          properties={recent}
        />
      )}

      {/* Lowest Price */}
      {lowestPrice.length > 0 && (
        <CategorySection
          id="lowest-price-short-term"
          title={t('properties.bestPricesTitle')}
          description="Best value short-term stays"
          properties={lowestPrice}
        />
      )}

      {/* Top Rated */}
      {topRated.length > 0 && (
        <CategorySection
          id="top-rated-short-term"
          title="Top Rated Stays"
          description="Highly rated by guests"
          properties={topRated}
        />
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <CategorySection
          id="featured-short-term"
          title={t('properties.featuredTitle') || 'Featured Stays'}
          description="Hand-picked properties for you"
          properties={featured}
        />
      )}

      {/* Highest Price (Premium) */}
      {highestPrice.length > 0 && (
        <CategorySection
          id="premium-short-term"
          title={t('properties.premiumTitle') || 'Premium Stays'}
          description="Luxury short-term accommodations"
          properties={highestPrice}
        />
      )}
    </div>
  );
});

ShortTermPropertiesSection.displayName = 'ShortTermPropertiesSection';
