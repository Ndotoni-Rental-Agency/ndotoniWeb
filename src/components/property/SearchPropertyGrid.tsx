'use client';

import React, { memo, useMemo } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchPropertyCard from './SearchPropertyCard';

interface SearchPropertyGridProps {
  properties: PropertyCardType[];
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: (propertyId: string) => boolean;
  className?: string;
  /** Stagger cards in on mount (homepage / fresh search results). */
  stagger?: boolean;
}

// Keep the stagger snappy: only the first row or two feel sequential, then it
// settles so a long list never crawls in.
const STAGGER_STEP_MS = 60;
const MAX_STAGGERED = 8;

const SearchPropertyGrid = memo<SearchPropertyGridProps>(({
  properties,
  onFavoriteToggle,
  isFavorited,
  className = '',
  stagger = false,
}) => {
  const { language } = useLanguage();
  // Memoize the grid items to prevent unnecessary re-renders
  const gridItems = useMemo(() => {
    return properties.map((property, index) => (
      <SearchPropertyCard
        key={property.propertyId}
        priority={index < 4}
        property={property}
        onFavoriteToggle={onFavoriteToggle}
        isFavorited={isFavorited?.(property.propertyId)}
        enterDelay={
          stagger && index < MAX_STAGGERED ? index * STAGGER_STEP_MS : 0
        }
        className="w-full"
      />
    ));
  }, [properties, onFavoriteToggle, isFavorited, stagger]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{language === 'sw' ? 'Hakuna nyumba zilizopatikana' : 'No homes found'}</p>
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