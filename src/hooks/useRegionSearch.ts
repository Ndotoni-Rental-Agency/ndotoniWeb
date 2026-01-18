/**
 * React Hook for Region Search with Fuzzy Matching
 * 
 * Provides fuzzy search functionality for regions only.
 * Much simpler and faster than the old location search.
 */

import { useState, useEffect } from 'react';
import { fetchRegions, type Region } from '@/lib/location/hierarchical';

/**
 * Simple fuzzy match scoring
 * Returns a score from 0-100 based on how well the query matches the text
 */
function fuzzyScore(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match
  if (textLower === queryLower) return 100;
  
  // Starts with query
  if (textLower.startsWith(queryLower)) return 90;
  
  // Contains query as whole word
  if (textLower.includes(` ${queryLower}`)) return 80;
  
  // Contains query anywhere
  if (textLower.includes(queryLower)) return 70;
  
  // Fuzzy match - check if all characters in query appear in order
  let textIndex = 0;
  let queryIndex = 0;
  let matches = 0;
  
  while (textIndex < textLower.length && queryIndex < queryLower.length) {
    if (textLower[textIndex] === queryLower[queryIndex]) {
      matches++;
      queryIndex++;
    }
    textIndex++;
  }
  
  // If all query characters were found in order
  if (queryIndex === queryLower.length) {
    // Score based on how close together the matches were
    const matchRatio = matches / queryLower.length;
    const lengthRatio = queryLower.length / textLower.length;
    return Math.floor(50 * matchRatio * lengthRatio);
  }
  
  return 0;
}

/**
 * Search regions with fuzzy matching
 */
function searchRegions(regions: Region[], query: string, limit = 10): Region[] {
  if (!query.trim()) return [];
  
  const scored = regions
    .map(region => ({
      region,
      score: fuzzyScore(region.name, query)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.region);
  
  return scored;
}

export interface UseRegionSearchReturn {
  results: Region[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for searching regions with debouncing
 */
export function useRegionSearch(query: string, debounceMs = 200): UseRegionSearchReturn {
  const [regions, setRegions] = useState<Region[]>([]);
  const [results, setResults] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
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
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    
    const searchResults = searchRegions(regions, debouncedQuery);
    setResults(searchResults);
  }, [debouncedQuery, regions]);
  
  return {
    results,
    isLoading,
    error
  };
}
