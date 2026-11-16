import type { PropertyCard } from '@/API';
import { MIN_PLAUSIBLE_RENT_TZS } from '@/lib/seo/locationPages';

/**
 * Bedroom-count and price-band filters used for landing pages such as
 *   /nyumba-za-kupanga/dar-es-salaam/vyumba-2
 *   /nyumba-za-kupanga/dar-es-salaam/sinza/bei-chini-ya-200000
 *
 * Bands are based on the real Dar es Salaam distribution (median ~TSh 1M, a quarter under 300k).
 */
export interface ListingFilter {
  slug: string;
  kind: 'bedrooms' | 'price';
  /** Short label for chips, e.g. "Vyumba 2" */
  label: string;
  /** Heading for a place, e.g. (Sinza) => "Nyumba za Kupanga Vyumba 2 Sinza" */
  heading: (place: string) => string;
  /** Short descriptive phrase used in running text, e.g. "zenye vyumba 2 vya kulala" */
  phrase: string;
  test: (p: PropertyCard) => boolean;
}

const tzs = (n: number) => `TSh ${n.toLocaleString('en-US')}`;
const rentOf = (p: PropertyCard) =>
  p.currency === 'TZS' && typeof p.monthlyRent === 'number' && p.monthlyRent >= MIN_PLAUSIBLE_RENT_TZS
    ? p.monthlyRent
    : null;

function bedrooms(n: number, orMore = false): ListingFilter {
  return {
    slug: orMore ? `vyumba-${n}-au-zaidi` : `vyumba-${n}`,
    kind: 'bedrooms',
    label: orMore ? `Vyumba ${n}+` : n === 1 ? 'Chumba 1' : `Vyumba ${n}`,
    heading: (place) =>
      `Nyumba za Kupanga ${orMore ? `Vyumba ${n} au Zaidi` : n === 1 ? 'Chumba 1 cha Kulala' : `Vyumba ${n}`} ${place}`,
    phrase: orMore
      ? `zenye vyumba ${n} au zaidi vya kulala`
      : n === 1
        ? 'zenye chumba 1 cha kulala'
        : `zenye vyumba ${n} vya kulala`,
    test: (p) => (orMore ? (p.bedrooms ?? 0) >= n : p.bedrooms === n),
  };
}

function priceBand(slug: string, min: number | null, max: number | null): ListingFilter {
  const label =
    min === null ? `Chini ya ${tzs(max!)}` : max === null ? `Zaidi ya ${tzs(min)}` : `${tzs(min)} – ${tzs(max)}`;
  return {
    slug,
    kind: 'price',
    label,
    heading: (place) => `Nyumba za Kupanga ${place} – Bei ${label}`,
    phrase: `zenye kodi ya mwezi ${min === null ? `chini ya ${tzs(max!)}` : max === null ? `zaidi ya ${tzs(min)}` : `kati ya ${tzs(min)} na ${tzs(max)}`}`,
    test: (p) => {
      const rent = rentOf(p);
      return rent !== null && (min === null || rent >= min) && (max === null || rent < max);
    },
  };
}

export const LISTING_FILTERS: ListingFilter[] = [
  bedrooms(1),
  bedrooms(2),
  bedrooms(3),
  bedrooms(4),
  bedrooms(5, true),
  priceBand('bei-chini-ya-200000', null, 200000),
  priceBand('bei-200000-hadi-500000', 200000, 500000),
  priceBand('bei-500000-hadi-1000000', 500000, 1000000),
  priceBand('bei-1000000-hadi-2500000', 1000000, 2500000),
  priceBand('bei-zaidi-ya-2500000', 2500000, null),
];

export const getListingFilter = (slug: string) => LISTING_FILTERS.find((f) => f.slug === slug);

export function applyFilter(properties: PropertyCard[], filter: ListingFilter): PropertyCard[] {
  return properties.filter(filter.test);
}

/** Filters that match at least `min` of the given listings. */
export function filtersWithListings(properties: PropertyCard[], min: number) {
  return LISTING_FILTERS.map((filter) => ({ filter, count: applyFilter(properties, filter).length })).filter(
    (x) => x.count >= min,
  );
}
