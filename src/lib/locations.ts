export interface LocationItem {
  region: string;
  district?: string;
  ward?: string;
  street?: string;
}

// Search-optimized location item with pre-normalized lowercase fields
export interface SearchOptimizedLocationItem extends LocationItem {
  _region: string;
  _district?: string;
  _ward?: string;
  _street?: string;
}

// Helper function to normalize location names
function normalizeName(name: string): string {
  return name
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim() // Remove leading/trailing spaces
    .split(' ') // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join back together
}

// Cache for processed locations to avoid repeated API calls and processing
let locationsCache: {
  raw: Record<string, any> | null;
  flattened: LocationItem[] | null;
  searchOptimized: SearchOptimizedLocationItem[] | null;
  timestamp: number;
} = {
  raw: null,
  flattened: null,
  searchOptimized: null,
  timestamp: 0
};

// Cache duration: 5 minutes (adjust as needed)
const CACHE_DURATION = 5 * 60 * 1000;

export async function fetchLocations() {
  // Check if cache is still valid
  const now = Date.now();
  if (locationsCache.raw && (now - locationsCache.timestamp) < CACHE_DURATION) {
    console.log('📦 Using cached locations data');
    return locationsCache.raw;
  }

  console.log('🌐 Fetching fresh locations data');
  const res = await fetch('https://d1i6oti6o90wzi.cloudfront.net/api/locations-current.json', { 
    // Enable browser caching for 1 hour, but allow revalidation
    cache: 'force-cache',
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) throw new Error('Failed to fetch locations');
  
  const data = await res.json();
  
  // Update cache
  locationsCache.raw = data;
  locationsCache.timestamp = now;
  // Clear processed caches when raw data updates
  locationsCache.flattened = null;
  locationsCache.searchOptimized = null;
  
  return data;
}

export function flattenLocations(locationsJson: Record<string, any>): LocationItem[] {
  // Check if we have cached flattened data
  if (locationsCache.flattened && locationsCache.raw === locationsJson) {
    console.log('📦 Using cached flattened locations');
    return locationsCache.flattened;
  }

  console.log('⚙️ Processing locations data');
  const result: LocationItem[] = [];
  
  Object.keys(locationsJson).forEach(regionKey => {
    const normalizedRegion = normalizeName(regionKey);
    const districts = locationsJson[regionKey];
    
    // If there are no districts, just push the region
    if (!districts || Object.keys(districts).length === 0) {
      result.push({ region: normalizedRegion });
    } else {
      Object.entries(districts).forEach(([districtKey, wards]: any) => {
        const normalizedDistrict = normalizeName(districtKey);
        
        if (!wards || Object.keys(wards).length === 0) {
          result.push({ region: normalizedRegion, district: normalizedDistrict });
        } else {
          Object.entries(wards).forEach(([wardKey, streets]: any) => {
            const normalizedWard = normalizeName(wardKey);
            
            if (!streets || streets.length === 0) {
              result.push({ region: normalizedRegion, district: normalizedDistrict, ward: normalizedWard });
            } else {
              streets.forEach((street: string) => {
                const normalizedStreet = normalizeName(street);
                result.push({ 
                  region: normalizedRegion, 
                  district: normalizedDistrict, 
                  ward: normalizedWard, 
                  street: normalizedStreet 
                });
              });
            }
          });
        }
      });
    }
  });
  
  // Cache the result
  locationsCache.flattened = result;
  return result;
}

// Search-optimized version that pre-normalizes lowercase fields for fast searching
export function flattenLocationsForSearch(locationsJson: Record<string, any>): SearchOptimizedLocationItem[] {
  // Check if we have cached search-optimized data
  if (locationsCache.searchOptimized && locationsCache.raw === locationsJson) {
    console.log('📦 Using cached search-optimized locations');
    return locationsCache.searchOptimized;
  }

  console.log('⚙️ Processing search-optimized locations data');
  const result: SearchOptimizedLocationItem[] = [];
  
  Object.keys(locationsJson).forEach(regionKey => {
    const normalizedRegion = normalizeName(regionKey);
    const districts = locationsJson[regionKey];
    
    // If there are no districts, just push the region
    if (!districts || Object.keys(districts).length === 0) {
      result.push({ 
        region: normalizedRegion,
        _region: normalizedRegion.toLowerCase()
      });
    } else {
      Object.entries(districts).forEach(([districtKey, wards]: any) => {
        const normalizedDistrict = normalizeName(districtKey);
        
        if (!wards || Object.keys(wards).length === 0) {
          result.push({ 
            region: normalizedRegion, 
            district: normalizedDistrict,
            _region: normalizedRegion.toLowerCase(),
            _district: normalizedDistrict.toLowerCase()
          });
        } else {
          Object.entries(wards).forEach(([wardKey, streets]: any) => {
            const normalizedWard = normalizeName(wardKey);
            
            if (!streets || streets.length === 0) {
              result.push({ 
                region: normalizedRegion, 
                district: normalizedDistrict, 
                ward: normalizedWard,
                _region: normalizedRegion.toLowerCase(),
                _district: normalizedDistrict.toLowerCase(),
                _ward: normalizedWard.toLowerCase()
              });
            } else {
              streets.forEach((street: string) => {
                const normalizedStreet = normalizeName(street);
                result.push({ 
                  region: normalizedRegion, 
                  district: normalizedDistrict, 
                  ward: normalizedWard, 
                  street: normalizedStreet,
                  _region: normalizedRegion.toLowerCase(),
                  _district: normalizedDistrict.toLowerCase(),
                  _ward: normalizedWard.toLowerCase(),
                  _street: normalizedStreet.toLowerCase()
                });
              });
            }
          });
        }
      });
    }
  });
  
  // Cache the result
  locationsCache.searchOptimized = result;
  return result;
}

export function getLocationDisplayName(location: LocationItem): string {
  const parts = [location.street, location.ward, location.district, location.region].filter(Boolean);
  return parts.join(', ');
}

export function getUniqueRegions(locations: LocationItem[]): string[] {
  return Array.from(new Set(locations.map(loc => loc.region))).sort();
}

export function getDistrictsByRegion(locations: LocationItem[], region: string): string[] {
  return Array.from(new Set(
    locations
      .filter(loc => loc.region === region && loc.district)
      .map(loc => loc.district!)
  )).sort();
}

export function getWardsByDistrict(locations: LocationItem[], region: string, district: string): string[] {
  return Array.from(new Set(
    locations
      .filter(loc => loc.region === region && loc.district === district && loc.ward)
      .map(loc => loc.ward!)
  )).sort();
}

export function getStreetsByWard(locations: LocationItem[], region: string, district: string, ward: string): string[] {
  return Array.from(new Set(
    locations
      .filter(loc => loc.region === region && loc.district === district && loc.ward === ward && loc.street)
      .map(loc => loc.street!)
  )).sort();
}

// Cache management utilities
export function clearLocationsCache() {
  locationsCache.raw = null;
  locationsCache.flattened = null;
  locationsCache.searchOptimized = null;
  locationsCache.timestamp = 0;
  console.log('🗑️ Locations cache cleared');
}

export function getCacheInfo() {
  const now = Date.now();
  const age = locationsCache.timestamp ? now - locationsCache.timestamp : 0;
  const isValid = age < CACHE_DURATION;
  
  return {
    hasRawData: !!locationsCache.raw,
    hasFlattened: !!locationsCache.flattened,
    hasSearchOptimized: !!locationsCache.searchOptimized,
    ageMs: age,
    ageMinutes: Math.round(age / 60000),
    isValid,
    expiresInMs: isValid ? CACHE_DURATION - age : 0
  };
}