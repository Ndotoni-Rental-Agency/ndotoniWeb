/**
 * Hook for fetching district search feeds with CloudFront-first strategy
 * Always tries CloudFront first, falls back to GraphQL automatically
 */

import { useState, useEffect } from 'react';
import { getDistrictSearchFeedPage, PropertyCard } from '@/lib/property-cache';
import { cachedGraphQL } from '@/lib/cache';
import { getPropertiesByLocation } from '@/graphql/queries';

interface UseDistrictSearchFeedOptions {
  region: string;
  district: string;
  page?: number;
  enabled?: boolean; // Allow lazy loading
}

interface UseDistrictSearchFeedResult {
  properties: PropertyCard[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  totalInCache: number;
  fromCache: boolean;
  refetch: () => void;
}

export function useDistrictSearchFeed({
  region,
  district,
  page = 1,
  enabled = true,
}: UseDistrictSearchFeedOptions): UseDistrictSearchFeedResult {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalInCache, setTotalInCache] = useState(0);
  const [fromCache, setFromCache] = useState(false);

  const fetchFeed = async () => {
    if (!enabled || !region || !district) return;

    try {
      setLoading(true);
      setError(null);
      setFromCache(false);

      // Always try CloudFront first
      console.log('[useDistrictSearchFeed] Trying CloudFront first:', { region, district, page });
      
      const cachedFeed = await getDistrictSearchFeedPage(region, district, page);
      
      if (cachedFeed) {
        console.log('[useDistrictSearchFeed] ✅ Loaded from CloudFront:', cachedFeed.properties.length, 'properties');
        setProperties(cachedFeed.properties);
        setHasNextPage(cachedFeed.hasNextPage);
        setTotalInCache(cachedFeed.totalInCache);
        setFromCache(true);
        setLoading(false);
        return;
      }
      
      console.log('[useDistrictSearchFeed] CloudFront miss, falling back to GraphQL');

      // Fallback to GraphQL
      const response = await cachedGraphQL.query({
        query: getPropertiesByLocation,
        variables: {
          region,
          district,
          limit: 20,
        },
      });

      if (response.data?.getPropertiesByLocation?.properties) {
        // Map to PropertyCard format
        const cards: PropertyCard[] = response.data.getPropertiesByLocation.properties.map((p: any) => ({
          propertyId: p.propertyId,
          title: p.title,
          monthlyRent: p.pricing?.monthlyRent || 0,
          currency: p.pricing?.currency || 'TZS',
          propertyType: p.propertyType,
          bedrooms: p.specifications?.bedrooms,
          district: p.address?.district || '',
          region: p.address?.region || '',
          thumbnail: p.media?.images?.[0],
        }));

        console.log('[useDistrictSearchFeed] ✅ Loaded from GraphQL:', cards.length, 'properties');
        setProperties(cards);
        setHasNextPage(!!response.data.getPropertiesByLocation.nextToken);
        setTotalInCache(cards.length);
        setFromCache(false);
      } else {
        setProperties([]);
        setHasNextPage(false);
        setTotalInCache(0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      console.error('[useDistrictSearchFeed] Error:', errorMessage);
      setError(errorMessage);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [region, district, page, enabled]);

  return {
    properties,
    loading,
    error,
    hasNextPage,
    totalInCache,
    fromCache,
    refetch: fetchFeed,
  };
}
