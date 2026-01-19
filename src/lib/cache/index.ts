// =============================================================================
// GRAPHQL CACHING LAYER
// Provides intelligent caching for GraphQL queries to improve performance
// =============================================================================

import { GraphQLClient } from '@/lib/graphql-client';
import { getCurrentUser } from 'aws-amplify/auth';
import { listLandlordProperties } from '@/graphql/queries';
import { Property } from '@/API';
import {
  GraphQLCacheEntry,
  CacheMetrics,
  CacheStats
} from './types';
import {
  STORAGE_PREFIX,
  INVALIDATION_RULES,
  generateCacheKey,
  extractQueryName,
  getCacheDuration,
  isCacheValid,
  saveToStorage,
  removeFromStorage,
  clearExpiredFromStorage,
  initializeCacheFromStorage,
  logCacheActivity,
  getAuthMode
} from './utils';

// Cache storage
const graphqlCache = new Map<string, GraphQLCacheEntry>();

// Cache performance tracking
const cacheMetrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  queries: []
};

// Initialize cache on module load
initializeCacheFromStorage(graphqlCache);

// Set up periodic cleanup (every 30 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    clearExpiredFromStorage();
  }, 30 * 60 * 1000);
}

// Cached GraphQL client wrapper
export const cachedGraphQL = {
  /**
   * Execute GraphQL query with intelligent caching
   */
  async query<T = any>(options: {
    query: string;
    variables?: any;
    forceRefresh?: boolean;
    forceApiKey?: boolean;
  }): Promise<{ data: T }> {
    const { query, variables = {}, forceRefresh = false, forceApiKey = false } = options;
    const startTime = Date.now();
    const authMode = await getAuthMode(forceApiKey);
    const cacheKey = generateCacheKey(query, variables, authMode);
    const queryName = extractQueryName(query);

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = graphqlCache.get(cacheKey);
      if (cached && isCacheValid(cached, queryName)) {
        const duration = Date.now() - startTime;
        logCacheActivity(query, true, cacheMetrics, duration);
        return { data: cached.data };
      }
    }

    // Cache miss - fetch fresh data
    try {
      let data;
      if (authMode === 'userPool') {
        data = await GraphQLClient.executeAuthenticated(query, variables);
      } else {
        data = await GraphQLClient.executePublic(query, variables);
      }

      const duration = Date.now() - startTime;
      logCacheActivity(query, false, cacheMetrics, duration);

      // Store in cache
      const cacheEntry: GraphQLCacheEntry = {
        data,
        timestamp: Date.now(),
        query,
        variables,
        authMode
      };

      graphqlCache.set(cacheKey, cacheEntry);
      saveToStorage(cacheKey, cacheEntry);

      return { data };
    } catch (error) {
      console.error('GraphQL Query Error:', error);
      throw error;
    }
  },

  /**
   * Execute GraphQL mutation (never cached)
   */
  async mutate<T = any>(options: {
    query: string;
    variables?: any;
    forceApiKey?: boolean;
  }): Promise<{ data: T }> {
    const { query, variables = {}, forceApiKey = false } = options;
    const authMode = await getAuthMode(forceApiKey);
    const queryName = extractQueryName(query);

    try {
      let data;
      if (authMode === 'userPool') {
        data = await GraphQLClient.executeAuthenticated(query, variables);
      } else {
        data = await GraphQLClient.executePublic(query, variables);
      }

      // Invalidate related caches
      this.invalidateRelatedCaches(queryName);

      return { data };
    } catch (error) {
      console.error('GraphQL Mutation Error:', error);
      throw error;
    }
  },

  /**
   * Execute query with Cognito authentication
   */
  async queryAuthenticated<T = any>(options: {
    query: string;
    variables?: any;
    forceRefresh?: boolean;
  }): Promise<{ data: T }> {
    try {
      await getCurrentUser();
      return await this.query({
        ...options,
        forceApiKey: false
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'UserUnAuthenticatedError') {
        throw new Error('Authentication required for this operation');
      }
      throw error;
    }
  },

  /**
   * Execute query with API Key (public access)
   */
  async queryPublic<T = any>(options: {
    query: string;
    variables?: any;
    forceRefresh?: boolean;
  }): Promise<{ data: T }> {
    return await this.query({
      ...options,
      forceApiKey: true
    });
  },

  /**
   * Invalidate caches related to a mutation
   */
  invalidateRelatedCaches(mutationName: string) {
    const toInvalidate = INVALIDATION_RULES[mutationName] || [];
    
    if (toInvalidate.length > 0) {
      for (const [key, entry] of Array.from(graphqlCache.entries())) {
        const queryName = extractQueryName(entry.query);
        if (toInvalidate.includes(queryName)) {
          graphqlCache.delete(key);
          removeFromStorage(key);
        }
      }
    }
  },

  /**
   * Clear all caches
   */
  clearAll() {
    graphqlCache.clear();
    
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
        keys.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear localStorage cache:', error);
      }
    }
  },

  /**
   * Clear specific query caches
   */
  clearQuery(queryName: string) {
    for (const [key, entry] of Array.from(graphqlCache.entries())) {
      if (extractQueryName(entry.query) === queryName) {
        graphqlCache.delete(key);
        removeFromStorage(key);
      }
    }
  },

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const stats: Record<string, { count: number; totalSize: number; oldestAge: number }> = {};
    const now = Date.now();

    for (const [key, entry] of Array.from(graphqlCache.entries())) {
      const queryName = extractQueryName(entry.query);
      const age = now - entry.timestamp;
      const size = JSON.stringify(entry.data).length;

      if (!stats[queryName]) {
        stats[queryName] = { count: 0, totalSize: 0, oldestAge: 0 };
      }

      stats[queryName].count++;
      stats[queryName].totalSize += size;
      stats[queryName].oldestAge = Math.max(stats[queryName].oldestAge, age);
    }

    // Get localStorage stats
    let localStorageEntries = 0;
    let localStorageSize = 0;

    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
        localStorageEntries = keys.length;
        for (const key of keys) {
          const value = localStorage.getItem(key);
          if (value) {
            localStorageSize += value.length;
          }
        }
      } catch (error) {
        console.warn('Failed to get localStorage stats:', error);
      }
    }

    const hitRate = cacheMetrics.hits + cacheMetrics.misses > 0
      ? ((cacheMetrics.hits / (cacheMetrics.hits + cacheMetrics.misses)) * 100).toFixed(1)
      : '0';

    return {
      totalEntries: graphqlCache.size,
      byQuery: stats,
      totalMemory: Array.from(graphqlCache.values()).reduce((total, entry) => 
        total + JSON.stringify(entry.data).length, 0),
      localStorage: {
        entries: localStorageEntries,
        sizeBytes: localStorageSize,
        sizeMB: (localStorageSize / (1024 * 1024)).toFixed(2)
      },
      performance: {
        hits: cacheMetrics.hits,
        misses: cacheMetrics.misses,
        hitRate: `${hitRate}%`,
        recentQueries: cacheMetrics.queries.slice(-10)
      }
    };
  },

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    
    for (const [key, entry] of Array.from(graphqlCache.entries())) {
      const queryName = extractQueryName(entry.query);
      if (!isCacheValid(entry, queryName)) {
        graphqlCache.delete(key);
      }
    }
    
    clearExpiredFromStorage();
  },

  /**
   * Fetch landlord properties with caching
   */
  async fetchLandlordProperties(options: {
    landlordId: string;
    limit?: number;
    nextToken?: string;
    forceRefresh?: boolean;
  }): Promise<{
    properties: Property[];
    nextToken?: string;
    count: number;
  }> {
    const { landlordId, limit = 20, nextToken, forceRefresh = false } = options;

    try {
      const response = await this.query({
        query: listLandlordProperties,
        variables: { landlordId, limit, nextToken },
        forceRefresh
      });

      const propertiesData = response.data?.listLandlordProperties;

      if (!propertiesData) {
        throw new Error('No properties data received from API');
      }

      return {
        properties: propertiesData.properties || [],
        nextToken: propertiesData.nextToken,
        count: propertiesData.count || 0
      };
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
      throw error;
    }
  }
};
