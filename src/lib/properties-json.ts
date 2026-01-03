import { PropertyCard as PropertyCardType } from '@/types';

export async function fetchPropertyCards() {
  const res = await fetch('https://d1i6oti6o90wzi.cloudfront.net/api/properties-2025-12-20T04-41-26-778Z.json', { 
    cache: 'no-store' 
  });
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export function flattenPropertyCards(propertiesResponse: any): PropertyCardType[] {
  // Handle the response structure: { properties: Array, totalCount: number, generatedAt: string }
  const properties = propertiesResponse.properties || [];
  
  return properties.map((property: any) => ({
    propertyId: property.propertyId, 
    title: property.title,
    propertyType: property.propertyType,
    available: property.status === 'AVAILABLE', 
    monthlyRent: property.pricing?.monthlyRent || 0,
    currency: property.pricing?.currency || 'TZS',
    region: property.address?.region || '',
    district: property.address?.district || '',
    ward: property.address?.ward,
    bedrooms: property.specifications?.bedrooms, 
    thumbnail: property.media?.thumbnail || property.media?.images?.[0] || null,
  }));
}