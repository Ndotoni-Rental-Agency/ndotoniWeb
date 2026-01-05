export interface LocationItem {
  region: string;
  district?: string;
  ward?: string;
  street?: string;
}

export async function fetchLocations() {
  const res = await fetch('https://d1i6oti6o90wzi.cloudfront.net/api/locations-2026-01-05T03-53-47-890Z.json', { 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export function flattenLocations(locationsJson: Record<string, any>): LocationItem[] {
  const result: LocationItem[] = [];
  
  Object.keys(locationsJson).forEach(region => {
    const districts = locationsJson[region];
    
    // If there are no districts, just push the region
    if (!districts || Object.keys(districts).length === 0) {
      result.push({ region });
    } else {
      Object.entries(districts).forEach(([district, wards]: any) => {
        if (!wards || Object.keys(wards).length === 0) {
          result.push({ region, district });
        } else {
          Object.entries(wards).forEach(([ward, streets]: any) => {
            if (!streets || streets.length === 0) {
              result.push({ region, district, ward });
            } else {
              streets.forEach((street: string) => {
                result.push({ region, district, ward, street });
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