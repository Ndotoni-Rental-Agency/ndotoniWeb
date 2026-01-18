// =============================================================================
// CACHE DEBUG UTILITIES
// Development utilities for monitoring and managing localStorage cache
// =============================================================================

import { cachedGraphQL } from '@/lib/cache';

/**
 * Debug utilities for cache management
 * Available in browser console as window.cacheDebug
 */
export const cacheDebug = {
  /**
   * Get detailed cache statistics
   */
  getStats() {
    const stats = cachedGraphQL.getStats();
    console.log('\n📊 CACHE STATISTICS\n');
    console.table(stats.byQuery);
    console.log('\n💾 Storage Info:', {
      'Memory Entries': stats.totalEntries,
      'Memory Size': `${(stats.totalMemory / 1024).toFixed(2)} KB`,
      'localStorage Entries': stats.localStorage.entries,
      'localStorage Size': `${stats.localStorage.sizeMB} MB`
    });
    console.log('\n⚡ Performance:', {
      'Cache Hits': stats.performance.hits,
      'Cache Misses': stats.performance.misses,
      'Hit Rate': stats.performance.hitRate,
      'Total Queries': stats.performance.hits + stats.performance.misses
    });
    console.log('\n🕐 Recent Queries:');
    console.table(stats.performance.recentQueries);
    return stats;
  },

  /**
   * Watch cache activity in real-time
   */
  watch() {
    console.log('👀 Watching cache activity... (refresh page to stop)');
    console.log('✅ = Cache HIT (fast), ❌ = Cache MISS (slow)\n');
  },

  /**
   * Get performance summary
   */
  getPerformance() {
    const stats = cachedGraphQL.getStats();
    const perf = stats.performance;
    
    console.log('\n⚡ CACHE PERFORMANCE SUMMARY\n');
    console.log(`Total Queries: ${perf.hits + perf.misses}`);
    console.log(`Cache Hits: ${perf.hits} ✅`);
    console.log(`Cache Misses: ${perf.misses} ❌`);
    console.log(`Hit Rate: ${perf.hitRate}`);
    console.log('\nInterpretation:');
    console.log('• Hit Rate > 70% = Excellent caching');
    console.log('• Hit Rate 40-70% = Good caching');
    console.log('• Hit Rate < 40% = Poor caching (check cache durations)');
    
    return perf;
  },

  /**
   * List all localStorage cache keys
   */
  listStorageKeys() {
    if (typeof window === 'undefined') return [];
    
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith('ndotoni_'))
      .map(key => ({
        key,
        size: `${(localStorage.getItem(key)?.length || 0 / 1024).toFixed(2)} KB`,
        preview: localStorage.getItem(key)?.substring(0, 100) + '...'
      }));
    
    console.table(keys);
    return keys;
  },

  /**
   * Clear all ndotoni cache data
   */
  clearAll() {
    cachedGraphQL.clearAll();
    
    // Clear other localStorage items
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('ndotoni_'));
      keys.forEach(key => localStorage.removeItem(key));
      console.log(`🧹 Cleared ${keys.length} localStorage entries`);
    }
    
    console.log('✅ All cache cleared');
  },

  /**
   * Clear only GraphQL cache
   */
  clearGraphQL() {
    cachedGraphQL.clearAll();
    console.log('✅ GraphQL cache cleared');
  },

  /**
   * Clear only favorites
   */
  clearFavorites() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ndotoni_favorites');
      console.log('✅ Favorites cleared');
    }
  },

  /**
   * Clear only recently viewed
   */
  clearRecentlyViewed() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ndotoni_recently_viewed');
      console.log('✅ Recently viewed cleared');
    }
  },

  /**
   * Force refresh all cached data
   */
  async refreshAll() {
    console.log('🔄 Refreshing all cached data...');
    
    // Clear cache first
    this.clearAll();
    
    // Force refresh would need to be implemented in the components
    // For now, just log instructions
    console.log('💡 To see fresh data, refresh the page or navigate away and back');
  },

  /**
   * Get localStorage usage info
   */
  getStorageInfo() {
    if (typeof window === 'undefined') return null;
    
    let totalSize = 0;
    let ndotoniSize = 0;
    let ndotoniCount = 0;
    
    for (const key in localStorage) {
      const size = localStorage.getItem(key)?.length || 0;
      totalSize += size;
      
      if (key.startsWith('ndotoni_')) {
        ndotoniSize += size;
        ndotoniCount++;
      }
    }
    
    const info = {
      'Total localStorage': `${(totalSize / 1024).toFixed(2)} KB`,
      'Ndotoni Cache': `${(ndotoniSize / 1024).toFixed(2)} KB`,
      'Ndotoni Entries': ndotoniCount,
      'Usage %': `${((ndotoniSize / totalSize) * 100).toFixed(1)}%`,
      'Estimated Quota': '5-10 MB (varies by browser)'
    };
    
    console.log('💾 localStorage Usage:', info);
    return info;
  }
};

// Make available in browser console (always, not just development)
if (typeof window !== 'undefined') {
  (window as any).cacheDebug = cacheDebug;
  
  // Only log in development or when debug is enabled
  const isDev = process.env.NODE_ENV === 'development';
  const hasDebug = window.location.search.includes('debug') || 
                   localStorage.getItem('ndotoni_debug_cache') === 'true';
  
  if (isDev || hasDebug) {
    console.log('\n🛠️  CACHE DEBUG TOOLS LOADED\n');
    console.log('Available commands:');
    console.log('  • cacheDebug.getStats()      - View cache statistics');
    console.log('  • cacheDebug.getPerformance() - View hit/miss rates');
    console.log('  • cacheDebug.watch()         - Watch cache activity');
    console.log('  • cacheDebug.clearAll()      - Clear all cache');
    console.log('  • cacheDebug.getStorageInfo() - View storage usage');
    console.log('\n💡 Look for ✅ (cache hit) and ❌ (cache miss) in console');
    console.log('💡 Press Ctrl+Shift+D to toggle visual indicator\n');
  }
}