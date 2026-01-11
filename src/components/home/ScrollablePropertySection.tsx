'use client';

import React from 'react';
import { PropertyCard as PropertyCardType } from '@/API';
import PropertyCard from '@/components/property/PropertyCard';
import { ScrollArrows } from '@/components/ui/ScrollArrows';

interface ScrollablePropertySectionProps {
  id: string;
  title: string;
  description: string;
  properties: PropertyCardType[];
  scrollRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoading: boolean;
  displayedCount: number;
  totalCount: number;
  onShowAll?: () => void;
  onFavoriteToggle: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
  hideHeader?: boolean;
}

/**
 * Reusable scrollable property section component
 * Used for nearby, recent, and favorites sections on the home page
 */
export const ScrollablePropertySection: React.FC<ScrollablePropertySectionProps> = ({
  id,
  title,
  description,
  properties,
  scrollRef,
  hasMore,
  isLoading,
  displayedCount,
  totalCount,
  onShowAll,
  onFavoriteToggle,
  isFavorited,
  hideHeader = false,
}) => {
  if (properties.length === 0) return null;

  return (
    <section>
      {/* Section Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors italic">
              {description}
            </p>
          </div>
          {onShowAll && (
            <button 
              onClick={onShowAll}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors"
            >
              Show all
            </button>
          )}
        </div>
      )}

      {/* Scrollable Container */}
      <div className="relative scroll-container">
        <ScrollArrows containerId={id} />
        
        <div 
          ref={scrollRef}
          id={id}
          className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-4 pb-4 -mx-4 px-4 sm:px-0 sm:mx-0 lg:mx-0 lg:px-0 scroll-smooth"
        >
          {properties.map((property) => (
            <div key={property.propertyId} className="flex-none w-44 sm:w-64">
              <PropertyCard 
                property={property}
                onFavoriteToggle={onFavoriteToggle}
                isFavorited={isFavorited(property.propertyId)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
