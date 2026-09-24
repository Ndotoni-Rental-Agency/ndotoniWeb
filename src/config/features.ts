/**
 * Feature Flags Configuration
 * 
 * Centralized feature flag management for gradual rollout and A/B testing.
 */

export interface FeatureFlags {
  facebookSignIn: boolean;
  enableInAppChat: boolean;
  enableDirectChat: boolean;
  // Add more feature flags here as needed
}

/**
 * Get feature flags from environment variables
 * Defaults to disabled, can be enabled via env vars
 */
export const featureFlags: FeatureFlags = {
  // Facebook Sign-In - disabled until Consumer app is created
  // Set NEXT_PUBLIC_ENABLE_FACEBOOK_SIGNIN=true to enable
  facebookSignIn: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_SIGNIN === 'true',

  // In-app chat (messaging between tenants and landlords)
  // Disabled by default - WhatsApp is the primary messaging channel
  // Set NEXT_PUBLIC_ENABLE_IN_APP_CHAT=true to enable
  enableInAppChat: process.env.NEXT_PUBLIC_ENABLE_IN_APP_CHAT === 'true',

  // Direct messaging (search and message landlords/admins directly)
  // Disabled by default - requires enableInAppChat to also be true
  // Set NEXT_PUBLIC_ENABLE_DIRECT_CHAT=true to enable
  enableDirectChat: process.env.NEXT_PUBLIC_ENABLE_DIRECT_CHAT === 'true',
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature];
}
