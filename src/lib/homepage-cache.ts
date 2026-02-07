/**
 * Homepage Cache Utility
 * Fetches pre-generated property data from CloudFront for instant homepage loads
 */

import { PropertyCard } from '@/API';

export interface HomepageCacheData {
  lowestPrice: PropertyCard[];
  highestPrice: PropertyCard[];
  featured: PropertyCard[];
  recent: PropertyCard[];
  generatedAt: string;
  stage: string;
}

// Single URL for homepage cache
const HOMEPAGE_CACHE_URL = process.env.NEXT_PUBLIC_HOMEPAGE_CACHE_URL || 
  'https://d2bstvyam1bm1f.cloudfront.net/homepage/dev/properties.json';

/**
 * Fetch all homepage property sections from CloudFront cache
 * Single HTTP request for all data - extremely fast!
 * Throws error if fetch fails (no fallback)
 */
export async function getHomepagePropertiesFromCache(): Promise<HomepageCacheData> {
  const response = await fetch(HOMEPAGE_CACHE_URL, {
    next: { revalidate: 1800 },
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`CloudFront fetch failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Transform CloudFront cache data to match the app's expected structure
 */
export function transformCacheToAppData(cacheData: HomepageCacheData) {
  return {
    categorizedProperties: {
      nearby: {
        properties: cacheData.recent,
        count: cacheData.recent.length,
        category: 'NEARBY' as const,
      },
      lowestPrice: {
        properties: cacheData.lowestPrice,
        count: cacheData.lowestPrice.length,
        category: 'LOWEST_PRICE' as const,
      },
      mostViewed: {
        properties: cacheData.featured,
        count: cacheData.featured.length,
        category: 'MOST_VIEWED' as const,
      },
      more: {
        properties: cacheData.highestPrice,
        count: cacheData.highestPrice.length,
        category: 'MORE' as const,
      },
      // Add highestPrice as a separate visible section
      // This gives us 4 distinct sections on the homepage
    },
  };
}
