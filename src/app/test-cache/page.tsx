/**
 * Cache Testing Page
 * 
 * Simple page to test cache functionality.
 * Only accessible in development mode.
 */

'use client';

import { useState } from 'react';
import { useDistrictSearchFeed } from '@/hooks/useDistrictSearchFeed';
import { getPropertyFromCache } from '@/lib/property-cache';
import { featureFlags, logFeatureFlags } from '@/lib/feature-flags';
import { CacheStatusBadge } from '@/components/dev/CacheStatusBadge';

export default function TestCachePage() {
  const [propertyId, setPropertyId] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Test district search feed
  const { 
    properties, 
    loading: feedLoading, 
    fromCache,
    totalInCache,
    hasNextPage 
  } = useDistrictSearchFeed({
    region: 'dar-es-salaam',
    district: 'kinondoni',
    page: 1,
    enabled: true,
  });

  const testPropertyCache = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    setTestResult(null);
    
    try {
      const result = await getPropertyFromCache(propertyId);
      setTestResult({
        success: !!result,
        data: result,
        message: result ? 'Property found in cache' : 'Property not in cache (will use GraphQL)',
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Not Available
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only available in development mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🧪 Cache Testing Page
        </h1>

        {/* Feature Flags Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Feature Flags
          </h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Property Cache:</span>
              <span className={featureFlags.usePropertyCache ? 'text-green-600' : 'text-red-600'}>
                {featureFlags.usePropertyCache ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">District Search Cache:</span>
              <span className={featureFlags.useDistrictSearchCache ? 'text-green-600' : 'text-red-600'}>
                {featureFlags.useDistrictSearchCache ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cache-First Strategy:</span>
              <span className={featureFlags.cacheFirstStrategy ? 'text-green-600' : 'text-red-600'}>
                {featureFlags.cacheFirstStrategy ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
          </div>

          <button
            onClick={() => logFeatureFlags()}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Log Flags to Console
          </button>
        </div>

        {/* Test Property Cache */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Property Cache
          </h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="Enter property ID"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={testPropertyCache}
              disabled={loading || !propertyId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium"
            >
              {loading ? 'Testing...' : 'Test'}
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <p className={`font-medium ${testResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {testResult.message || testResult.error}
              </p>
              {testResult.data && (
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Test District Search Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              District Search Feed Test
            </h2>
            <CacheStatusBadge fromCache={fromCache} />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>Region: <span className="font-medium">Dar es Salaam</span></p>
            <p>District: <span className="font-medium">Kinondoni</span></p>
            <p>Page: <span className="font-medium">1</span></p>
          </div>

          {feedLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {properties.length} properties loaded
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Total in cache: {totalInCache} • Has next page: {hasNextPage ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Source: {fromCache ? 'CloudFront Cache' : 'GraphQL'}
                  </p>
                </div>
              </div>

              {properties.length > 0 ? (
                <div className="space-y-2">
                  {properties.slice(0, 5).map((property) => (
                    <div
                      key={property.propertyId}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded"
                    >
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {property.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {property.propertyId} • {property.monthlyRent.toLocaleString()} {property.currency}
                      </p>
                    </div>
                  ))}
                  {properties.length > 5 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                      ... and {properties.length - 5} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No properties found
                </p>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 Testing Instructions
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Check console for detailed cache logs</li>
            <li>• Green badge = loaded from cache</li>
            <li>• Blue badge = loaded from GraphQL</li>
            <li>• Use test-cache-flags.sh to change settings</li>
            <li>• Restart dev server after changing flags</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
