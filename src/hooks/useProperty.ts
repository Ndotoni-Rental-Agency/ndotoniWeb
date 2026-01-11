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
    // Initialize from backend data if available, otherwise from localStorage
    if (backendFavorites && backendFavorites.length > 0) {
      return new Set(backendFavorites.map(p => p.propertyId));
    }
    
    // Fallback to localStorage on client-side
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

  // Update favorites when backend data changes
  useEffect(() => {
    if (backendFavorites && backendFavorites.length > 0) {
      const backendFavoriteIds = new Set(backendFavorites.map(p => p.propertyId));
      setFavorites(backendFavoriteIds);
      
      // Sync with localStorage
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
    // Require userId for backend operations
    if (!userId) {
      console.warn('Cannot toggle favorite: user not authenticated');
      return;
    }

    try {
      // Call backend mutation
      const response = await cachedGraphQL.mutate({
        query: toggleFavoriteMutation,
        variables: { userId, propertyId }
      });

      const result = response.data?.toggleFavorite;
      
      if (result?.success) {
        // Update local state based on backend response
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (result.isFavorited) {
            newFavorites.add(propertyId);
          } else {
            newFavorites.delete(propertyId);
          }
          
          // Save to localStorage for offline access
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('ndotoni_favorites', JSON.stringify(Array.from(newFavorites)));
            } catch (error) {
              console.warn('Failed to save favorites to localStorage:', error);
            }
          }
          
          return newFavorites;
        });
      } else {
        console.error('Failed to toggle favorite:', result?.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Fallback to local-only toggle if backend fails
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
    }
  }, [userId]);

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

export function usePropertyCards(userId?: string) {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<PropertyCard[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<PropertyCard[]>([]);

  const fetchProperties = useCallback(async (limit: number = 12, loadMore: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      // Use getAppInitialState for initial load to get personalized sections
      if (!loadMore && properties.length === 0) {
        response = await cachedGraphQL.query({
          query: getAppInitialState,
          variables: { 
            limit,
            ...(userId && { userId }) // Include userId if available
          }
        });
        
        const result = response.data?.getAppInitialState;
        console.log('getAppInitialState result:', result);
        const items = result?.properties?.properties || [];
        const newNextToken = result?.properties?.nextToken;
        const personalizedSections = result?.personalizedSections;
        
        // Set personalized sections and sync with local favorites
        if (personalizedSections?.favorites) {
          setFavorites(personalizedSections.favorites);
          
          // Sync with localStorage for offline access
          if (typeof window !== 'undefined') {
            try {
              const favoriteIds = personalizedSections.favorites.map((p: PropertyCard) => p.propertyId);
              localStorage.setItem('ndotoni_favorites', JSON.stringify(favoriteIds));
            } catch (error) {
              console.warn('Failed to sync favorites to localStorage:', error);
            }
          }
        }
        if (personalizedSections?.recentlyViewed) {
          setRecentlyViewed(personalizedSections.recentlyViewed);
        }
        
        if (items.length === 0) {
          setError('No properties found');
          return [];
        }

        // Process properties
        const processedProperties: PropertyCard[] = items.map((property: any) => ({
          ...property,
          ward: property.ward || property.district,
        }));
        
        setProperties(processedProperties);
        setNextToken(newNextToken);
        setHasMore(!!newNextToken);
        setError(null); // Clear any previous errors on successful processing
        
        return processedProperties;
      } else {
        // Use getPropertyCards for pagination
        response = await cachedGraphQL.query({
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
        setError(null); // Clear any previous errors on successful processing
        
        return processedProperties;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      console.error('Error fetching properties:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [nextToken, properties.length]);

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
    favorites,
    recentlyViewed,
  };
}