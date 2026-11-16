import { describe, expect, it } from 'vitest';
import type { PropertyCard } from '@/API';
import { LISTING_FILTERS } from '@/lib/seo/listingFilters';
import { computeRentStats } from '@/lib/seo/locationPages';

/**
 * PARITY TABLES – identical to the ones in ndotoniBackend
 * `packages/lambda/src/__tests__/location-summary.test.ts`, which assert the backend's
 * implementation. The website falls back to computing these numbers itself when the precomputed
 * summary is unavailable, so both sides must give the same answers. Change them together.
 */
const BAND_BOUNDARIES: [number | null, string, string | null][] = [
  [null, 'TZS', null],
  [19999, 'TZS', null],
  [20000, 'TZS', 'bei-chini-ya-200000'],
  [199999, 'TZS', 'bei-chini-ya-200000'],
  [200000, 'TZS', 'bei-200000-hadi-500000'],
  [499999, 'TZS', 'bei-200000-hadi-500000'],
  [500000, 'TZS', 'bei-500000-hadi-1000000'],
  [999999, 'TZS', 'bei-500000-hadi-1000000'],
  [1000000, 'TZS', 'bei-1000000-hadi-2500000'],
  [2499999, 'TZS', 'bei-1000000-hadi-2500000'],
  [2500000, 'TZS', 'bei-zaidi-ya-2500000'],
  [9000000, 'TZS', 'bei-zaidi-ya-2500000'],
  [1000000, 'USD', null],
];

const BEDROOM_BOUNDARIES: [number | undefined, string | null][] = [
  [undefined, null],
  [0, null],
  [1, 'vyumba-1'],
  [2, 'vyumba-2'],
  [3, 'vyumba-3'],
  [4, 'vyumba-4'],
  [5, 'vyumba-5-au-zaidi'],
  [12, 'vyumba-5-au-zaidi'],
];

const PERCENTILE_CASES: [number[], [number, number, number]][] = [
  [[100000], [100000, 100000, 100000]],
  [[100000, 300000], [100000, 200000, 300000]],
  [[100000, 200000, 300000], [100000, 200000, 300000]],
  [Array.from({ length: 10 }, (_, i) => (i + 1) * 100000), [200000, 550000, 1000000]],
  [Array.from({ length: 11 }, (_, i) => (i + 1) * 100000), [200000, 600000, 1000000]],
  [[200000, 200000, 200000, 200000, 200000], [200000, 200000, 200000]],
];

let seq = 0;
const card = (over: Partial<PropertyCard>): PropertyCard =>
  ({
    propertyId: `p${seq++}`,
    title: 't',
    monthlyRent: 500000,
    currency: 'TZS',
    propertyType: 'HOUSE',
    bedrooms: 2,
    district: 'Sinza',
    region: 'dar-es-salaam',
    ...over,
  }) as PropertyCard;

const matching = (prefix: string, c: PropertyCard) =>
  LISTING_FILTERS.filter((f) => f.slug.startsWith(prefix) && f.test(c)).map((f) => f.slug);

describe('website/backend parity', () => {
  it.each(BAND_BOUNDARIES)('price band: rent %s %s -> %s', (rent, currency, expected) => {
    const c = card({ monthlyRent: rent as number, currency });
    expect(matching('bei-', c)).toEqual(expected ? [expected] : []);
  });

  it.each(BEDROOM_BOUNDARIES)('bedrooms: %s -> %s', (bedrooms, expected) => {
    expect(matching('vyumba-', card({ bedrooms }))).toEqual(expected ? [expected] : []);
  });

  it.each(PERCENTILE_CASES)('percentiles: %j', (rents, [p10, median, p90]) => {
    const stats = computeRentStats([...rents].reverse().map((monthlyRent) => card({ monthlyRent })));
    expect([stats.tzsCount, stats.min, stats.median, stats.max]).toEqual([rents.length, p10, median, p90]);
  });

  it('has the same filter slugs as the backend', () => {
    expect(LISTING_FILTERS.map((f) => f.slug)).toEqual([
      'vyumba-1',
      'vyumba-2',
      'vyumba-3',
      'vyumba-4',
      'vyumba-5-au-zaidi',
      'bei-chini-ya-200000',
      'bei-200000-hadi-500000',
      'bei-500000-hadi-1000000',
      'bei-1000000-hadi-2500000',
      'bei-zaidi-ya-2500000',
    ]);
  });
});
