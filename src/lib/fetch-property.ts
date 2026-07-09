/**
 * Server-side property fetching using raw fetch (no Amplify client dependency).
 * Used by generateMetadata and JSON-LD generation in property pages.
 */

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

// Long-term rental property query
const GET_PROPERTY_QUERY = `query GetProperty($propertyId: ID!) {
  getProperty(propertyId: $propertyId) {
    propertyId
    title
    description
    propertyType
    status
    verified
    address {
      district
      region
      street
      ward
      coordinates {
        latitude
        longitude
      }
    }
    amenities
    media {
      images
      videos
    }
    pricing {
      currency
      monthlyRent
      deposit
      serviceCharge
      utilitiesIncluded
    }
    specifications {
      bathrooms
      bedrooms
      floors
      furnished
      parkingSpaces
      squareMeters
    }
    availability {
      available
      availableFrom
      minimumLeaseTerm
      maximumLeaseTerm
    }
    landlord {
      firstName
      lastName
    }
  }
}`;

export interface LongTermPropertySEO {
  propertyId: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  verified: boolean;
  address: {
    district: string;
    region: string;
    street: string;
    ward: string;
    coordinates: { latitude: number; longitude: number } | null;
  } | null;
  amenities: string[];
  media: { images: string[]; videos: string[] } | null;
  pricing: {
    currency: string;
    monthlyRent: number;
    deposit: number | null;
    serviceCharge: number | null;
    utilitiesIncluded: boolean | null;
  } | null;
  specifications: {
    bathrooms: number | null;
    bedrooms: number | null;
    floors: number | null;
    furnished: boolean | null;
    parkingSpaces: number | null;
    squareMeters: number | null;
  } | null;
  availability: {
    available: boolean;
    availableFrom: string | null;
    minimumLeaseTerm: number | null;
    maximumLeaseTerm: number | null;
  } | null;
  landlord: { firstName: string; lastName: string } | null;
}

export async function fetchLongTermPropertyForSEO(propertyId: string): Promise<LongTermPropertySEO | null> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        query: GET_PROPERTY_QUERY,
        variables: { propertyId },
      }),
      next: { revalidate: 3600 },
    });

    const data = await response.json();
    return data?.data?.getProperty || null;
  } catch (error) {
    console.error('[fetchLongTermPropertyForSEO] Error:', error);
    return null;
  }
}
