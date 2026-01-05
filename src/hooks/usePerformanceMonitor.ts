import { useEffect, useRef } from 'react';
import { SearchOptimizedLocationItem } from '@/lib/locations';

/**
 * Performance monitoring hook to measure search performance
 * Shows detailed metrics in console for debugging
 */
export function usePerformanceMonitor(searchQuery: string, filteredResults: SearchOptimizedLocationItem[]) {
  const startTimeRef = useRef<number>(0);
  const lastQueryRef = useRef<string>('');
  const searchCountRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  useEffect(() => {
    if (searchQuery !== lastQueryRef.current && searchQuery.length > 0) {
      startTimeRef.current = performance.now();
      lastQueryRef.current = searchQuery;
    }
  }, [searchQuery]);

  useEffect(() => {
    if (startTimeRef.current > 0 && searchQuery.length > 0) {
      const endTime = performance.now();
      const duration = endTime - startTimeRef.current;
      
      if (duration > 0) {
        searchCountRef.current++;
        totalTimeRef.current += duration;
        const avgTime = totalTimeRef.current / searchCountRef.current;
        
        // Color-coded performance logging
        const color = duration < 5 ? '🟢' : duration < 20 ? '🟡' : '🔴';
        
        console.group(`${color} Search Performance #${searchCountRef.current}`);
        console.log(`Query: "${searchQuery}"`);
        console.log(`Duration: ${duration.toFixed(2)}ms`);
        console.log(`Results: ${filteredResults.length}`);
        console.log(`Average: ${avgTime.toFixed(2)}ms`);
        console.log(`Status: ${duration < 5 ? 'Excellent' : duration < 20 ? 'Good' : 'Needs optimization'}`);
        console.groupEnd();
      }
      
      startTimeRef.current = 0;
    }
  }, [filteredResults, searchQuery]);

  // Reset stats when component unmounts or on demand
  const resetStats = () => {
    searchCountRef.current = 0;
    totalTimeRef.current = 0;
    console.log('🔄 Performance stats reset');
  };

  // Expose reset function globally for testing
  useEffect(() => {
    (window as any).resetSearchStats = resetStats;
    return () => {
      delete (window as any).resetSearchStats;
    };
  }, []);
}