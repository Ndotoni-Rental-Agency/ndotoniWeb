'use client';

import React, { useState, useEffect } from 'react';
import { cachedGraphQL } from '@/lib/cache';

/**
 * Cache indicator for debugging
 * Shows in development OR when ?debug=cache is in URL OR when Ctrl+Shift+D is pressed
 */
export function CacheIndicator() {
  const [stats, setStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Array<{
    query: string;
    hit: boolean;
    timestamp: number;
  }>>([]);

  // Check if debug mode should be enabled
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = typeof window !== 'undefined' && 
      (window.location.search.includes('debug=cache') || 
       window.location.search.includes('debug=true') ||
       localStorage.getItem('ndotoni_debug_cache') === 'true');
    
    setIsEnabled(isDev || hasDebugParam);

    // Keyboard shortcut: Ctrl+Shift+D to toggle
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const newState = !isEnabled;
        setIsEnabled(newState);
        localStorage.setItem('ndotoni_debug_cache', String(newState));
        console.log(`🛠️ Cache debug ${newState ? 'enabled' : 'disabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    // Update stats every 2 seconds
    const interval = setInterval(() => {
      const currentStats = cachedGraphQL.getStats();
      setStats(currentStats);
    }, 2000);

    // Initial load
    setStats(cachedGraphQL.getStats());

    return () => clearInterval(interval);
  }, [isEnabled]);

  // Don't render if not enabled or no stats
  if (!isEnabled || !stats) return null;

  const totalQueries = Object.values(stats.byQuery).reduce(
    (sum: number, q: any) => sum + q.count,
    0
  );

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Compact indicator */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm font-mono flex items-center gap-2"
          title="Click to expand cache stats"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>Cache: {totalQueries} queries</span>
        </button>
      )}

      {/* Expanded panel */}
      {isExpanded && (
        <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 w-96 max-h-[600px] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-sm">GraphQL Cache Monitor</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-400">Memory Entries</div>
              <div className="text-lg font-bold">{stats.totalEntries}</div>
            </div>
            <div className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-400">Memory Size</div>
              <div className="text-lg font-bold">
                {(stats.totalMemory / 1024).toFixed(1)}KB
              </div>
            </div>
            <div className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-400">localStorage</div>
              <div className="text-lg font-bold">{stats.localStorage.entries}</div>
            </div>
            <div className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-400">Storage Size</div>
              <div className="text-lg font-bold">{stats.localStorage.sizeMB}MB</div>
            </div>
          </div>

          {/* Query Breakdown */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">
              CACHED QUERIES
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {Object.entries(stats.byQuery).map(([query, data]: [string, any]) => (
                <div
                  key={query}
                  className="bg-gray-800 rounded p-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-blue-400">{query}</span>
                    <span className="text-gray-400">{data.count}x</span>
                  </div>
                  <div className="flex justify-between text-gray-500 mt-1">
                    <span>{(data.totalSize / 1024).toFixed(1)}KB</span>
                    <span>
                      {Math.floor(data.oldestAge / 1000)}s old
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                cachedGraphQL.clearAll();
                setStats(cachedGraphQL.getStats());
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-semibold transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                cachedGraphQL.cleanup();
                setStats(cachedGraphQL.getStats());
              }}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-xs font-semibold transition-colors"
            >
              Cleanup
            </button>
            <button
              onClick={() => {
                console.log('📊 Full Cache Stats:', stats);
                console.log('🔍 Use window.cacheDebug for more tools');
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-semibold transition-colors"
            >
              Log Stats
            </button>
          </div>

          {/* Tips */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              💡 <strong>Console commands:</strong>
              <div className="mt-1 font-mono text-gray-500">
                • window.cacheDebug.getStats()
                <br />
                • window.cacheDebug.clearAll()
                <br />
                • window.cacheDebug.getStorageInfo()
              </div>
              <div className="mt-2 text-gray-500">
                Press <kbd className="px-1 bg-gray-800 rounded">Ctrl+Shift+D</kbd> to toggle
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
