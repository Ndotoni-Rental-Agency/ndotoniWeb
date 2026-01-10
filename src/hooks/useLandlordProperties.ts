// =============================================================================
// LANDLORD PROPERTIES HOOK
// Hook for fetching and managing landlord properties
// =============================================================================

import { useState, useCallback } from 'react';
import { Property } from '@/API';
import { listLandlordProperties } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';

interface UseLandlordPropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  nextToken: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  fetchProperties: (landlordId: string, limit?: number) => Promise<void>;
  loadMoreProperties: (landlordId: string, limit?: number) => Promise<void>;
  refreshProperties: (landlordId: string, limit?: number) => Promise<void>;
}

export function useLandlordProperties(): UseLandlordPropertiesReturn {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProperties = useCallback(async (landlordId: string, limit = 12) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cachedGraphQL.query({
        query: listLandlordProperties,
        variables: { 
          landlordId,
          limit
        }
      });

      const data = response.data?.listLandlordProperties;
      
      if (data) {
        setProperties(data.properties || []);
        setNextToken(data.nextToken);
        setHasMore(!!data.nextToken);
      }
    } catch (err) {
      console.error('Error fetching landlord properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreProperties = useCallback(async (landlordId: string, limit = 12) => {
    if (!nextToken || loadingMore) return;

    try {
      setLoadingMore(true);
      
      const response = await cachedGraphQL.query({
        query: listLandlordProperties,
        variables: { 
          landlordId,
          limit,
          nextToken
        }
      });

      const data = response.data?.listLandlordProperties;
      
      if (data) {
        setProperties(prev => [...prev, ...(data.properties || [])]);
        setNextToken(data.nextToken);
        setHasMore(!!data.nextToken);
      }
    } catch (err) {
      console.error('Error loading more properties:', err);
      setError('Failed to load more properties');
    } finally {
      setLoadingMore(false);
    }
  }, [nextToken, loadingMore]);

  const refreshProperties = useCallback(async (landlordId: string, limit = 12) => {
    // Reset state and fetch fresh data
    setProperties([]);
    setNextToken(null);
    setHasMore(true);
    await fetchProperties(landlordId, limit);
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    nextToken,
    hasMore,
    loadingMore,
    fetchProperties,
    loadMoreProperties,
    refreshProperties,
  };
}