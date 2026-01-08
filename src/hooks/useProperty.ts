// =============================================================================
// PROPERTY HOOKS
// Collection of hooks for property-related functionality
// =============================================================================

import { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { PropertyCard } from '@/API';
import { getPropertyCards } from '@/graphql/queries';

const client = generateClient();

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
}
import { fetchPropertyCards, flattenPropertyCards } from '@/lib/properties-json';

// =============================================================================
// FAVORITES MANAGEMENT
// =============================================================================

export function usePropertyFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
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

  const fetchProperties = useCallback(async (limit: number = 20) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try GraphQL first
      const response = await client.graphql({
        query: getPropertyCards,
        variables: { limit }
      });
      const items = (response as any).data?.getPropertyCards?.properties || [];
      if (items.length > 0) {
        // Add missing fields that don't exist in the GraphQL PropertyCard schema
        const processedProperties = items.map((property: any) => ({
          ...property,
          // Add missing fields for frontend compatibility
          ward: property.ward || property.district, // Fallback to district if ward not available
        }));
        setProperties(processedProperties);
        return processedProperties;
      }
    } catch (graphqlError) {
      // Fallback to JSON if GraphQL fails
      try {
        const propertiesData = await fetchPropertyCards();
        const processedProperties = flattenPropertyCards(propertiesData);
        
        if (processedProperties.length > 0) {
          setProperties(processedProperties);
          return processedProperties;
        }
      } catch (jsonError) {
        setError('Failed to load properties from server');
        throw jsonError;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    properties,
    isLoading,
    error,
    fetchProperties,
    setProperties,
  };
}