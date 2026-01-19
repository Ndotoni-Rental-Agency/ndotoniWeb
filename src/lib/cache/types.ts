// =============================================================================
// CACHE TYPES
// Type definitions for GraphQL caching layer
// =============================================================================

export interface GraphQLCacheEntry {
  data: any;
  timestamp: number;
  query: string;
  variables: any;
  authMode: 'userPool' | 'apiKey';
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  queries: Array<{ 
    query: string; 
    hit: boolean; 
    timestamp: number; 
    duration?: number 
  }>;
}

export interface CacheStats {
  totalEntries: number;
  byQuery: Record<string, { count: number; totalSize: number; oldestAge: number }>;
  totalMemory: number;
  localStorage: {
    entries: number;
    sizeBytes: number;
    sizeMB: string;
  };
  performance: {
    hits: number;
    misses: number;
    hitRate: string;
    recentQueries: Array<{ query: string; hit: boolean; timestamp: number; duration?: number }>;
  };
}
