/**
 * Feature Flags Configuration
 * 
 * Centralized feature flag management for gradual rollout of new features.
 * All flags default to false for safety.
 */

export interface FeatureFlags {
  // Property Caching
  usePropertyCache: boolean;           // Enable CloudFront property JSON cache
  useDistrictSearchCache: boolean;     // Enable district search feed cache
  cacheFirstStrategy: boolean;         // Try cache first, fallback to GraphQL
  
  // Performance
  enablePropertySubscriptions: boolean; // Real-time property updates
  enableLazyLoading: boolean;          // Lazy load images and components
  
  // Future features (placeholders)
  enablePropertyComparison: boolean;
  enableSavedSearches: boolean;
}

/**
 * Get feature flags from environment variables
 * Property cache and district search cache enabled by default for better performance
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    // Property Caching - ENABLED by default (can be disabled via env vars)
    usePropertyCache: process.env.NEXT_PUBLIC_ENABLE_PROPERTY_CACHE !== 'false', // Default true
    useDistrictSearchCache: process.env.NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE !== 'false', // Default true
    cacheFirstStrategy: process.env.NEXT_PUBLIC_CACHE_FIRST_STRATEGY !== 'false', // Default true
    
    // Performance features
    enablePropertySubscriptions: process.env.NEXT_PUBLIC_ENABLE_PROPERTY_SUBSCRIPTIONS !== 'false', // Default true
    enableLazyLoading: process.env.NEXT_PUBLIC_ENABLE_LAZY_LOADING !== 'false', // Default true
    
    // Future features
    enablePropertyComparison: process.env.NEXT_PUBLIC_ENABLE_PROPERTY_COMPARISON === 'true',
    enableSavedSearches: process.env.NEXT_PUBLIC_ENABLE_SAVED_SEARCHES === 'true',
  };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

/**
 * Log feature flag status (useful for debugging)
 */
export function logFeatureFlags(): void {
  const flags = getFeatureFlags();
  console.log('[FeatureFlags] Current configuration:', flags);
}

// Export singleton instance
export const featureFlags = getFeatureFlags();
