/**
 * Cache Debug Panel
 * 
 * Shows feature flag status and cache performance metrics.
 * Only visible in development mode.
 */

'use client';

import { useState, useEffect } from 'react';
import { featureFlags, logFeatureFlags } from '@/lib/feature-flags';

export function CacheDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only show in development
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
        title="Cache Debug Panel"
      >
        🔧 Cache
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Cache Debug
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Feature Flags */}
          <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Feature Flags
              </h4>
            </div>

            <FeatureFlagRow
              label="Property Cache"
              enabled={featureFlags.usePropertyCache}
              description="CloudFront property JSON"
            />

            <FeatureFlagRow
              label="District Search Cache"
              enabled={featureFlags.useDistrictSearchCache}
              description="Pre-generated search feeds"
            />

            <FeatureFlagRow
              label="Cache-First Strategy"
              enabled={featureFlags.cacheFirstStrategy}
              description="Try cache before GraphQL"
            />

            <FeatureFlagRow
              label="Property Subscriptions"
              enabled={featureFlags.enablePropertySubscriptions}
              description="Real-time updates"
            />

            <FeatureFlagRow
              label="Lazy Loading"
              enabled={featureFlags.enableLazyLoading}
              description="Defer image loading"
            />
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                logFeatureFlags();
                console.log('📊 Feature flags logged to console');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Log to Console
            </button>
          </div>

          {/* Environment Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>
                <span className="font-semibold">CDN:</span>{' '}
                {process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN?.slice(0, 30)}...
              </div>
              <div>
                <span className="font-semibold">Mode:</span> {process.env.NODE_ENV}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface FeatureFlagRowProps {
  label: string;
  enabled: boolean;
  description: string;
}

function FeatureFlagRow({ label, enabled, description }: FeatureFlagRowProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </div>
      </div>
      <div className="ml-3">
        {enabled ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ✓ ON
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            ✕ OFF
          </span>
        )}
      </div>
    </div>
  );
}
