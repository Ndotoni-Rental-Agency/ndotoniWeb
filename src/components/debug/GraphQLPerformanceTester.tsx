'use client';

import { useState } from 'react';
import { client, cachedGraphQL, getPropertyCards, getProperty } from '@/lib/graphql';

/**
 * GraphQL Performance Testing Component
 * Compares cached vs uncached GraphQL performance
 */
export default function GraphQLPerformanceTester() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runPerformanceTest = async (testType: 'cached' | 'uncached', queryType: 'list' | 'detail') => {
    setIsLoading(true);
    const iterations = 5;
    const times: number[] = [];
    
    try {
      // Warm up
      if (testType === 'cached') {
        await cachedGraphQL.query({
          query: queryType === 'list' ? getPropertyCards : getProperty,
          variables: queryType === 'list' ? { limit: 20 } : { propertyId: '51bdea9d-1854-43fe-880d-8f14bc52c61e' }
        });
      }

      // Run test iterations
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        
        if (testType === 'cached') {
          await cachedGraphQL.query({
            query: queryType === 'list' ? getPropertyCards : getProperty,
            variables: queryType === 'list' ? { limit: 20 } : { propertyId: '51bdea9d-1854-43fe-880d-8f14bc52c61e' },
            forceRefresh: i === 0 // Force refresh on first iteration only
          });
        } else {
          await client.graphql({
            query: queryType === 'list' ? getPropertyCards : getProperty,
            variables: queryType === 'list' ? { limit: 20 } : { propertyId: '51bdea9d-1854-43fe-880d-8f14bc52c61e' }
          });
        }
        
        const duration = performance.now() - start;
        times.push(duration);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      const resultText = `
🔍 ${testType.toUpperCase()} - ${queryType === 'list' ? 'Property List' : 'Property Detail'}
📊 ${iterations} iterations
⚡ Average: ${avgTime.toFixed(2)}ms
🚀 Fastest: ${minTime.toFixed(2)}ms
🐌 Slowest: ${maxTime.toFixed(2)}ms
📈 Cache benefit: ${testType === 'cached' ? 'First: ' + times[0].toFixed(2) + 'ms, Rest: ~' + (times.slice(1).reduce((a, b) => a + b, 0) / (times.length - 1)).toFixed(2) + 'ms' : 'All fresh requests'}
      `.trim();

      setResults(prev => [resultText, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Test failed:', error);
      setResults(prev => [`❌ Test failed: ${error}`, ...prev.slice(0, 4)]);
    }
    
    setIsLoading(false);
  };

  const clearCache = () => {
    cachedGraphQL.clearAll();
    setResults(prev => ['🗑️ Cache cleared', ...prev.slice(0, 4)]);
  };

  const showCacheStats = () => {
    const stats = cachedGraphQL.getStats();
    const statsText = `
📊 Cache Statistics
Total entries: ${stats.totalEntries}
Memory usage: ${(stats.totalMemory / 1024).toFixed(1)}KB
Queries cached: ${Object.keys(stats.byQuery).join(', ')}
    `.trim();
    
    setResults(prev => [statsText, ...prev.slice(0, 4)]);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-3">⚡ GraphQL Performance Tester</h3>
      
      <div className="space-y-2 mb-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Compare cached vs uncached GraphQL performance
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => runPerformanceTest('cached', 'list')}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Cached List
          </button>
          
          <button
            onClick={() => runPerformanceTest('uncached', 'list')}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Uncached List
          </button>
          
          <button
            onClick={() => runPerformanceTest('cached', 'detail')}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Cached Detail
          </button>
          
          <button
            onClick={() => runPerformanceTest('uncached', 'detail')}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Uncached Detail
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-1 mt-2">
          <button
            onClick={showCacheStats}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Cache Stats
          </button>
          
          <button
            onClick={clearCache}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Clear Cache
          </button>
        </div>
        
        {isLoading && (
          <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
            Running test...
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h4 className="font-semibold text-xs">Recent Results:</h4>
          {results.map((result, index) => (
            <pre key={index} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded whitespace-pre-wrap">
              {result}
            </pre>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500">
          💡 Watch console for cache logs
        </p>
      </div>
    </div>
  );
}