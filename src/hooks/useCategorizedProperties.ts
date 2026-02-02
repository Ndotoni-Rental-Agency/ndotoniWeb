import { useState, useCallback, useEffect } from 'react';
import { PropertyCard } from '@/API';
import { getInitialAppState, getInitialAppStateFast, getPropertiesByCategory } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';
import { getHomepagePropertiesFromCache, transformCacheToAppData } from '@/lib/homepage-cache';

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
  mostViewed?: CategoryPropertyResponse;
  recentlyViewed?: CategoryPropertyResponse;
  more?: CategoryPropertyResponse;
}

interface Region {
  id: string;
  name: string;
}

interface AppInitialStateResponse {
  categorizedProperties: CategorizedPropertiesResponse;
}

// =============================================================================
// USE CATEGORIZED PROPERTIES (Optimized)
// =============================================================================
export function useCategorizedProperties(isAuthenticated?: boolean) {
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
  const [loadedCategories, setLoadedCategories] = useState<Set<PropertyCategory>>(new Set<PropertyCategory>(['NEARBY', 'LOWEST_PRICE']));
  const [loadingCategories, setLoadingCategories] = useState<Set<PropertyCategory>>(new Set<PropertyCategory>());

  // Fetch initial app state from CloudFront cache (no fallback)
  const fetchInitialData = useCallback(async (limitPerCategory = 10, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // 🚀 Fetch from CloudFront cache (always, no fallback)
      console.log('[useCategorizedProperties] Fetching from CloudFront cache...');
      const cacheData = await getHomepagePropertiesFromCache();
      
      if (!cacheData) {
        throw new Error('Failed to load homepage cache from CloudFront');
      }
      
      console.log('[useCategorizedProperties] ✅ CloudFront cache loaded successfully');
      const appData = transformCacheToAppData(cacheData);
      setAppData(appData);
      
      // Mark categories as loaded
      const loaded = new Set<PropertyCategory>(['NEARBY', 'LOWEST_PRICE', 'MOST_VIEWED', 'MORE']);
      setLoadedCategories(loaded);
      
      // No pagination tokens from cache (it's a snapshot)
      setCategoryTokens({
        nearby: null,
        lowestPrice: null,
        mostViewed: null,
        more: null,
        favorites: null,
        recentlyViewed: null,
      });
      
      setHasInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load homepage cache');
      console.error('Error fetching homepage cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadMoreForCategory = useCallback(async (category: PropertyCategory) => {
    // Map category enum to camelCase key
    let key: string;
    switch (category) {
      case 'MOST_VIEWED':
        key = 'mostViewed';
        break;
      case 'LOWEST_PRICE':
        key = 'lowestPrice';
        break;
      case 'RECENTLY_VIEWED':
        key = 'recentlyViewed';
        break;
      case 'NEARBY':
        key = 'nearby';
        break;
      case 'MORE':
        key = 'more';
        break;
      case 'FAVORITES':
        key = 'favorites';
        break;
    }
    
    const nextToken = categoryTokens[key];
    
    console.log(`[useCategorizedProperties] loadMoreForCategory called:`, {
      category,
      hasNextToken: !!nextToken,
      nextToken,
      hasAppData: !!appData,
      isAlreadyLoading: loadingCategories.has(category)
    });
    
    // Prevent concurrent requests for the same category
    if (loadingCategories.has(category)) {
      console.log(`[useCategorizedProperties] Already loading ${category}, skipping`);
      return;
    }
    
    if (!nextToken || !appData) {
      console.log(`[useCategorizedProperties] Skipping loadMore - no token or no appData`);
      return;
    }

    try {
      // Mark as loading
      setLoadingCategories(prev => new Set(prev).add(category));
      
      const variables = { category, limit: 10, nextToken };
      console.log(`[useCategorizedProperties] Fetching more for ${category}:`, variables);
      
      // Use authenticated or public query based on auth state
      const response = isAuthenticated 
        ? await cachedGraphQL.queryAuthenticated({ query: getPropertiesByCategory, variables })
        : await cachedGraphQL.queryPublic({ query: getPropertiesByCategory, variables });
      const result = response.data?.getPropertiesByCategory;

      console.log(`[useCategorizedProperties] ${category} loadMore response:`, {
        category: result?.category,
        newPropertiesCount: result?.properties?.length,
        hasNextToken: !!result?.nextToken,
        nextToken: result?.nextToken
      });

      if (result) {
        setAppData(prev => {
          if (!prev) return prev;
          const updated = { ...prev };
          const catKey = key as keyof CategorizedPropertiesResponse;

          if (updated.categorizedProperties[catKey]) {
            const existingCount = updated.categorizedProperties[catKey]!.properties.length;
            const existingIds = new Set(updated.categorizedProperties[catKey]!.properties.map((p: PropertyCard) => p.propertyId));
            
            // Filter out duplicates
            const newProperties = result.properties.filter((p: PropertyCard) => !existingIds.has(p.propertyId));
            
            console.log(`[useCategorizedProperties] ${category} deduplication:`, {
              received: result.properties.length,
              duplicates: result.properties.length - newProperties.length,
              unique: newProperties.length
            });
            
            updated.categorizedProperties[catKey] = {
              ...updated.categorizedProperties[catKey]!,
              properties: [
                ...updated.categorizedProperties[catKey]!.properties,
                ...newProperties,
              ],
              nextToken: result.nextToken,
            };
            console.log(`[useCategorizedProperties] ${category} total properties after merge: ${existingCount} + ${newProperties.length} = ${updated.categorizedProperties[catKey]!.properties.length}`);
          }
          return updated;
        });

        setCategoryTokens(prev => ({ ...prev, [key]: result.nextToken || null }));
      }
    } catch (err) {
      console.error(`Error loading more for category ${category}:`, err);
    } finally {
      // Remove from loading set
      setLoadingCategories(prev => {
        const next = new Set(prev);
        next.delete(category);
        return next;
      });
    }
  }, [categoryTokens, appData, isAuthenticated, loadingCategories]);

  // Load a category on demand (for lazy loading)
  const loadCategory = useCallback(async (category: PropertyCategory) => {
    // Skip if already loaded
    if (loadedCategories.has(category)) return;

    try {
      const variables = { category, limit: 10 };
      console.log(`[useCategorizedProperties] Loading category: ${category}`, variables);
      
      // Use authenticated or public query based on auth state
      const response = isAuthenticated
        ? await cachedGraphQL.queryAuthenticated({ query: getPropertiesByCategory, variables })
        : await cachedGraphQL.queryPublic({ query: getPropertiesByCategory, variables });
      const result = response.data?.getPropertiesByCategory;

      console.log(`[useCategorizedProperties] ${category} response:`, {
        category: result?.category,
        propertiesCount: result?.properties?.length,
        hasNextToken: !!result?.nextToken,
        nextToken: result?.nextToken,
        properties: result?.properties
      });

      if (result) {
        setAppData(prev => {
          if (!prev) return prev;
          const updated = { ...prev };
          
          // Map category enum to camelCase key
          let key: keyof CategorizedPropertiesResponse;
          switch (category) {
            case 'MOST_VIEWED':
              key = 'mostViewed';
              break;
            case 'LOWEST_PRICE':
              key = 'lowestPrice';
              break;
            case 'RECENTLY_VIEWED':
              key = 'recentlyViewed';
              break;
            case 'NEARBY':
              key = 'nearby';
              break;
            case 'MORE':
              key = 'more';
              break;
            case 'FAVORITES':
              key = 'favorites';
              break;
          }

          updated.categorizedProperties[key] = result;
          return updated;
        });

        // Also use proper camelCase for tokens
        let tokenKey: string;
        switch (category) {
          case 'MOST_VIEWED':
            tokenKey = 'mostViewed';
            break;
          case 'LOWEST_PRICE':
            tokenKey = 'lowestPrice';
            break;
          case 'RECENTLY_VIEWED':
            tokenKey = 'recentlyViewed';
            break;
          case 'NEARBY':
            tokenKey = 'nearby';
            break;
          case 'MORE':
            tokenKey = 'more';
            break;
          case 'FAVORITES':
            tokenKey = 'favorites';
            break;
        }
        
        setCategoryTokens(prev => ({ ...prev, [tokenKey]: result.nextToken || null }));
        setLoadedCategories(prev => new Set(prev).add(category));
      }
    } catch (err) {
      console.error(`Error loading category ${category}:`, err);
      // Mark as loaded even on error to prevent infinite retries
      setLoadedCategories(prev => new Set(prev).add(category));
    }
  }, [loadedCategories, isAuthenticated]);

  const hasMoreForCategory = useCallback((category: PropertyCategory) => {
    // Map category enum to camelCase key
    let key: string;
    switch (category) {
      case 'MOST_VIEWED':
        key = 'mostViewed';
        break;
      case 'LOWEST_PRICE':
        key = 'lowestPrice';
        break;
      case 'RECENTLY_VIEWED':
        key = 'recentlyViewed';
        break;
      case 'NEARBY':
        key = 'nearby';
        break;
      case 'MORE':
        key = 'more';
        break;
      case 'FAVORITES':
        key = 'favorites';
        break;
    }
    return !!categoryTokens[key];
  }, [categoryTokens]);

  // Fetch on hook mount and when isAuthenticated changes
  useEffect(() => { 
    fetchInitialData(); 
  }, [fetchInitialData]);

  // Refetch when isAuthenticated changes (user signs in/out)
  useEffect(() => {
    if (hasInitialized) {
      console.log('[useCategorizedProperties] isAuthenticated changed, refetching data with forceRefresh');
      fetchInitialData(10, true); // Force refresh to bypass cache
    }
  }, [isAuthenticated, hasInitialized]);

  return { appData, isLoading, error, refetch: fetchInitialData, loadMoreForCategory, loadCategory, hasMoreForCategory, hasInitialized, isCategoryLoaded: (cat: PropertyCategory) => loadedCategories.has(cat) };
}

// =============================================================================
// USE SINGLE CATEGORY PROPERTIES (Optimized)
// =============================================================================
export function useCategoryProperties(category: PropertyCategory, isAuthenticated?: boolean) {
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
      const variables: any = { category, limit };
      if (loadMore && nextToken) variables.nextToken = nextToken;

      // Use authenticated or public query based on auth state
      const response = isAuthenticated
        ? await cachedGraphQL.queryAuthenticated({ query: getPropertiesByCategory, variables })
        : await cachedGraphQL.queryPublic({ query: getPropertiesByCategory, variables });
      console.log(`[useCategoryProperties] ${category} response:`, response);
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
  }, [category, nextToken, isAuthenticated, hasInitialized]);

  const loadMore = useCallback(() => { if (!isLoading && hasMore) fetchCategoryProperties(20, true); }, [fetchCategoryProperties, isLoading, hasMore]);

  useEffect(() => { fetchCategoryProperties(); }, [category, isAuthenticated]);

  return { properties, isLoading, error, loadMore, hasMore, refetch: () => fetchCategoryProperties(), hasInitialized };
}
