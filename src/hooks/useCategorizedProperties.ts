import { useState, useCallback, useEffect } from 'react';
import { PropertyCard } from '@/API';
import { getInitialAppState, getInitialAppStateFast, getPropertiesByCategory } from '@/graphql/queries';
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

  // Fetch initial app state (categories) in a single request with fallback
  const fetchInitialData = useCallback(async (limitPerCategory = 10, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const variables = { limitPerCategory };
      
      console.log('[useCategorizedProperties] Fetching initial app state:', { 
        ...variables, 
        isAuthenticated,
        forceRefresh
      });
      
      // Try fast endpoint first
      let response;
      let result;
      
      try {
        // Use authenticated query if user is logged in, otherwise use public
        if (isAuthenticated) {
          response = await cachedGraphQL.queryAuthenticated({ 
            query: getInitialAppStateFast, 
            variables,
            forceRefresh 
          });
        } else {
          response = await cachedGraphQL.queryPublic({ 
            query: getInitialAppStateFast, 
            variables,
            forceRefresh 
          });
        }
        result = response.data?.getInitialAppStateFast;
        console.log('[useCategorizedProperties] getInitialAppStateFast succeeded');
      } catch (fastError) {
        console.warn('getInitialAppStateFast failed, falling back to getInitialAppState:', fastError);
        
        // Fallback to regular endpoint
        if (isAuthenticated) {
          response = await cachedGraphQL.queryAuthenticated({ 
            query: getInitialAppState, 
            variables,
            forceRefresh 
          });
        } else {
          response = await cachedGraphQL.queryPublic({ 
            query: getInitialAppState, 
            variables,
            forceRefresh 
          });
        }
        result = response.data?.getInitialAppState;
        console.log('[useCategorizedProperties] getInitialAppState succeeded');
      }

      if (result) {
        console.log('[useCategorizedProperties] Initial data received:', {
          nearby: result.categorizedProperties.nearby?.properties?.length,
          lowestPrice: result.categorizedProperties.lowestPrice?.properties?.length,
          mostViewed: result.categorizedProperties.mostViewed?.properties?.length,
          more: result.categorizedProperties.more?.properties?.length,
          favorites: result.categorizedProperties.favorites?.properties?.length,
          recentlyViewed: result.categorizedProperties.recentlyViewed?.properties?.length,
          tokens: {
            nearby: result.categorizedProperties.nearby?.nextToken,
            lowestPrice: result.categorizedProperties.lowestPrice?.nextToken,
            mostViewed: result.categorizedProperties.mostViewed?.nextToken,
            more: result.categorizedProperties.more?.nextToken,
          }
        });
        
        // Transform the response to match the expected structure
        const appData: AppInitialStateResponse = {
          categorizedProperties: {
            nearby: result.categorizedProperties.nearby!,
            lowestPrice: result.categorizedProperties.lowestPrice,
            favorites: result.categorizedProperties.favorites || undefined,
            mostViewed: result.categorizedProperties.mostViewed,
            recentlyViewed: result.categorizedProperties.recentlyViewed || undefined,
            more: result.categorizedProperties.more,
          },
        };
        
        setAppData(appData);

        // Set next tokens
        const tokens: Record<string, string | null> = {};
        const loaded = new Set<PropertyCategory>();
        
        // Only mark categories as loaded if they actually have data (not null/undefined)
        if (appData.categorizedProperties.nearby) {
          loaded.add('NEARBY');
          tokens.nearby = appData.categorizedProperties.nearby.nextToken || null;
        }
        
        if (appData.categorizedProperties.lowestPrice) {
          loaded.add('LOWEST_PRICE');
          tokens.lowestPrice = appData.categorizedProperties.lowestPrice.nextToken || null;
        }
        
        if (appData.categorizedProperties.mostViewed) {
          loaded.add('MOST_VIEWED');
          tokens.mostViewed = appData.categorizedProperties.mostViewed.nextToken || null;
        }
        
        if (appData.categorizedProperties.more) {
          loaded.add('MORE');
          tokens.more = appData.categorizedProperties.more.nextToken || null;
        }
        
        if (appData.categorizedProperties.favorites) {
          loaded.add('FAVORITES');
          tokens.favorites = appData.categorizedProperties.favorites.nextToken || null;
        }
        
        if (appData.categorizedProperties.recentlyViewed) {
          loaded.add('RECENTLY_VIEWED');
          tokens.recentlyViewed = appData.categorizedProperties.recentlyViewed.nextToken || null;
        }
        
        console.log('[useCategorizedProperties] Category tokens set:', tokens);
        console.log('[useCategorizedProperties] Loaded categories:', Array.from(loaded));
        
        setCategoryTokens(tokens);
        setLoadedCategories(loaded);

        setHasInitialized(true);
        setError(null);
      } else {
        setError('No data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app data');
      console.error('Error fetching initial app state:', err);
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
