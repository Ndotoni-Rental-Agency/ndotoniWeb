export interface LocationItem {
  region: string;
  district?: string;
  ward?: string;
  street?: string;
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

export async function fetchLocations() {
  const res = await fetch('https://d1i6oti6o90wzi.cloudfront.net/api/locations-current.json', { 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export function flattenLocations(locationsJson: Record<string, any>): LocationItem[] {
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