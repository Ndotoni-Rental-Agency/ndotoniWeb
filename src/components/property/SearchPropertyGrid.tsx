'use client';

import React, { memo, useMemo } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import SearchPropertyCard from './SearchPropertyCard';

interface SearchPropertyGridProps {
  properties: PropertyCardType[];
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: (propertyId: string) => boolean;
  className?: string;
}

const SearchPropertyGrid = memo<SearchPropertyGridProps>(({
  properties,
  onFavoriteToggle,
  isFavorited,
  className = ''
}) => {
  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(() => {
    return properties.map((property) => (
      <SearchPropertyCard
        key={property.propertyId}
        property={property}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited?.(property.propertyId)}
        className="w-full"
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
    <div className={`search-property-grid ${className}`}>
      {gridItems}
    </div>
  );
});

SearchPropertyGrid.displayName = 'SearchPropertyGrid';

export default SearchPropertyGrid;