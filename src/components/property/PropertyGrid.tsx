'use client';

import React, { memo, useMemo } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from './PropertyCard';

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
  className = ''
}) => {
  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(() => {
    return properties.map((property) => (
      <PropertyCard
        key={property.propertyId}
        property={property}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited?.(property.propertyId)}
        className="h-full"
      />
    ));
  }, [properties, onFavoriteToggle, isFavorited]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No properties found</p>
      </div>
    );
  }

  return (
    <div className={`property-grid gap-x-4 gap-y-6 ${className}`}>
      {gridItems}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';

export default PropertyGrid;