import { useState, useEffect, useMemo } from 'react';
import { 
  SearchOptimizedLocationItem, 
  fetchLocations, 
  flattenLocationsForSearch,
  LocationSearch,
  searchLocations
} from '@/lib/location';

/**
 * Custom hook for location search with fuzzy matching
 */
export function useLocationSearch() {
  const [locations, setLocations] = useState<SearchOptimizedLocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load locations on mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const locationsData = await fetchLocations();
        const searchOptimizedLocations = flattenLocationsForSearch(locationsData);
        setLocations(searchOptimizedLocations);
        setError(null);
      } catch (err) {
        console.error('Error loading locations:', err);
        setError('Failed to load locations');
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Create search instance
  const locationSearch = useMemo(() => {
    if (locations.length === 0) return null;
    return new LocationSearch(locations);
  }, [locations]);

  // Search function
  const search = useMemo(() => {
    return (query: string, limit: number = 8) => {
      if (!query || query.length < 2 || locations.length === 0) {
        return [];
      }
      return searchLocations(locations, query, limit);
    };
  }, [locations]);

  return {
    locations,
    search,
    locationSearch,
    isLoading,
    error
  };
}

/**
 * Custom hook for debounced location search
 */
export function useDebouncedLocationSearch(query: string, delay: number = 200) {
  const { search, isLoading, error } = useLocationSearch();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  // Get search results
  const results = useMemo(() => {
    return search(debouncedQuery);
  }, [search, debouncedQuery]);

  return {
    results,
    isLoading,
    error,
    query: debouncedQuery
  };
}