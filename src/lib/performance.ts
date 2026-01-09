// Performance monitoring utilities
export const measurePerformance = {
  // Measure component render time
  measureRender: (componentName: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
  },

  // Measure async operation time
  measureAsync: async <T>(operationName: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`${operationName} completed in: ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`${operationName} failed after: ${end - start}ms`);
      throw error;
    }
  },

  // Log Web Vitals
  logWebVitals: () => {
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      // This would integrate with web-vitals library if installed
      console.log('Web Vitals monitoring enabled');
    }
  },

  // Memory usage monitoring
  logMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }
};

// Performance-aware cache with size limits
export class PerformanceCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; accessCount: number }>();
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize = 100, maxAge = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  set(key: string, data: T): void {
    // Remove expired entries
    this.cleanup();
    
    // Remove least recently used if at capacity
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.getLRUKey();
      if (lruKey) this.cache.delete(lruKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 0
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    // Update access count
    entry.accessCount++;
    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.maxAge) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private getLRUKey(): string | null {
    let lruKey: string | null = null;
    let minAccessCount = Infinity;
    let oldestTimestamp = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.accessCount < minAccessCount || 
          (entry.accessCount === minAccessCount && entry.timestamp < oldestTimestamp)) {
        minAccessCount = entry.accessCount;
        oldestTimestamp = entry.timestamp;
        lruKey = key;
      }
    });

    return lruKey;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}