/**
 * Server-side first page of search results, so /search ships listings in its HTML
 * instead of a spinner. Uses raw fetch with the public API key (no Amplify on the server).
 */

import type { PropertyCard } from '@/API';
import { getPropertiesByLocation } from '@/graphql/queries';
import { API_KEY, GRAPHQL_ENDPOINT } from '@/lib/fetch-property';
import { DEFAULT_REGION, queryMinPrice, sortByFromFilters, type PropertyFilters } from '@/lib/search/params';

export const SEARCH_FIRST_PAGE_SIZE = 12;

export async function fetchSearchFirstPage(
  filters: PropertyFilters
): Promise<{ properties: PropertyCard[]; nextToken: string | null } | undefined> {
  const variables = {
    region: filters.region || DEFAULT_REGION,
    district: filters.district,
    sortBy: sortByFromFilters(filters),
    minPrice: queryMinPrice(filters),
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    propertyType: filters.propertyType,
    moveInDate: filters.moveInDate,
    limit: SEARCH_FIRST_PAGE_SIZE,
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
      return undefined; // Let the client fetch and surface any error itself.
    }
    return { properties: result.properties ?? [], nextToken: result.nextToken ?? null };
  } catch (error) {
    console.error('[fetchSearchFirstPage] Error:', error);
    return undefined;
  }
}
