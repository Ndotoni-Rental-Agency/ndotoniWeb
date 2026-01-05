'use client';

import PerformanceTester from '@/components/debug/PerformanceTester';
import GraphQLPerformanceTester from '@/components/debug/GraphQLPerformanceTester';
import SearchBar from '@/components/ui/SearchBar';

export default function PerformanceTestPage() {
  const handleSearch = () => {
    // Empty handler for testing purposes
    console.log('Search triggered');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Performance Testing Suite</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Search Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">🔍 Search Performance</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test the optimized location search with debouncing and caching.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* GraphQL Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">⚡ GraphQL Performance</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Compare cached vs uncached GraphQL query performance.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Use the bottom-left widget to run GraphQL performance tests.
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">📊 Performance Expectations</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Search Performance Metrics */}
            <div>
              <h3 className="font-semibold mb-4">Search Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium">Search Speed</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">&lt;5ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium">Debounce Delay</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">200ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-sm font-medium">Dataset Size</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">15k+ locations</span>
                </div>
              </div>
            </div>

            {/* GraphQL Performance Metrics */}
            <div>
              <h3 className="font-semibold mb-4">GraphQL Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium">Cache Hit</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">~1ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-sm font-medium">Cache Miss</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">200-500ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium">Cache Duration</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">2-10min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Testing Widgets */}
      <PerformanceTester />
      <GraphQLPerformanceTester />
    </div>
  );
}