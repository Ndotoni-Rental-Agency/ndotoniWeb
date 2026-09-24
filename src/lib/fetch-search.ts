/**
 * Server-side first page of /search results (raw fetch with the public API key, no Amplify).
 * Variables mirror the client's first request in usePropertiesByLocation so both agree.
 */

import type { PropertyCard } from '@/API';
import { getPropertiesByLocation } from '@/graphql/queries';
import { API_KEY, GRAPHQL_ENDPOINT } from '@/lib/fetch-property';

const FIRST_PAGE_SIZE = 12;

const num = (v: string | null) => (v ? Number(v) : undefined);

export async function fetchSearchFirstPage(
  params: URLSearchParams
): Promise<{ properties: PropertyCard[]; nextToken: string | null } | undefined> {
  const sort = params.get('sort');
  const sortBy = sort === 'price-low' ? 'PRICE_LOW_HIGH' : sort === 'price-high' ? 'PRICE_HIGH_LOW' : undefined;

  const variables = {
    region: params.get('region') || 'Dar es Salaam',
    district: params.get('district') || undefined,
    sortBy,
    minPrice: num(params.get('minPrice')),
    maxPrice: num(params.get('maxPrice')),
    bedrooms: num(params.get('bedrooms')),
    bathrooms: num(params.get('bathrooms')),
    propertyType: params.get('propertyType') || undefined,
    moveInDate: params.get('moveInDate') || undefined,
    limit: FIRST_PAGE_SIZE,
    nextToken: null,
  };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ query: getPropertiesByLocation, variables }),
      next: { revalidate: 60 },
    });
    const json = await response.json();
    const result = json?.data?.getPropertiesByLocation;
    if (!result) {
      console.error('[fetchSearchFirstPage] No data:', JSON.stringify(json?.errors ?? json).slice(0, 500));
      return undefined; // The client fetches and surfaces any error itself.
    }
    return { properties: result.properties ?? [], nextToken: result.nextToken ?? null };
  } catch (error) {
    console.error('[fetchSearchFirstPage] Error:', error);
    return undefined;
  }
}
