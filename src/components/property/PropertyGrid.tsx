'use client';

import React, { memo, useMemo } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: PropertyCardType[];
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: (propertyId: string) => boolean;
  className?: string;
  maxItems?: number;
}

const PropertyGrid = memo<PropertyGridProps>(({
  properties,
  onFavoriteToggle,
  isFavorited,
  className = '',
  maxItems
}) => {
  // Memoize the displayed properties to avoid recalculation
  const displayedProperties = useMemo(() => {
    return maxItems ? properties.slice(0, maxItems) : properties;
  }, [properties, maxItems]);

  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(() => {
    return displayedProperties.map((property) => (
      <PropertyCard
        key={property.propertyId}
        property={property}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited?.(property.propertyId)}
        className="h-full"
      />
    ));
  }, [displayedProperties, onFavoriteToggle, isFavorited]);

  if (displayedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No properties found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {gridItems}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';

export default PropertyGrid;