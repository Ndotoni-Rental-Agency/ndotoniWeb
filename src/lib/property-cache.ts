import { fetchLocations, type LocationData } from './location/cloudfront-locations';

/**
 * Property Cache Utility
 * Fetches property data from CloudFront for instant loads
 * Always tries CloudFront first, falls back to GraphQL automatically
 */

const CDN_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'https://d2bstvyam1bm1f.cloudfront.net';

export interface PropertyCacheData {
  propertyId: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  pricing: {
    monthlyRent?: number;
    currency?: string;
  };
  address: {
    region?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  specifications: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };
  media: {
    images?: Array<{ url: string; alt?: string }>;
    thumbnail?: string;
  };
  landlordId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCard {
  propertyId: string;
  title: string;
  monthlyRent: number;
  currency: string;
  propertyType: string;
  bedrooms?: number;
  district: string;
  region: string;
  thumbnail?: string;
}

export interface DistrictSearchFeed {
  region: string;
  district: string;
  page: number;
  pageSize: number;
  totalInCache: number;
  hasNextPage: boolean;
  properties: PropertyCard[];
}

/**
 * Clean escaped quotes from string fields
 * Handles cases where strings are double-encoded: "\"text\"" -> "text"
 */
function cleanEscapedString(value: string | undefined): string {
  if (!value) return '';
  
  // Remove surrounding quotes if present
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  
  return value;
}

/**
 * Normalize image array format
 * Handles both formats: [{url: "..."}] and ["..."]
 */
function normalizeImageArray(images: any): string[] {
  if (!Array.isArray(images)) {
    return [];
  }
  
  return images.map(img => {
    // If it's already a string, clean and return it
    if (typeof img === 'string') {
      return cleanEscapedString(img);
    }
    
    // If it's an object with url property, extract and clean the url
    if (img && typeof img === 'object' && img.url) {
      return cleanEscapedString(img.url);
    }
    
    // Fallback: convert to string
    return String(img);
  }).filter(Boolean); // Remove empty strings
}

/**
 * Recursively clean all string fields in an object
 * Handles nested objects and arrays
 * Special handling for media.images format normalization
 */
function cleanObjectStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObjectStrings(item)) as T;
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Special handling for media.images
      if (key === 'images' && Array.isArray(value)) {
        cleaned[key] = normalizeImageArray(value);
      } else if (typeof value === 'string') {
        // Clean string values
        cleaned[key] = cleanEscapedString(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively clean nested objects/arrays
        cleaned[key] = cleanObjectStrings(value);
      } else {
        // Keep other types as-is (numbers, booleans, etc.)
        cleaned[key] = value;
      }
    }
    return cleaned as T;
  }
  
  // Return primitives as-is
  return obj;
}

/**
 * Fetch a single property from CloudFront cache
 * Returns null if not found (fallback to DB query)
 */
export async function getPropertyFromCache(propertyId: string): Promise<PropertyCacheData | null> {
  const url = `${CDN_URL}/properties/${propertyId}.json`;
  console.log("URL ", url);
  
  console.log('[PropertyCache] Fetching property from CloudFront:', propertyId);
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.warn('[PropertyCache] Property not in cache:', propertyId, response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Defensively clean all string fields recursively
    const cleanedData = cleanObjectStrings(data);
    
    console.log('[PropertyCache] ✅ Property loaded from CloudFront:', propertyId);
    
    return cleanedData;
  } catch (error) {
    console.warn('[PropertyCache] Failed to fetch from CloudFront:', error);
    return null;
  }
}

/**
 * Fetch district search feed page from CloudFront
 * Returns property cards ready to render
 */
export async function getDistrictSearchFeedPage(
  region: string,
  district: string,
  page: number
): Promise<DistrictSearchFeed | null> {
  const sanitizedRegion = region.toLowerCase().replace(/\s+/g, '-');
  const sanitizedDistrict = district.toLowerCase().replace(/\s+/g, '-');
  const url = `${CDN_URL}/search/district/${sanitizedRegion}/${sanitizedDistrict}/page-${page}.json`;

  console.log('[PropertyCache] URL:', url);
  console.log('[PropertyCache] Fetching district search feed:', region, district, page);
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 1800 } // Revalidate every 30 minutes
    });
    
    if (!response.ok) {
      console.warn('[PropertyCache] District feed not found:', region, district, page, response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Defensively clean all string fields recursively
    const cleanedData = cleanObjectStrings(data);
    
    console.log('[PropertyCache] ✅ District feed loaded:', cleanedData.properties.length, 'properties');
    
    return cleanedData;
  } catch (error) {
    console.warn('[PropertyCache] Failed to fetch district feed:', error);
    return null;
  }
}

