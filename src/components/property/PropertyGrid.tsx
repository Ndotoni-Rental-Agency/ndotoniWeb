'use client';

import React, { memo, useMemo } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from '@/components/property/properyCard';

interface PropertyGridProps {
  properties: PropertyCardType[];
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: (propertyId: string) => boolean;
  className?: string;
}

const PropertyGrid = memo<PropertyGridProps>(({
  properties,
  onFavoriteToggle,
  isFavorited,
  className = '',
}) => {
  const gridItems = useMemo(() => {
    return properties.map((property) => (
      <div
        key={property.propertyId}
        className="
          flex-shrink-0
          w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6
          px-2
        "
      >
        <PropertyCard
          property={property}
          isFavorited={isFavorited?.(property.propertyId)}
          onFavoriteToggle={onFavoriteToggle}
        />
      </div>
    ));
  }, [properties, onFavoriteToggle, isFavorited]);

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
        flex overflow-x-auto -mx-2
        ${className}
        hide-scrollbar
      `}
    >
      {gridItems}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';
export default PropertyGrid;
