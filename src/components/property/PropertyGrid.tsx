'use client';

import React, { memo, useMemo } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from '@/components/property/properyCard';

interface PropertyGridProps {
  properties: PropertyCardType[];
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: (propertyId: string) => boolean;
  className?: string;
  keyPrefix?: string;
  priceLabel?: string;
  urlPath?: string;
}

const PropertyGrid = memo<PropertyGridProps>(({
  properties,
  onFavoriteToggle,
  isFavorited,
  className = '',
  keyPrefix = '',
  priceLabel,
  urlPath = '/property/',
}) => {
  const gridItems = useMemo(() => {
    return properties.map((property, index) => (
      <div
        key={keyPrefix ? `${keyPrefix}-${property.propertyId}-${index}` : `${property.propertyId}-${index}`}
      >
        <PropertyCard
          property={property}
          isFavorited={isFavorited?.(property.propertyId)}
          onFavoriteToggle={onFavoriteToggle}
          priceLabel={priceLabel}
          urlPath={urlPath}
        />
      </div>
    ));
  }, [properties, onFavoriteToggle, isFavorited, keyPrefix, priceLabel, urlPath]);

  if (properties.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No properties found
        </p>
      </div>
    );
  }

  return (
    <div
      className={`
        grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
        gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10
        ${className}
      `}
    >
      {gridItems}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';
export default PropertyGrid;
