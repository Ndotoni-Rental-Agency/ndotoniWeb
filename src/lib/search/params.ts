/** Search filters <-> URL query string. The URL is the single source of truth for filters. */

export interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  priceSort?: 'asc' | 'desc';
}

export const DEFAULT_REGION = 'DAR ES SALAAM';

const numberParam = (value: string | null) => (value ? Number(value) : undefined);

export function filtersFromParams(params: URLSearchParams): PropertyFilters {
  const sort = params.get('sort');
  return {
    region: params.get('region') || DEFAULT_REGION,
    district: params.get('district') || undefined,
    propertyType: params.get('propertyType') || undefined,
    minPrice: numberParam(params.get('minPrice')),
    maxPrice: numberParam(params.get('maxPrice')),
    bedrooms: numberParam(params.get('bedrooms')),
    bathrooms: numberParam(params.get('bathrooms')),
    moveInDate: params.get('moveInDate') || undefined,
    priceSort: sort === 'price-low' ? 'asc' : sort === 'price-high' ? 'desc' : undefined,
  };
}

export function paramsFromFilters(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  if (filters.region) params.set('region', filters.region);
  if (filters.district) params.set('district', filters.district);
  if (filters.propertyType) params.set('propertyType', filters.propertyType);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.bedrooms) params.set('bedrooms', String(filters.bedrooms));
  if (filters.bathrooms) params.set('bathrooms', String(filters.bathrooms));
  if (filters.moveInDate) params.set('moveInDate', filters.moveInDate);
  if (filters.priceSort) params.set('sort', filters.priceSort === 'asc' ? 'price-low' : 'price-high');
  return params.toString();
}


/**
 * Location results are indexed by rent, so the backend can only sort by price (NEWEST_FIRST is not
 * honored, and no sort returns a shuffle of the most expensive listings). Lowest rent first is the
 * default because it matches what most renters are looking for.
 */
export function sortByFromFilters(filters: PropertyFilters): 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' {
  return filters.priceSort === 'desc' ? 'PRICE_HIGH_LOW' : 'PRICE_LOW_HIGH';
}

/** Listings with a rent of 0 are incomplete data; keep them out of results unless a minimum is set. */
export function queryMinPrice(filters: PropertyFilters): number {
  return filters.minPrice ?? 1;
}
