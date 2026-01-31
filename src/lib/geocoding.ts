// Geocoding utilities
// Uses OpenStreetMap Nominatim API for geocoding

export interface CoordinatesInput {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  region: string;
  district: string;
  ward?: string;
  street?: string;
}

/**
 * Get approximate coordinates for a location using OpenStreetMap Nominatim API
 */
export async function getApproximateCoordinates(location: LocationData): Promise<CoordinatesInput | null> {
  if (!location.region || !location.district) {
    return null;
  }

  try {
    const query = [
      location.street,
      location.ward,
      location.district,
      location.region,
      'Tanzania',
    ]
      .filter(Boolean)
      .join(', ');

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      console.warn('Geocoding API request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data?.[0]) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          latitude: lat,
          longitude: lng
        };
      }
    }
    
    console.warn('No coordinates found for location:', query);
    return null;
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to location data
 * Reverse geocoding service integration to be implemented
 */
export async function reverseGeocode(coordinates: CoordinatesInput): Promise<LocationData | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}`
    );
    
    if (!response.ok) {
      console.warn('Reverse geocoding API request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data?.address) {
      return {
        region: data.address.state || data.address.region || '',
        district: data.address.county || data.address.city || data.address.town || '',
        ward: data.address.suburb || data.address.neighbourhood || '',
        street: data.address.road || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding coordinates:', error);
    return null;
  }
}