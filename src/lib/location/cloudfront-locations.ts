/**
 * CloudFront Location Service
 * 
 * Fetches location data (regions and districts) from CloudFront JSON
 * and caches it in localStorage for 30 days.
 */

const CLOUDFRONT_URL = 'https://d2bstvyam1bm1f.cloudfront.net/api/locations-current.json';
const STORAGE_KEY = 'ndotoni_locations';
const STORAGE_TIMESTAMP_KEY = 'ndotoni_locations_timestamp';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export interface LocationData {
  [regionName: string]: string[]; // region -> array of districts
}

export interface FlattenedLocation {
  type: 'region' | 'district';
  name: string;
  regionName?: string; // Only for districts
  displayName: string; // For search display
}

/**
 * Fetch locations from CloudFront or localStorage cache
 */
export async function fetchLocations(): Promise<LocationData> {
  try {
    // Check localStorage first
    const cached = getCachedLocations();
    if (cached) {
      console.log('📦 Using cached locations from localStorage');
      return cached;
    }

    // Fetch from CloudFront
    console.log('🌐 Fetching locations from CloudFront');
    const response = await fetch(CLOUDFRONT_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data: LocationData = await response.json();
    
    // Cache in localStorage
    cacheLocations(data);
    
    console.log(`✅ Loaded ${Object.keys(data).length} regions from CloudFront`);
    return data;
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    
    // Try to return stale cache if available
    const staleCache = getStaleCache();
    if (staleCache) {
      console.warn('⚠️ Using stale cache due to fetch error');
      return staleCache;
    }
    
    throw new Error('Failed to load locations. Please check your internet connection.');
  }
}

/**
 * Get cached locations if still valid (within 30 days)
 */
function getCachedLocations(): LocationData | null {
  try {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!timestamp || !data) {
      return null;
    }

    const age = Date.now() - parseInt(timestamp, 10);
    
    if (age > CACHE_DURATION) {
      console.log('🗑️ Cache expired, will fetch fresh data');
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Get stale cache (even if expired) as fallback
 */
function getStaleCache(): LocationData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading stale cache:', error);
    return null;
  }
}

/**
 * Cache locations in localStorage
 */
function cacheLocations(data: LocationData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    console.log('💾 Locations cached in localStorage');
  } catch (error) {
    console.error('Error caching to localStorage:', error);
  }
}

/**
 * Flatten location data for search
 * Converts hierarchical structure to flat array for easy searching
 */
export function flattenLocations(data: LocationData): FlattenedLocation[] {
  const flattened: FlattenedLocation[] = [];

  for (const [regionName, districts] of Object.entries(data)) {
    // Add region
    flattened.push({
      type: 'region',
      name: regionName,
      displayName: regionName,
    });

    // Add districts
    for (const districtName of districts) {
      flattened.push({
        type: 'district',
        name: districtName,
        regionName: regionName,
        displayName: `${districtName}, ${regionName}`,
      });
    }
  }

  return flattened;
}

/**
 * Search locations by query string
 */
export function searchLocations(
  flattened: FlattenedLocation[],
  query: string
): FlattenedLocation[] {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();

  return flattened.filter(location => 
    location.name.toLowerCase().includes(lowerQuery) ||
    location.displayName.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Clear location cache
 */
export function clearLocationCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    console.log('🗑️ Location cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache info
 */
export function getCacheInfo() {
  try {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!timestamp || !data) {
      return {
        cached: false,
        age: 0,
        expiresIn: 0,
        regionCount: 0,
      };
    }

    const age = Date.now() - parseInt(timestamp, 10);
    const expiresIn = Math.max(0, CACHE_DURATION - age);
    const parsed: LocationData = JSON.parse(data);
    const regionCount = Object.keys(parsed).length;
    const districtCount = Object.values(parsed).reduce((sum, districts) => sum + districts.length, 0);

    return {
      cached: true,
      age,
      ageHours: Math.floor(age / (60 * 60 * 1000)),
      ageDays: Math.floor(age / (24 * 60 * 60 * 1000)),
      expiresIn,
      expiresInDays: Math.floor(expiresIn / (24 * 60 * 60 * 1000)),
      regionCount,
      districtCount,
      isExpired: age > CACHE_DURATION,
    };
  } catch (error) {
    console.error('Error getting cache info:', error);
    return {
      cached: false,
      age: 0,
      expiresIn: 0,
      regionCount: 0,
    };
  }
}
