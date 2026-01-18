/**
 * React Hook for Region Search with Fuzzy Matching
 * 
 * Provides fuzzy search functionality for regions only using Fuse.js.
 * Much simpler and faster than the old location search.
 */

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { fetchRegions, type Region } from '@/lib/location/hierarchical';

/**
 * Fuse.js configuration for region search
 */
const FUSE_OPTIONS = {
  keys: ['name'],
  threshold: 0.3, // Lower = more strict matching (0.0 = exact, 1.0 = match anything)
  distance: 100, // Maximum distance between matched characters
  minMatchCharLength: 1, // Minimum length of match to be considered
  includeScore: true,
  ignoreLocation: true, // Don't care where in the string the match is
  useExtendedSearch: false,
};

export interface UseRegionSearchReturn {
  results: Region[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for searching regions with debouncing and Fuse.js fuzzy matching
 */
export function useRegionSearch(query: string, debounceMs = 200): UseRegionSearchReturn {
  const [regions, setRegions] = useState<Region[]>([]);
  const [results, setResults] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  // Create Fuse instance when regions are loaded
  const fuse = useMemo(() => {
    if (regions.length === 0) return null;
    return new Fuse(regions, FUSE_OPTIONS);
  }, [regions]);
  
  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [query, debounceMs]);
  
  // Load regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchRegions();
        setRegions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load regions');
        console.error('Error loading regions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRegions();
  }, []);
  
  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim() || !fuse) {
      setResults([]);
      return;
    }
    
    // Use Fuse.js for fuzzy search
    const fuseResults = fuse.search(debouncedQuery, { limit: 10 });
    const searchResults = fuseResults.map(result => result.item);
    
    setResults(searchResults);
  }, [debouncedQuery, fuse]);
  
  return {
    results,
    isLoading,
    error
  };
}
