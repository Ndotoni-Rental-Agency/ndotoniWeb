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

export function useCategorizedProperties(userId?: string) {
  const [appData, setAppData] = useState<AppInitialStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track next tokens for each category for horizontal scrolling
  const [categoryTokens, setCategoryTokens] = useState<Record<string, string | null>>({
    nearby: null,
    lowestPrice: null,
    mostViewed: null,
    favorites: null,
    recentlyViewed: null,
    more: null,
  });

  const fetchInitialData = useCallback(async (limitPerCategory: number = 10) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryVariables = { 
        limitPerCategory,
        ...(userId && { userId })
      };
      
      console.log('Fetching app initial state with variables:', queryVariables);
      
      const response = await cachedGraphQL.query({
        query: getAppInitialState,
        variables: queryVariables
      });
      
      console.log('App initial state response:', response);
      
      const result = response.data?.getAppInitialState;
      
      if (result) {
        setAppData(result);
        
        // Set initial next tokens for each category
        setCategoryTokens({
          nearby: result.categorizedProperties.nearby.nextToken || null,
          lowestPrice: result.categorizedProperties.lowestPrice.nextToken || null,
          mostViewed: result.categorizedProperties.mostViewed.nextToken || null,
          favorites: result.categorizedProperties.favorites?.nextToken || null,
          recentlyViewed: result.categorizedProperties.recentlyViewed?.nextToken || null,
          more: result.categorizedProperties.more.nextToken || null,
        });
        
        setError(null);
      } else {
        setError('No data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load app data';
      setError(errorMessage);
      console.error('Error fetching app initial state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load more properties for a specific category (horizontal scrolling)
  const loadMoreForCategory = useCallback(async (category: PropertyCategory) => {
    const categoryKey = category.toLowerCase().replace('_', '');
    const nextToken = categoryTokens[categoryKey];
    
    if (!nextToken || !appData) return;
    
    try {
      console.log(`Loading more for category: ${category}`);
      
      const response = await cachedGraphQL.query({
        query: getPropertiesByCategory,
        variables: {
          category,
          limit: 10,
          nextToken,
          ...(userId && { userId })
        }
      });
      
      const result = response.data?.getPropertiesByCategory;
      
      if (result) {
        // Update the app data with new properties
        setAppData(prev => {
          if (!prev) return prev;
          
          const updatedData = { ...prev };
          const categoryKey = category.toLowerCase().replace('_', '');
          
          // Append new properties to the existing ones
          if (categoryKey === 'nearby') {
            updatedData.categorizedProperties.nearby = {
              ...updatedData.categorizedProperties.nearby,
              properties: [...updatedData.categorizedProperties.nearby.properties, ...result.properties],
              nextToken: result.nextToken,
            };
          } else if (categoryKey === 'lowestprice') {
            updatedData.categorizedProperties.lowestPrice = {
              ...updatedData.categorizedProperties.lowestPrice,
              properties: [...updatedData.categorizedProperties.lowestPrice.properties, ...result.properties],
              nextToken: result.nextToken,
            };
          } else if (categoryKey === 'mostviewed') {
            updatedData.categorizedProperties.mostViewed = {
              ...updatedData.categorizedProperties.mostViewed,
              properties: [...updatedData.categorizedProperties.mostViewed.properties, ...result.properties],
              nextToken: result.nextToken,
            };
          } else if (categoryKey === 'favorites' && updatedData.categorizedProperties.favorites) {
            updatedData.categorizedProperties.favorites = {
              ...updatedData.categorizedProperties.favorites,
              properties: [...updatedData.categorizedProperties.favorites.properties, ...result.properties],
              nextToken: result.nextToken,
            };
          } else if (categoryKey === 'recentlyviewed' && updatedData.categorizedProperties.recentlyViewed) {
            updatedData.categorizedProperties.recentlyViewed = {
              ...updatedData.categorizedProperties.recentlyViewed,
              properties: [...updatedData.categorizedProperties.recentlyViewed.properties, ...result.properties],
              nextToken: result.nextToken,
            };
          } else if (categoryKey === 'more') {
            updatedData.categorizedProperties.more = {
              ...updatedData.categorizedProperties.more,
              properties: [...updatedData.categorizedProperties.more.properties, ...result.properties],
              nextToken: result.nextToken,
            };
          }
          
          return updatedData;
        });
        
        // Update the next token for this category
        setCategoryTokens(prev => ({
          ...prev,
          [categoryKey]: result.nextToken || null,
        }));
      }
    } catch (err) {
      console.error(`Error loading more for category ${category}:`, err);
    }
  }, [categoryTokens, appData, userId]);

  // Check if a category has more data to load
  const hasMoreForCategory = useCallback((category: PropertyCategory) => {
    const categoryKey = category.toLowerCase().replace('_', '');
    return !!categoryTokens[categoryKey];
  }, [categoryTokens]);

  // Fetch initial data when hook is used
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    appData,
    isLoading,
    error,
    refetch: fetchInitialData,
    loadMoreForCategory,
    hasMoreForCategory,
  };
}

export function useCategoryProperties(category: PropertyCategory, userId?: string) {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategoryProperties = useCallback(async (
    limit: number = 20, 
    loadMore: boolean = false
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryVariables = {
        category,
        limit,
        ...(loadMore && nextToken && { nextToken }),
        ...(userId && { userId })
      };
      
      const response = await cachedGraphQL.query({
        query: getPropertiesByCategory,
        variables: queryVariables
      });
      
      const result = response.data?.getPropertiesByCategory;
      const items = result?.properties || [];
      const newNextToken = result?.nextToken;
      
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
      setError(null);
      
      return processedProperties;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load ${category.toLowerCase()} properties`;
      setError(errorMessage);
      console.error(`Error fetching ${category} properties:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [category, nextToken, userId]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      return fetchCategoryProperties(20, true);
    }
  }, [fetchCategoryProperties, isLoading, hasMore]);

  // Fetch initial data when category or userId changes
  useEffect(() => {
    fetchCategoryProperties();
  }, [category, userId]); // Don't include fetchCategoryProperties to avoid infinite loop

  return {
    properties,
    isLoading,
    error,
    loadMore,
    hasMore,
    refetch: () => fetchCategoryProperties(),
  };
}