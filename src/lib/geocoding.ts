/**
 * Geocoding utilities for converting addresses to coordinates
 * Currently returns default coordinates, but can be extended to use
 * geocoding services like Google Maps API, Mapbox, or OpenStreetMap
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  region: string;
  district: string;
  ward?: string;
  street?: string;
}

/**
 * Get coordinates for a given address
 * Currently returns default coordinates (0, 0)
 * TODO: Implement actual geocoding service integration
 */
export async function getCoordinatesForAddress(address: Address): Promise<Coordinates> {
  // For now, return default coordinates
  // In the future, this could call a geocoding service
  
  // Example implementation with Google Maps Geocoding API:
  // const fullAddress = [address.street, address.ward, address.district, address.region]
  //   .filter(Boolean)
  //   .join(', ');
  // 
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`
  // );
  // const data = await response.json();
  // 
  // if (data.results && data.results.length > 0) {
  //   const location = data.results[0].geometry.location;
  //   return {
  //     latitude: location.lat,
  //     longitude: location.lng
  //   };
  // }
  
  return {
    latitude: 0,
    longitude: 0
  };
}

/**
 * Get approximate coordinates for major Tanzania locations
 * This is a fallback method using known coordinates for major cities/regions
 */
export function getApproximateCoordinates(address: Address): Coordinates {
  const locationMap: Record<string, Coordinates> = {
    // Dar es Salaam regions
    'dar es salaam': { latitude: -6.7924, longitude: 39.2083 },
    'kinondoni': { latitude: -6.7731, longitude: 39.2294 },
    'ilala': { latitude: -6.8103, longitude: 39.2891 },
    'temeke': { latitude: -6.8590, longitude: 39.2803 },
    
    // Other major regions
    'arusha': { latitude: -3.3869, longitude: 36.6830 },
    'mwanza': { latitude: -2.5164, longitude: 32.9175 },
    'dodoma': { latitude: -6.1630, longitude: 35.7516 },
    'mbeya': { latitude: -8.9094, longitude: 33.4607 },
    'morogoro': { latitude: -6.8235, longitude: 37.6617 },
    'tanga': { latitude: -5.0692, longitude: 39.0991 },
    
    // Dar es Salaam districts/wards
    'masaki': { latitude: -6.7924, longitude: 39.2083 },
    'mikocheni': { latitude: -6.7731, longitude: 39.2294 },
    'oyster bay': { latitude: -6.7849, longitude: 39.2654 },
    'upanga west': { latitude: -6.8103, longitude: 39.2891 },
    'upanga east': { latitude: -6.8103, longitude: 39.2891 },
    'changombe': { latitude: -6.8590, longitude: 39.2803 },
  };

  // Try to find coordinates by ward, district, or region
  const searchTerms = [
    address.ward?.toLowerCase(),
    address.district?.toLowerCase(),
    address.region?.toLowerCase()
  ].filter(Boolean);

  for (const term of searchTerms) {
    if (term && locationMap[term]) {
      return locationMap[term];
    }
  }

  // Default to Dar es Salaam center if no match found
  return { latitude: -6.7924, longitude: 39.2083 };
}

/**
 * Auto-populate coordinates for an address
 * Uses approximate coordinates for now, can be enhanced with geocoding services
 */
export async function autoPopulateCoordinates(address: Address): Promise<Coordinates> {
  try {
    // For now, use approximate coordinates
    // In production, you might want to call getCoordinatesForAddress first
    return getApproximateCoordinates(address);
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return { latitude: 0, longitude: 0 };
  }
}