'use client';

import React, { memo, useMemo, useRef, useState, useEffect } from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from '@/components/property/properyCard';
import { ChevronRight } from 'lucide-react';

interface PropertyGridProps {
  properties: PropertyCardType[];
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: (propertyId: string) => boolean;
  className?: string;
  keyPrefix?: string; // Optional prefix to make keys unique across categories
  priceLabel?: string; // e.g., "per night" or "per month"
  urlPath?: string; // e.g., "/property/" or "/short-property/"
}

const PropertyGrid = memo<PropertyGridProps>(({
  properties,
  onFavoriteToggle,
  isFavorited,
  className = '',
  keyPrefix = '',
  priceLabel = 'per month',
  urlPath = '/property/',
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const gridItems = useMemo(() => {
    return properties.map((property, index) => (
      <div
        key={keyPrefix ? `${keyPrefix}-${property.propertyId}-${index}` : `${property.propertyId}-${index}`}
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
          priceLabel={priceLabel}
          urlPath={urlPath}
        />
      </div>
    ));
  }, [properties, onFavoriteToggle, isFavorited, keyPrefix, priceLabel, urlPath]);

  // Update scroll indicator
  const updateScroll = () => {
    if (!gridRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScroll();
    const el = gridRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [properties]);

  // Handle clicking the arrow
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // STOP the click from reaching the cards
    if (!gridRef.current) return;
    gridRef.current.scrollBy({
      left: gridRef.current.clientWidth / 2, // scroll half container width
      behavior: 'smooth',
    });
  };

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
    <div className="relative">
      {/* Scrollable grid */}
      <div
        ref={gridRef}
        className={`
          flex overflow-x-auto -mx-2
          ${className}
          hide-scrollbar
        `}
      >
        {gridItems}
      </div>

      {/* Right scroll arrow */}
      {canScrollRight && (
        <button
          onClick={handleArrowClick}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10"
        >
          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
});

PropertyGrid.displayName = 'PropertyGrid';
export default PropertyGrid;
