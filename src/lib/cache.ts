// =============================================================================
// GRAPHQL CACHING LAYER
// Provides intelligent caching for GraphQL queries to improve performance
// =============================================================================

import { generateClient } from 'aws-amplify/api';

const client = generateClient();

// Cache interface for GraphQL responses
interface GraphQLCacheEntry {
  data: any;
  timestamp: number;
  query: string;
  variables: any;
}

// Cache storage
const graphqlCache = new Map<string, GraphQLCacheEntry>();

// Cache configuration
const CACHE_CONFIG = {
  // Property queries - cache for 15 minutes (properties change less frequently than expected)
  getPropertyCards: 15 * 60 * 1000,
  getProperty: 30 * 60 * 1000, // Individual properties cache longer
  getLandlordProperties: 15 * 60 * 1000,
  getAppInitialState: 5 * 60 * 1000, // App state changes frequently
  
  // User queries - cache for 30 minutes (user data changes less frequently)
  getUser: 30 * 60 * 1000,
  user: 30 * 60 * 1000,
  
  // Media queries - cache for 60 minutes (media rarely changes)
  getMediaLibrary: 60 * 60 * 1000,
  
  // Search/polling queries - cache for 2 minutes (real-time data)
  getPropertiesUpdatedSince: 2 * 60 * 1000,
  getNewPropertiesMatchingSearch: 2 * 60 * 1000,
  
  // Default cache duration
  default: 15 * 60 * 1000
};

// Generate cache key from query and variables
function generateCacheKey(query: string, variables: any = {}): string {
  const queryName = extractQueryName(query);
  const variablesKey = JSON.stringify(variables, Object.keys(variables).sort());
  return `${queryName}:${variablesKey}`;
}

// Extract query name from GraphQL query string
function extractQueryName(query: string): string {
  const match = query.match(/(?:query|mutation)\s+(\w+)/);
  return match ? match[1] : 'unknown';
}

// Get cache duration for a specific query
function getCacheDuration(queryName: string): number {
  return CACHE_CONFIG[queryName as keyof typeof CACHE_CONFIG] || CACHE_CONFIG.default;
}

// Check if cache entry is still valid
function isCacheValid(entry: GraphQLCacheEntry, queryName: string): boolean {
  const now = Date.now();
  const duration = getCacheDuration(queryName);
  return (now - entry.timestamp) < duration;
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
  }): Promise<{ data: T }> {
    const { query, variables = {}, forceRefresh = false } = options;
    const cacheKey = generateCacheKey(query, variables);
    const queryName = extractQueryName(query);
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = graphqlCache.get(cacheKey);
      if (cached && isCacheValid(cached, queryName)) {
        return { data: cached.data };
      }
    }
    
    // Cache miss or expired - fetch fresh data
    try {
      const response = await client.graphql({
        query,
        variables
      });
      
      const data = (response as any).data;
      
      // Store in cache
      graphqlCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        query,
        variables
      });
      
      return { data };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Execute GraphQL mutation (never cached)
   */
  async mutate<T = any>(options: {
    query: string;
    variables?: any;
  }): Promise<{ data: T }> {
    const { query, variables = {} } = options;
    const queryName = extractQueryName(query);
    
    try {
      const response = await client.graphql({
        query,
        variables
      });
      
      const data = (response as any).data;
      
      // Invalidate related caches after mutations
      this.invalidateRelatedCaches(queryName);
      
      return { data };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Invalidate caches related to a mutation
   */
  invalidateRelatedCaches(mutationName: string) {
    const invalidationRules: Record<string, string[]> = {
      // Property mutations invalidate property queries
      createProperty: ['getPropertyCards', 'getLandlordProperties', 'getAppInitialState'],
      updateProperty: ['getProperty', 'getPropertyCards', 'getLandlordProperties', 'getAppInitialState'],
      
      // User mutations invalidate user queries
      updateUser: ['getUser', 'user'],
      becomeLandlord: ['getUser', 'user'],
      
      // Auth mutations invalidate user and app state
      signIn: ['getUser', 'user', 'getAppInitialState'],
      signUp: ['getUser', 'user', 'getAppInitialState'],
      
      // Media mutations invalidate media queries
      associateMediaWithProperty: ['getMediaLibrary', 'getProperty']
    };
    
    const toInvalidate = invalidationRules[mutationName] || [];
    
    if (toInvalidate.length > 0) {
      for (const [key, entry] of Array.from(graphqlCache.entries())) {
        const queryName = extractQueryName(entry.query);
        if (toInvalidate.includes(queryName)) {
          graphqlCache.delete(key);
        }
      }
    }
  },

  /**
   * Clear all caches
   */
  clearAll() {
    graphqlCache.clear();
  },

  /**
   * Clear specific query caches
   */
  clearQuery(queryName: string) {
    for (const [key, entry] of Array.from(graphqlCache.entries())) {
      if (extractQueryName(entry.query) === queryName) {
        graphqlCache.delete(key);
      }
    }
  },

  /**
   * Get cache statistics
   */
  getStats() {
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
    
    return {
      totalEntries: graphqlCache.size,
      byQuery: stats,
      totalMemory: Array.from(graphqlCache.values())
        .reduce((total, entry) => total + JSON.stringify(entry.data).length, 0)
    };
  }
};