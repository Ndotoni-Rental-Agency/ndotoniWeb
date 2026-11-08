import 'server-only';
import { cache } from 'react';
import type { Property } from '@/API';

export type LongTermPropertySEO = Property & { groupId?: string | null; isPrimaryUnit?: boolean | null; unitLabel?: string | null };

// Public API projection only. Private contact/check-in data is loaded by authenticated flows.
const QUERY = `query GetProperty($propertyId: ID!) {
  getProperty(propertyId: $propertyId) {
    address {
      coordinates {
        latitude
        longitude
        __typename
      }
      district
      postalCode
      region
      street
      ward
      __typename
    }
    agent {
      firstName
      lastName
      __typename
    }
    agentId
    amenities
    availability {
      available
      availableFrom
      maximumLeaseTerm
      minimumLeaseTerm
      __typename
    }
    createdAt
    description
    groupId
    isPrimaryUnit
    landlord {
      firstName
      lastName
      __typename
    }
    media {
      floorPlan
      images
      videos
      virtualTour
      __typename
    }
    pricing {
      currency
      deposit
      monthlyRent
      serviceCharge
      utilitiesIncluded
      __typename
    }
    propertyId
    propertyType
    specifications {
      bathrooms
      kitchenCount
      kitchenAccess
      bedrooms
      floors
      furnished
      parkingSpaces
      squareMeters
      __typename
    }
    status
    title
    unitLabel
    updatedAt
    verified
    version
    __typename
  }
}
`;

/** Null means a confirmed missing/unpublished listing; upstream failures must remain errors. */
export const fetchLongTermPropertyForSEO = cache(async (propertyId: string): Promise<LongTermPropertySEO | null> => {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/graphql';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!endpoint || !apiKey) throw new Error('Public property API is not configured');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ query: QUERY, variables: { propertyId } }),
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Public property API returned ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) {
    // AppSync currently wraps NdotoniError.notFound as Lambda:Unhandled.
    // Recognize only the exact application response, never generic upstream errors.
    const missing = result.data?.getProperty === null && result.errors.every((error: {
      message?: string; errorType?: string; path?: string[]; extensions?: { code?: string };
    }) => error.path?.length === 1 && error.path[0] === 'getProperty' && (
      error.extensions?.code === 'NOT_FOUND' || error.errorType === 'NOT_FOUND' ||
      (error.errorType === 'Lambda:Unhandled' && error.message === 'The requested property could not be found.')
    ));
    if (missing) return null;
    throw new Error('Public property API could not load the listing');
  }
  if (!result.data || !Object.prototype.hasOwnProperty.call(result.data, 'getProperty')) {
    throw new Error('Public property API returned an invalid response');
  }
  const property: LongTermPropertySEO | null = result.data.getProperty;
  if (!property || property.status === 'DRAFT' || property.status === 'DELETED') return null;
  return property;
});
