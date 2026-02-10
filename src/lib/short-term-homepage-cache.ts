/**
 * Short-Term Property Homepage Cache
 * 
 * Fetches pre-generated property cards from CloudFront for fast homepage loading.
 * Falls back to GraphQL if cache is unavailable.
 */

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
const STAGE = process.env.NEXT_PUBLIC_STAGE || 'dev';

export interface ShortTermPropertyCard {
  propertyId: string;
  title: string;
  propertyType: string;
  region: string;
  district: string;
  nightlyRate: number;
  currency: string;
  thumbnail: string;
  maxGuests: number;
  averageRating: number;
  totalReviews: number;
  instantBookEnabled: boolean;
}

export interface ShortTermHomepageCache {
  lowestPrice: ShortTermPropertyCard[];
  highestPrice: ShortTermPropertyCard[];
  topRated: ShortTermPropertyCard[];
  featured: ShortTermPropertyCard[];
  recent: ShortTermPropertyCard[];
  generatedAt: string;
}

/**
 * Fetch short-term properties homepage cache from CloudFront
 * 
 * @returns Homepage cache data with all property categories
 */
export async function fetchShortTermHomepageCache(): Promise<ShortTermHomepageCache> {
  try {
    const url = `${CLOUDFRONT_URL}/homepage/${STAGE}/short-term-properties.json`;
    
    console.log('[ShortTermHomepageCache] Fetching from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // 30 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('[ShortTermHomepageCache] Cache hit', {
      generatedAt: data.generatedAt,
      lowestPriceCount: data.lowestPrice?.length || 0,
      highestPriceCount: data.highestPrice?.length || 0,
      topRatedCount: data.topRated?.length || 0,
      featuredCount: data.featured?.length || 0,
      recentCount: data.recent?.length || 0,
    });

    return {
      lowestPrice: data.lowestPrice || [],
      highestPrice: data.highestPrice || [],
      topRated: data.topRated || [],
      featured: data.featured || [],
      recent: data.recent || [],
      generatedAt: data.generatedAt,
    };
  } catch (error) {
    console.error('[ShortTermHomepageCache] Error fetching cache:', error);
    
    // Fallback to GraphQL
    console.log('[ShortTermHomepageCache] Falling back to GraphQL');
    return fetchShortTermPropertiesViaGraphQL();
  }
}

/**
 * Fallback: Fetch short-term properties via GraphQL
 * Used when CloudFront cache is unavailable
 */
async function fetchShortTermPropertiesViaGraphQL(): Promise<ShortTermHomepageCache> {
  // TODO: Implement GraphQL fallback when GraphQL queries are available
  console.warn('[ShortTermHomepageCache] GraphQL fallback not yet implemented');
  
  return {
    lowestPrice: [],
    highestPrice: [],
    topRated: [],
    featured: [],
    recent: [],
    generatedAt: new Date().toISOString(),
  };
}
