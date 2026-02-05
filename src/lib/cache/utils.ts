// =============================================================================
// CACHE UTILITIES
// Helper functions for GraphQL caching layer
// =============================================================================

import { getCurrentUser } from 'aws-amplify/auth';
import { GraphQLCacheEntry } from './types';

// localStorage key prefix
export const STORAGE_PREFIX = 'ndotoni_cache_';

// Queries that should be persisted to localStorage
export const PERSISTENT_QUERIES = new Set([
  'getPropertiesByLocation',
  'getProperty',
  'getRelatedProperties',
  'getLandlordProperties',
  'listLandlordProperties',
  'getUser',
  'user',
  'GetInitialAppState',
  'getCategorizedProperties',
  'GetPropertiesByCategory'
]);

// Cache configuration
export const CACHE_CONFIG = {
  getPropertiesByLocation: 30 * 60 * 1000, // 30 minutes
  getProperty: 60 * 60 * 1000, // 1 hour
  getRelatedProperties: 30 * 60 * 1000, // 30 minutes
  getLandlordProperties: 30 * 60 * 1000,
  listLandlordProperties: 30 * 60 * 1000,
  getCategorizedProperties: 60 * 60 * 1000,
  GetInitialAppState: 60 * 60 * 1000,
  GetPropertiesByCategory: 30 * 60 * 1000,
  getUser: 30 * 60 * 1000,
  user: 30 * 60 * 1000,
  getMediaLibrary: 60 * 60 * 1000,
  getPropertiesUpdatedSince: 2 * 60 * 1000,
  getNewPropertiesMatchingSearch: 2 * 60 * 1000,
  default: 30 * 60 * 1000
};

// Invalidation rules for mutations
export const INVALIDATION_RULES: Record<string, string[]> = {
  createProperty: ['getPropertiesByLocation', 'getRelatedProperties', 'getLandlordProperties', 'listLandlordProperties', 'getCategorizedProperties', 'GetInitialAppState', 'getPropertiesByCategory'],
  updateProperty: ['getProperty', 'getRelatedProperties', 'getPropertiesByLocation', 'getLandlordProperties', 'listLandlordProperties', 'getCategorizedProperties', 'GetInitialAppState', 'getPropertiesByCategory'],
  deleteProperty: ['getProperty', 'getRelatedProperties', 'getPropertiesByLocation', 'getLandlordProperties', 'listLandlordProperties', 'getCategorizedProperties', 'GetInitialAppState', 'getPropertiesByCategory'],
  toggleFavorite: ['getCategorizedProperties', 'GetInitialAppState'],
  updateUser: ['getUser', 'user'],
  becomeLandlord: ['getUser', 'user'],
  signIn: ['getUser', 'user', 'getCategorizedProperties', 'GetInitialAppState'],
  signUp: ['getUser', 'user', 'getCategorizedProperties', 'GetInitialAppState'],
  associateMediaWithProperty: ['getMediaLibrary', 'getProperty']
};

// Extract query name from GraphQL query string
export function extractQueryName(query: string): string {
  const match = query.match(/(?:query|mutation)\s+(\w+)/);
  return match ? match[1] : 'unknown';
}

// Determine auth mode based on user authentication status
export async function getAuthMode(forceApiKey = false): Promise<'userPool' | 'apiKey'> {
  if (forceApiKey) return 'apiKey';
  
  try {
    await getCurrentUser();
    return 'userPool';
  } catch {
    return 'apiKey';
  }
}

// Generate cache key from query, variables, and auth mode
export function generateCacheKey(query: string, variables: any = {}, authMode: string): string {
  const queryName = extractQueryName(query);
  const variablesKey = JSON.stringify(variables, Object.keys(variables).sort());
  return `${queryName}:${authMode}:${variablesKey}`;
}

// Get cache duration for a specific query
export function getCacheDuration(queryName: string): number {
  return CACHE_CONFIG[queryName as keyof typeof CACHE_CONFIG] || CACHE_CONFIG.default;
}

// Check if cache entry is still valid
export function isCacheValid(entry: GraphQLCacheEntry, queryName: string): boolean {
  const now = Date.now();
  const duration = getCacheDuration(queryName);
  return (now - entry.timestamp) < duration;
}

// Save cache entry to localStorage if it's a persistent query
export function saveToStorage(cacheKey: string, entry: GraphQLCacheEntry) {
  if (typeof window === 'undefined') return;
  
  const queryName = extractQueryName(entry.query);
  if (PERSISTENT_QUERIES.has(queryName)) {
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_PREFIX + cacheKey, JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
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
export function removeFromStorage(cacheKey: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_PREFIX + cacheKey);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}

// Clear expired entries from localStorage
export function clearExpiredFromStorage() {
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

// Initialize cache from localStorage
export function initializeCacheFromStorage(graphqlCache: Map<string, GraphQLCacheEntry>) {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    
    for (const storageKey of keys) {
      const cacheKey = storageKey.replace(STORAGE_PREFIX, '');
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const entry: GraphQLCacheEntry = JSON.parse(stored);
        const queryName = extractQueryName(entry.query);
        
        if (isCacheValid(entry, queryName)) {
          graphqlCache.set(cacheKey, entry);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to initialize cache from localStorage:', error);
  }
}

// Log cache activity in development
export function logCacheActivity(query: string, hit: boolean, metrics: any, duration?: number) {
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebug = window.location.search.includes('debug') || localStorage.getItem('ndotoni_debug_cache') === 'true';
    
    if (isDev || hasDebug) {
      const queryName = extractQueryName(query);
      const emoji = hit ? '✅' : '❌';
      const durationStr = duration ? ` (${duration}ms)` : '';
      console.log(`${emoji} Cache ${hit ? 'HIT' : 'MISS'}: ${queryName}${durationStr}`);
    }
    
    if (hit) metrics.hits++;
    else metrics.misses++;
    
    metrics.queries.push({
      query: extractQueryName(query),
      hit,
      timestamp: Date.now(),
      duration
    });
    
    if (metrics.queries.length > 50) {
      metrics.queries.shift();
    }
  }
}
