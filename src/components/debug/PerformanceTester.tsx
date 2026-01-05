'use client';

import { useState, useEffect } from 'react';
import { SearchOptimizedLocationItem, fetchLocations, flattenLocationsForSearch } from '@/lib/locations';

/**
 * Performance testing component - only use for debugging
 * Add this temporarily to any page to test search performance
 */
export default function PerformanceTester() {
  const [locations, setLocations] = useState<SearchOptimizedLocationItem[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await fetchLocations();
        const searchOptimizedLocations = flattenLocationsForSearch(locationsData);
        setLocations(searchOptimizedLocations);
        console.log(`📊 Loaded ${searchOptimizedLocations.length} locations for testing`);
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    };
    loadLocations();
  }, []);

  const runPerformanceTest = (query: string, iterations = 100) => {
    if (locations.length === 0) {
      console.log('❌ No locations loaded yet');
      return;
    }

    setIsLoading(true);
    const results: number[] = [];
    
    // Warm up
    for (let i = 0; i < 5; i++) {
      performSearch(query);
    }

    // Actual test
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const searchResults = performSearch(query);
      const duration = performance.now() - start;
      results.push(duration);
    }

    const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
    const minTime = Math.min(...results);
    const maxTime = Math.max(...results);
    const medianTime = results.sort((a, b) => a - b)[Math.floor(results.length / 2)];

    const resultText = `
🔍 Query: "${query}"
📊 ${iterations} iterations on ${locations.length} locations
⚡ Average: ${avgTime.toFixed(2)}ms
🚀 Fastest: ${minTime.toFixed(2)}ms  
🐌 Slowest: ${maxTime.toFixed(2)}ms
📈 Median: ${medianTime.toFixed(2)}ms
✅ Status: ${avgTime < 5 ? 'Excellent' : avgTime < 20 ? 'Good' : 'Needs optimization'}
    `.trim();

    console.log(resultText);
    setTestResults(prev => [resultText, ...prev.slice(0, 4)]); // Keep last 5 results
    setIsLoading(false);
  };

  const performSearch = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    const results: SearchOptimizedLocationItem[] = [];
    const MAX_RESULTS = 8;
    
    for (const location of locations) {
      if (results.length >= MAX_RESULTS) break;
      
      const regionMatch = location._region?.includes(normalizedQuery);
      const districtMatch = location._district?.includes(normalizedQuery);
      const wardMatch = location._ward?.includes(normalizedQuery);
      const streetMatch = location._street?.includes(normalizedQuery);
      
      if (regionMatch || districtMatch || wardMatch || streetMatch) {
        results.push(location);
      }
    }
    
    return results;
  };

  const testQueries = [
    'hanoi',
    'ho chi minh',
    'da nang',
    'hai phong',
    'can tho',
    'district 1',
    'ward 1',
    'nguyen'
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-3">🚀 Search Performance Tester</h3>
      
      <div className="space-y-2 mb-3">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Locations loaded: {locations.length}
        </p>
        
        <div className="grid grid-cols-2 gap-1">
          {testQueries.map(query => (
            <button
              key={query}
              onClick={() => runPerformanceTest(query)}
              disabled={isLoading || locations.length === 0}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test "{query}"
            </button>
          ))}
        </div>
        
        <button
          onClick={() => runPerformanceTest('stress test with long query', 500)}
          disabled={isLoading || locations.length === 0}
          className="w-full px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Stress Test (500 iterations)'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <h4 className="font-semibold text-xs">Recent Results:</h4>
          {testResults.map((result, index) => (
            <pre key={index} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded whitespace-pre-wrap">
              {result}
            </pre>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500">
          💡 Open browser console for detailed logs
        </p>
        <button
          onClick={() => {
            setTestResults([]);
            (window as any).resetSearchStats?.();
          }}
          className="text-xs text-blue-500 hover:underline"
        >
          Clear Results
        </button>
      </div>
    </div>
  );
}