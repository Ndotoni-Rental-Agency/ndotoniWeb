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
  total: number;
  properties: PropertyCard[];
  nextToken: string | null;
}

export interface RegionSearchFeed {
  region: string;
  total: number;
  properties: PropertyCard[];
  nextToken: string | null;
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
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const cleanedData = cleanObjectStrings(data);
    
    return cleanedData;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch district search feed from CloudFront (page 1 only)
 * Returns property cards + nextToken for pagination
 */
export async function getDistrictSearchFeedPage(
  region: string,
  district: string,
  page: number
): Promise<DistrictSearchFeed | null> {
  if (page !== 1) {
    return null;
  }
  
  const sanitizedRegion = region.toLowerCase().replace(/\s+/g, '-');
  const sanitizedDistrict = district.toLowerCase().replace(/\s+/g, '-');
  const url = `${CDN_URL}/search/district/${sanitizedRegion}/${sanitizedDistrict}/page-1.json`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const cleanedData = cleanObjectStrings(data);
    
    return cleanedData;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch region search feed from CloudFront (page 1 only)
 * Returns property cards + nextToken for pagination
 */
export async function getRegionSearchFeed(
  region: string
): Promise<RegionSearchFeed | null> {
  const sanitizedRegion = region.toLowerCase().replace(/\s+/g, '-');
  const url = `${CDN_URL}/search/region/${sanitizedRegion}.json`;
  
  try {
    const response = await fetch(url, {
      cache: 'default',
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const cleanedData = cleanObjectStrings(data);
    
    return cleanedData;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch multiple properties from CloudFront in parallel
 * Returns only the properties that exist in cache
 */
export async function getPropertiesFromCache(propertyIds: string[]): Promise<PropertyCacheData[]> {
  const promises = propertyIds.map(id => getPropertyFromCache(id));
  const results = await Promise.all(promises);
  const cached = results.filter((p): p is PropertyCacheData => p !== null);
  
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
