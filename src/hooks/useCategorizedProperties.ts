import { useState, useCallback, useEffect } from 'react';
import { PropertyCard } from '@/API';
import { getAppInitialState, getPropertiesByCategory } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';

export type PropertyCategory = 'NEARBY' | 'LOWEST_PRICE' | 'FAVORITES' | 'MOST_VIEWED' | 'RECENTLY_VIEWED' | 'MORE';

interface CategoryPropertyResponse {
  properties: PropertyCard[];
  nextToken?: string;
  count: number;
  category: PropertyCategory;
}

interface CategorizedPropertiesResponse {
  nearby: CategoryPropertyResponse;
  lowestPrice: CategoryPropertyResponse;
  favorites?: CategoryPropertyResponse;
  mostViewed: CategoryPropertyResponse;
  recentlyViewed?: CategoryPropertyResponse;
  more: CategoryPropertyResponse;
}

interface AppInitialStateResponse {
  categorizedProperties: CategorizedPropertiesResponse;
  totalProperties: number;
}

// =============================================================================
// USE CATEGORIZED PROPERTIES (Optimized)
// =============================================================================
export function useCategorizedProperties(userId?: string) {
  const [appData, setAppData] = useState<AppInitialStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryTokens, setCategoryTokens] = useState<Record<string, string | null>>({
    nearby: null,
    lowestPrice: null,
    mostViewed: null,
    favorites: null,
    recentlyViewed: null,
    more: null,
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch all categories in parallel for speed
  const fetchInitialData = useCallback(async (limitPerCategory = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const variables = { limitPerCategory, ...(userId && { userId }) };
      const response = await cachedGraphQL.query({ query: getAppInitialState, variables });
      const result = response.data?.getAppInitialState;

      if (result) {
        setAppData(result);

        // Set next tokens
        const tokens: Record<string, string | null> = {};
        for (const key of Object.keys(result.categorizedProperties)) {
          const cat = key as keyof CategorizedPropertiesResponse;
          tokens[key] = result.categorizedProperties[cat]?.nextToken || null;
        }
        setCategoryTokens(tokens);

        setHasInitialized(true);
        setError(null);
      } else {
        setError('No data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app data');
      console.error('Error fetching app initial state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadMoreForCategory = useCallback(async (category: PropertyCategory) => {
    const key = category.toLowerCase().replace('_', '');
    const nextToken = categoryTokens[key];
    if (!nextToken || !appData) return;

    try {
      const variables = { category, limit: 10, nextToken, ...(userId && { userId }) };
      const response = await cachedGraphQL.query({ query: getPropertiesByCategory, variables });
      const result = response.data?.getPropertiesByCategory;

      if (result) {
        setAppData(prev => {
          if (!prev) return prev;
          const updated = { ...prev };
          const catKey = key as keyof CategorizedPropertiesResponse;

          if (updated.categorizedProperties[catKey]) {
            updated.categorizedProperties[catKey] = {
              ...updated.categorizedProperties[catKey]!,
              properties: [
                ...updated.categorizedProperties[catKey]!.properties,
                ...result.properties,
              ],
              nextToken: result.nextToken,
            };
          }
          return updated;
        });

        setCategoryTokens(prev => ({ ...prev, [key]: result.nextToken || null }));
      }
    } catch (err) {
      console.error(`Error loading more for category ${category}:`, err);
    }
  }, [categoryTokens, appData, userId]);

  const hasMoreForCategory = useCallback((category: PropertyCategory) => {
    const key = category.toLowerCase().replace('_', '');
    return !!categoryTokens[key];
  }, [categoryTokens]);

  // Fetch on hook mount
  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  return { appData, isLoading, error, refetch: fetchInitialData, loadMoreForCategory, hasMoreForCategory, hasInitialized };
}

// =============================================================================
// USE SINGLE CATEGORY PROPERTIES (Optimized)
// =============================================================================
export function useCategoryProperties(category: PropertyCategory, userId?: string) {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchCategoryProperties = useCallback(async (limit = 20, loadMore = false) => {
    if (!loadMore && hasInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      const variables: any = { category, limit, ...(userId && { userId }) };
      if (loadMore && nextToken) variables.nextToken = nextToken;

      const response = await cachedGraphQL.query({ query: getPropertiesByCategory, variables });
      const result = response.data?.getPropertiesByCategory;
      const items: PropertyCard[] = (result?.properties || []).map((p: PropertyCard) => ({ ...p, ward: p.district }));

      if (loadMore) setProperties(prev => [...prev, ...items]);
      else setProperties(items);

      setNextToken(result?.nextToken || null);
      setHasMore(!!result?.nextToken);
      setHasInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load ${category.toLowerCase()} properties`;
      setError(errorMessage);
      console.error(`Error fetching ${category} properties:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [category, nextToken, userId, hasInitialized]);

  const loadMore = useCallback(() => { if (!isLoading && hasMore) fetchCategoryProperties(20, true); }, [fetchCategoryProperties, isLoading, hasMore]);

  useEffect(() => { fetchCategoryProperties(); }, [category, userId]);

  return { properties, isLoading, error, loadMore, hasMore, refetch: () => fetchCategoryProperties(), hasInitialized };
}
