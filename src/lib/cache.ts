// =============================================================================
// GRAPHQL CACHING LAYER
// Provides intelligent caching for GraphQL queries to improve performance
// =============================================================================

import { generateClient } from 'aws-amplify/api';
import { listLandlordProperties } from '@/graphql/queries';
import { Property } from '@/API';

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

// localStorage key prefix
const STORAGE_PREFIX = 'ndotoni_cache_';

// Queries that should be persisted to localStorage
const PERSISTENT_QUERIES = new Set([
  'getPropertyCards',
  'getProperty',
  'getLandlordProperties',
  'listLandlordProperties',
  'getUser',
  'user'
]);

// Initialize cache from localStorage on startup
function initializeCacheFromStorage() {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    
    for (const storageKey of keys) {
      const cacheKey = storageKey.replace(STORAGE_PREFIX, '');
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const entry: GraphQLCacheEntry = JSON.parse(stored);
        const queryName = extractQueryName(entry.query);
        
        // Only restore if still valid
        if (isCacheValid(entry, queryName)) {
          graphqlCache.set(cacheKey, entry);
        } else {
          // Remove expired entries from localStorage
          localStorage.removeItem(storageKey);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to initialize cache from localStorage:', error);
  }
}

// Save cache entry to localStorage if it's a persistent query (async to avoid blocking)
function saveToStorage(cacheKey: string, entry: GraphQLCacheEntry) {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  const queryName = extractQueryName(entry.query);
  
  if (PERSISTENT_QUERIES.has(queryName)) {
    // Use setTimeout to make this async and non-blocking
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_PREFIX + cacheKey, JSON.stringify(entry));
      } catch (error) {
        // Handle localStorage quota exceeded or other errors
        console.warn('Failed to save to localStorage:', error);
        // Try to clear old entries and retry
        clearExpiredFromStorage();
        try {
          localStorage.setItem(STORAGE_PREFIX + cacheKey, JSON.stringify(entry));
        } catch (retryError) {
          console.warn('Failed to save to localStorage after cleanup:', retryError);
        }
      }
    }, 0);
  }
}

// Remove cache entry from localStorage
function removeFromStorage(cacheKey: string) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_PREFIX + cacheKey);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}

// Clear expired entries from localStorage
function clearExpiredFromStorage() {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    const now = Date.now();
    
    for (const storageKey of keys) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const entry: GraphQLCacheEntry = JSON.parse(stored);
        const queryName = extractQueryName(entry.query);
        const duration = getCacheDuration(queryName);
        
        if ((now - entry.timestamp) >= duration) {
          localStorage.removeItem(storageKey);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to clear expired localStorage entries:', error);
  }
}

// Initialize cache on module load
initializeCacheFromStorage();

// Set up periodic cleanup (every 30 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    clearExpiredFromStorage();
  }, 30 * 60 * 1000);
}

// Cache configuration
const CACHE_CONFIG = {
  // Property queries - cache for 15 minutes (properties change less frequently than expected)
  getPropertyCards: 15 * 60 * 1000,
  getProperty: 30 * 60 * 1000, // Individual properties cache longer
  getLandlordProperties: 15 * 60 * 1000,
  listLandlordProperties: 15 * 60 * 1000, // Landlord properties cache for 15 minutes
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
      
      // Create cache entry
      const cacheEntry: GraphQLCacheEntry = {
        data,
        timestamp: Date.now(),
        query,
        variables
      };
      
      // Store in memory cache
      graphqlCache.set(cacheKey, cacheEntry);
      
      // Store in localStorage for persistent queries
      saveToStorage(cacheKey, cacheEntry);
      
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
      createProperty: ['getPropertyCards', 'getLandlordProperties', 'listLandlordProperties', 'getAppInitialState'],
      updateProperty: ['getProperty', 'getPropertyCards', 'getLandlordProperties', 'listLandlordProperties', 'getAppInitialState'],
      deleteProperty: ['getPropertyCards', 'getLandlordProperties', 'listLandlordProperties', 'getAppInitialState'],
      
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
    
    // Clear localStorage entries
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
    
    return {
      totalEntries: graphqlCache.size,
      byQuery: stats,
      totalMemory: Array.from(graphqlCache.values())
        .reduce((total, entry) => total + JSON.stringify(entry.data).length, 0),
      localStorage: {
        entries: localStorageEntries,
        sizeBytes: localStorageSize,
        sizeMB: (localStorageSize / (1024 * 1024)).toFixed(2)
      }
    };
  },

  /**
   * Clean up expired entries from both memory and localStorage
   */
  cleanup() {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, entry] of Array.from(graphqlCache.entries())) {
      const queryName = extractQueryName(entry.query);
      if (!isCacheValid(entry, queryName)) {
        graphqlCache.delete(key);
      }
    }
    
    // Clean localStorage
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
        variables: { 
          landlordId,
          limit,
          nextToken
        },
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