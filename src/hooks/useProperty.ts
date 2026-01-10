// =============================================================================
// PROPERTY HOOKS
// Collection of hooks for property-related functionality
// =============================================================================

import { useState, useCallback } from 'react';
import { PropertyCard } from '@/API';
import { getPropertyCards } from '@/graphql/queries';
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

export function usePropertyFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Initialize from localStorage on client-side
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ndotoni_favorites');
        if (stored) {
          const favoriteIds = JSON.parse(stored);
          return new Set(favoriteIds);
        }
      } catch (error) {
        console.warn('Failed to load favorites from localStorage:', error);
      }
    }
    return new Set();
  });

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ndotoni_favorites', JSON.stringify(Array.from(newFavorites)));
        } catch (error) {
          console.warn('Failed to save favorites to localStorage:', error);
        }
      }
      
      return newFavorites;
    });
  }, []);

  const isFavorited = useCallback((propertyId: string) => {
    return favorites.has(propertyId);
  }, [favorites]);

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorited,
  };
}

// =============================================================================
// FILTERS MANAGEMENT
// =============================================================================

export function usePropertyFilters(initialFilters: PropertyFilters = {}) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const updateFilter = useCallback((key: keyof PropertyFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined || value === '' || value === null) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      
      // Clear dependent filters when parent changes
      if (key === 'region') {
        delete newFilters.district;
        delete newFilters.ward;
      } else if (key === 'district') {
        delete newFilters.ward;
      }
      
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    setFilters,
  };
}

// =============================================================================
// RECENTLY VIEWED MANAGEMENT
// =============================================================================

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    // Initialize from localStorage on client-side
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ndotoni_recently_viewed');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load recently viewed from localStorage:', error);
      }
    }
    return [];
  });

  const addToRecentlyViewed = useCallback((propertyId: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(id => id !== propertyId);
      // Add to beginning and limit to 20 items
      const updated = [propertyId, ...filtered].slice(0, 20);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ndotoni_recently_viewed', JSON.stringify(updated));
        } catch (error) {
          console.warn('Failed to save recently viewed to localStorage:', error);
        }
      }
      
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ndotoni_recently_viewed');
      } catch (error) {
        console.warn('Failed to clear recently viewed from localStorage:', error);
      }
    }
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
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
      // Search functionality to be implemented
      // For now, return empty results
      setSearchResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchProperties,
  };
}

// =============================================================================
// DATA FETCHING
// =============================================================================

export function usePropertyCards() {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = useCallback(async (limit: number = 12, loadMore: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cachedGraphQL.query({
        query: getPropertyCards,
        variables: { 
          limit,
          nextToken: loadMore ? nextToken : null
        }
      });
      
      const result = response.data?.getPropertyCards;
      const items = result?.properties || [];
      const newNextToken = result?.nextToken;
      
      if (items.length === 0 && !loadMore) {
        setError('No properties found');
        return [];
      }

      // Process properties
      const processedProperties: PropertyCard[] = items.map((property: any) => ({
        ...property,
        ward: property.ward || property.district,
      }));
      
      // Update state
      if (loadMore) {
        setProperties(prev => [...prev, ...processedProperties]);
      } else {
        setProperties(processedProperties);
      }
      
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
      
      return processedProperties;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      console.error('Error fetching properties:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [nextToken]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      return fetchProperties(12, true);
    }
  }, [fetchProperties, isLoading, hasMore]);

  return {
    properties,
    isLoading,
    error,
    fetchProperties,
    loadMore,
    hasMore,
    setProperties,
  };
}