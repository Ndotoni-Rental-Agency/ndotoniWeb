import { useState, useCallback, useMemo } from 'react';
import { PropertyCard } from '@/API';

interface PropertySection {
  properties: PropertyCard[];
  displayedCount: number;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export function usePropertySection(
  allProperties: PropertyCard[],
  initialCount: number = 8,
  loadIncrement: number = 4
): PropertySection {
  const [displayedCount, setDisplayedCount] = useState(initialCount);

  const properties = useMemo(() => {
    return allProperties.slice(0, displayedCount);
  }, [allProperties, displayedCount]);

  const hasMore = useMemo(() => {
    return displayedCount < allProperties.length;
  }, [displayedCount, allProperties.length]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayedCount(prev => Math.min(prev + loadIncrement, allProperties.length));
    }
  }, [hasMore, loadIncrement, allProperties.length]);

  const reset = useCallback(() => {
    setDisplayedCount(initialCount);
  }, [initialCount]);

  return {
    properties,
    displayedCount,
    hasMore,
    loadMore,
    reset
  };
}

// Specific hooks for each section
export function useNearbyProperties(allProperties: PropertyCard[]) {
  return usePropertySection(allProperties, 8, 4);
}

export function useRecentlyViewedProperties(allProperties: PropertyCard[]) {
  return usePropertySection(allProperties, 6, 3);
}

export function useFavoriteProperties(allProperties: PropertyCard[]) {
  return usePropertySection(allProperties, 4, 2);
}