/**
 * Fetch region search by aggregating all districts
 * Returns merged property cards from all districts in region
 */
export async function getRegionSearchFeed(
  region: string,
  districts: string[]
): Promise<PropertyCard[]> {
  console.log('[PropertyCache] Fetching region feed by aggregating districts:', districts);
  
  // Fetch page 1 from all districts in parallel
  const pages = await Promise.all(
    districts.map(d => getDistrictSearchFeedPage(region, d, 1))
  );
  
  // Filter out nulls and merge properties
  const allProperties = pages
    .filter((p): p is DistrictSearchFeed => p !== null)
    .flatMap(p => p.properties);
  
  // Remove duplicates by propertyId
  const uniqueProperties = Array.from(
    new Map(allProperties.map(p => [p.propertyId, p])).values()
  );
  
  console.log('[PropertyCache] Region feed aggregated:', uniqueProperties.length, 'properties from', districts.length, 'districts');
  
  return uniqueProperties;
}

/**
 * Get all districts for a region from CloudFront location service
 * Uses cached location data (30 days cache)
 */
export async function getDistrictsForRegion(region: string): Promise<string[]> {
  try {
    // Fetch locations from CloudFront (uses localStorage cache if available)
    const locations: LocationData = await fetchLocations();
    
    // Find the region by name (case-insensitive)
    const regionKey = Object.keys(locations).find(
      key => key.toLowerCase() === region.toLowerCase()
    );
    
    if (regionKey && locations[regionKey]) {
      const districts = locations[regionKey];
      console.log('[PropertyCache] Found', districts.length, 'districts for', region, 'from CloudFront location service');
      return districts;
    }
    
    console.warn('[PropertyCache] Region not found:', region);
    
    // Fallback: hardcoded districts for Dar es Salaam
    if (region.toLowerCase().includes('dar')) {
      const districts = ['Ilala', 'Kinondoni', 'Temeke', 'Ubungo', 'Kigamboni'];
      console.log('[PropertyCache] Using hardcoded fallback districts for Dar es Salaam');
      return districts;
    }
    
    return [];
  } catch (error) {
    console.error('[PropertyCache] Error getting districts:', error);
    
    // Fallback: hardcoded districts for Dar es Salaam (most common)
    if (region.toLowerCase().includes('dar')) {
      const districts = ['Ilala', 'Kinondoni', 'Temeke', 'Ubungo', 'Kigamboni'];
      console.log('[PropertyCache] Using hardcoded fallback districts for Dar es Salaam');
      return districts;
    }
    
    return [];
  }
}

/**
 * Fetch multiple properties from CloudFront in parallel
 * Returns only the properties that exist in cache
 */
export async function getPropertiesFromCache(propertyIds: string[]): Promise<PropertyCacheData[]> {
  console.log('[PropertyCache] Fetching', propertyIds.length, 'properties from CloudFront');
  
  const promises = propertyIds.map(id => getPropertyFromCache(id));
  const results = await Promise.all(promises);
  
  // Filter out nulls (properties not in cache) - already cleaned by getPropertyFromCache
  const cached = results.filter((p): p is PropertyCacheData => p !== null);
  
  console.log('[PropertyCache] Loaded', cached.length, '/', propertyIds.length, 'properties from cache');
  
  return cached;
}

/**
 * Get CloudFront URL for a property JSON
 * Useful for debugging or direct access
 */
export function getPropertyCacheUrl(propertyId: string): string {
  return `${CDN_URL}/properties/${propertyId}.json`;
}

/**
 * Get CloudFront URL for a district search feed page
 */
export function getDistrictSearchFeedUrl(region: string, district: string, page: number): string {
  const sanitizedRegion = region.toLowerCase().replace(/\s+/g, '-');
  const sanitizedDistrict = district.toLowerCase().replace(/\s+/g, '-');
  return `${CDN_URL}/search/district/${sanitizedRegion}/${sanitizedDistrict}/page-${page}.json`;
}
