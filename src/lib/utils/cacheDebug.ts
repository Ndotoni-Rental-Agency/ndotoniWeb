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
    console.table(stats.byQuery);
    console.log('📊 Cache Statistics:', {
      'Memory Entries': stats.totalEntries,
      'Memory Size': `${(stats.totalMemory / 1024).toFixed(2)} KB`,
      'localStorage Entries': stats.localStorage.entries,
      'localStorage Size': `${stats.localStorage.sizeMB} MB`
    });
    return stats;
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

// Make available in browser console during development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).cacheDebug = cacheDebug;
  console.log('🛠️ Cache debug utilities available as window.cacheDebug');
  console.log('Try: cacheDebug.getStats(), cacheDebug.clearAll(), etc.');
}