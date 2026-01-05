'use client';

import PerformanceTester from '@/components/debug/PerformanceTester';
import SearchBar from '@/components/ui/SearchBar';

export default function PerformanceTestPage() {
  const handleSearch = () => {
    // Empty handler for testing purposes
    console.log('Search triggered');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Search Performance Testing</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test the Search Bar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Type in the search bar below and watch the console for performance metrics.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Performance Expectations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">🟢 &lt;5ms</div>
              <div className="text-sm text-green-700 dark:text-green-300">Excellent</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">🟡 5-20ms</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Good</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">🔴 &gt;20ms</div>
              <div className="text-sm text-red-700 dark:text-red-300">Needs Work</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tester Widget */}
      <PerformanceTester />
    </div>
  );
}