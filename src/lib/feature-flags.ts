/**
 * Feature Flags Configuration
 * 
 * Centralized feature flag management for gradual rollout of new features.
 * All flags default to false for safety.
 */

export interface FeatureFlags {
  // Property Caching
  enableGraphQLFallback: boolean;        // Enable GraphQL fallback when CloudFront fails
  
  // Performance
  enablePropertySubscriptions: boolean; // Real-time property updates
  enableLazyLoading: boolean;          // Lazy load images and components
  
  // Future features (placeholders)
  enablePropertyComparison: boolean;
  enableSavedSearches: boolean;
}

/**
 * Get feature flags from environment variables
 * GraphQL fallback disabled by default (CloudFront-only mode)
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    // Property Caching - CloudFront-only by default
    enableGraphQLFallback: process.env.NEXT_PUBLIC_ENABLE_GRAPHQL_FALLBACK === 'true', // Default false
    
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
  // Feature flags logging removed for production
}

// Export singleton instance
export const featureFlags = getFeatureFlags();
