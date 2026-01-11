// =============================================================================
// PROPERTY HOOKS
// Collection of hooks for property-related functionality
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { PropertyCard } from '@/API';
import { getAppInitialState, getPropertyCards } from '@/graphql/queries';
import { toggleFavorite as toggleFavoriteMutation } from '@/graphql/mutations';
import { cachedGraphQL } from '@/lib/cache';

// Define PropertyFilters interface here since it's frontend-specific
interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  priceSort?: 'asc' | 'desc';
}

// =============================================================================
// FAVORITES MANAGEMENT
// =============================================================================

export function usePropertyFavorites(backendFavorites?: PropertyCard[], userId?: string) {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (backendFavorites && backendFavorites.length > 0) {
      return new Set(backendFavorites.map(p => p.propertyId));
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ndotoni_favorites');
        if (stored) return new Set(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to load favorites from localStorage:', error);
      }
    }
    return new Set();
  });

  useEffect(() => {
    if (backendFavorites && backendFavorites.length > 0) {
      const backendFavoriteIds = new Set(backendFavorites.map(p => p.propertyId));
      setFavorites(backendFavoriteIds);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ndotoni_favorites', JSON.stringify(Array.from(backendFavoriteIds)));
        } catch (error) {
          console.warn('Failed to sync favorites to localStorage:', error);
        }
      }
    }
  }, [backendFavorites]);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    if (!userId) {
      console.warn('Cannot toggle favorite: user not authenticated');
      return;
    }

    try {
      const response = await cachedGraphQL.mutate({
        query: toggleFavoriteMutation,
        variables: { userId, propertyId },
      });

      const result = response.data?.toggleFavorite;
      if (result?.success) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (result.isFavorited) newFavorites.add(propertyId);
          else newFavorites.delete(propertyId);

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('ndotoni_favorites', JSON.stringify(Array.from(newFavorites)));
            } catch {}
          }
          return newFavorites;
        });
      } else {
        console.error('Failed to toggle favorite:', result?.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(propertyId)) newFavorites.delete(propertyId);
        else newFavorites.add(propertyId);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('ndotoni_favorites', JSON.stringify(Array.from(newFavorites)));
          } catch {}
        }
        return newFavorites;
      });
    }
  }, [userId]);

  const isFavorited = useCallback((propertyId: string) => favorites.has(propertyId), [favorites]);

  return { favorites: Array.from(favorites), toggleFavorite, isFavorited };
}

// =============================================================================
// FILTERS MANAGEMENT
// =============================================================================

export function usePropertyFilters(initialFilters: PropertyFilters = {}) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const updateFilter = useCallback((key: keyof PropertyFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined || value === '' || value === null) delete newFilters[key];
      else newFilters[key] = value;

      if (key === 'region') {
        delete newFilters.district;
        delete newFilters.ward;
      } else if (key === 'district') {
        delete newFilters.ward;
      }
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return { filters, updateFilter, clearFilters, hasActiveFilters, setFilters };
}

// =============================================================================
// RECENTLY VIEWED MANAGEMENT
// =============================================================================

export function useRecentlyViewed(backendRecentlyViewed?: PropertyCard[]) {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    if (backendRecentlyViewed && backendRecentlyViewed.length > 0) {
      return backendRecentlyViewed.map(p => p.propertyId);
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ndotoni_recently_viewed');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    if (backendRecentlyViewed && backendRecentlyViewed.length > 0) {
      const backendRecentIds = backendRecentlyViewed.map(p => p.propertyId);
      setRecentlyViewed(backendRecentIds);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ndotoni_recently_viewed', JSON.stringify(backendRecentIds));
        } catch {}
      }
    }
  }, [backendRecentlyViewed]);

  const addToRecentlyViewed = useCallback((propertyId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== propertyId);
      const updated = [propertyId, ...filtered].slice(0, 20);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ndotoni_recently_viewed', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ndotoni_recently_viewed');
      } catch {}
    }
  }, []);

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
}

// =============================================================================
// SEARCH FUNCTIONALITY
// =============================================================================

export function usePropertySearch() {
  const [searchResults, setSearchResults] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProperties = useCallback(async (filters: PropertyFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      setSearchResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { searchResults, isLoading, error, searchProperties };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

export function usePropertyCards(userId?: string) {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<PropertyCard[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<PropertyCard[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchProperties = useCallback(
    async (limit: number = 12, loadMore: boolean = false) => {
      if (isLoading && !loadMore) return [];

      setIsLoading(true);
      setError(null);

      try {
        const response = await cachedGraphQL.query({
          query: getPropertyCards,
          variables: { limit, nextToken: loadMore ? nextToken : null },
        });

        const result = response.data?.getPropertyCards;
        const items = result?.properties || [];
        const newNextToken = result?.nextToken;

        if (!loadMore) {
          setProperties(items);
          setHasInitialized(true);
        } else {
          setProperties(prev => [...prev, ...items]);
        }

        setNextToken(newNextToken);
        setHasMore(!!newNextToken);
        setError(null);

        return items;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
        setHasInitialized(true);
        console.error('Error fetching properties:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [nextToken, isLoading]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) return fetchProperties(12, true);
  }, [fetchProperties, isLoading, hasMore]);

  useEffect(() => {
    if (!hasInitialized) fetchProperties();
  }, [fetchProperties, hasInitialized]);

  return {
    properties,
    isLoading,
    error,
    fetchProperties,
    loadMore,
    hasMore,
    hasInitialized,
    setProperties,
    favorites,
    recentlyViewed,
  };
}
