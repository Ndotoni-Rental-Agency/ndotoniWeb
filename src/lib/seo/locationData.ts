import type { PropertyCard } from '@/API';
import { applyFilter, filtersWithListings, getListingFilter } from '@/lib/seo/listingFilters';
import {
  MIN_LISTINGS_TO_INDEX,
  REGIONS,
  computeRentStats,
  displayName,
  fetchRegionProperties,
  filterByDistrict,
  getRegionBySlug,
  sortForDisplay,
  summariseDistricts,
  type DistrictSummary,
  type RentStats,
} from '@/lib/seo/locationPages';

/**
 * Single data seam for the location landing pages.
 *
 * Preferred source: the precomputed summary published by the backend (a small JSON index plus one
 * card file per region, refreshed daily – see ndotoniBackend LocationSummaryService). Pages render
 * from it in milliseconds.
 *
 * Fallback: if the summary is missing, stale-invalid or unreadable, the same numbers are computed
 * from a live crawl of the region (slow for Dar es Salaam, ~4,300 listings, but always correct).
 * Both sources return the identical `ScopeData` shape.
 */

const SCHEMA_VERSION = 1;
const CARDS_PER_PAGE = 24;

export interface ScopeData {
  source: 'summary' | 'live';
  /** Total listings in this scope. */
  count: number;
  verifiedCount: number;
  stats: RentStats;
  /** Cards to display, already in display order. */
  cards: PropertyCard[];
  /** Display name of the area when the scope is an area. */
  areaName?: string;
  /** Filter slug -> listings in this scope, for filters with enough listings to be indexable. */
  filterCounts: Record<string, number>;
  /** Every indexable area in the region, largest first. */
  regionAreas: DistrictSummary[];
}

/* -------------------------------------------------------------------------- */
/* Summary files                                                              */
/* -------------------------------------------------------------------------- */

interface SummaryStats {
  tzsCount: number;
  p10: number | null;
  median: number | null;
  p90: number | null;
}
interface SummaryFilter {
  count: number;
  verifiedCount: number;
  stats: SummaryStats;
}
interface SummaryArea {
  name: string;
  count: number;
  verifiedCount: number;
  stats: SummaryStats;
  filters: Record<string, SummaryFilter>;
}
interface SummaryRegion extends SummaryArea {
  areas: Record<string, SummaryArea>;
}
interface SummaryIndex {
  schemaVersion: number;
  generatedAt: string;
  minListingsToIndex: number;
  regions: Record<string, SummaryRegion>;
}
interface RegionFile {
  schemaVersion: number;
  cards: Record<string, PropertyCard>;
  scopes: Record<string, string[]>;
}

/** CloudFront folder for the summary, derived from the homepage cache URL (same distribution/stage). */
function summaryBaseUrl(): string | null {
  const explicit = process.env.LOCATION_SUMMARY_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const homepage =
    process.env.NEXT_PUBLIC_HOMEPAGE_CACHE_URL ||
    'https://d3qiuw9agheakm.cloudfront.net/homepage/beta/long-term-properties.json';
  const match = homepage.match(/^(https?:\/\/[^/]+)\/homepage\/([^/]+)\//);
  return match ? `${match[1]}/location-summary/${match[2]}` : null;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getIndex(): Promise<SummaryIndex | null> {
  const base = summaryBaseUrl();
  if (!base) return null;
  const index = await fetchJson<SummaryIndex>(`${base}/location-summary.json`);
  return index && index.schemaVersion === SCHEMA_VERSION && index.regions ? index : null;
}

async function getRegionFile(regionSlug: string): Promise<RegionFile | null> {
  const base = summaryBaseUrl();
  if (!base) return null;
  const file = await fetchJson<RegionFile>(`${base}/regions/${regionSlug}.json`);
  return file && file.schemaVersion === SCHEMA_VERSION && file.scopes ? file : null;
}

const toStats = (count: number, s: SummaryStats): RentStats => ({
  count,
  tzsCount: s.tzsCount,
  min: s.p10,
  median: s.median,
  max: s.p90,
});

const areaList = (region: SummaryRegion): DistrictSummary[] =>
  Object.entries(region.areas)
    .map(([slug, a]) => ({ slug, name: a.name, count: a.count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

async function fromSummary(regionSlug: string, areaSlug?: string, filterSlug?: string): Promise<ScopeData | null | undefined> {
  // undefined = summary unavailable (caller falls back); null = summary says the scope does not exist.
  const index = await getIndex();
  if (!index) return undefined;
  const region = index.regions[regionSlug];
  if (!region) return null;

  const area = areaSlug ? region.areas[areaSlug] : undefined;
  if (areaSlug && !area) return null;
  const node: SummaryArea = area ?? region;
  if (filterSlug && !(filterSlug in node.filters)) return null;

  const file = await getRegionFile(regionSlug);
  if (!file) return undefined;
  const key = areaSlug
    ? filterSlug
      ? `a:${areaSlug}:f:${filterSlug}`
      : `a:${areaSlug}`
    : filterSlug
      ? `f:${filterSlug}`
      : 'r';
  const ids = file.scopes[key];
  if (!ids) return undefined;

  const cards = ids.map((id) => file.cards[id]).filter(Boolean);
  const scopeSummary: { count: number; verifiedCount: number; stats: SummaryStats } = filterSlug
    ? node.filters[filterSlug]
    : node;

  return {
    source: 'summary',
    count: scopeSummary.count,
    verifiedCount: scopeSummary.verifiedCount,
    stats: toStats(scopeSummary.count, scopeSummary.stats),
    cards,
    areaName: area?.name,
    filterCounts: Object.fromEntries(Object.entries(node.filters).map(([slug, f]) => [slug, f.count])),
    regionAreas: areaList(region),
  };
}

/* -------------------------------------------------------------------------- */
/* Live fallback                                                              */
/* -------------------------------------------------------------------------- */

async function fromLive(regionSlug: string, areaSlug?: string, filterSlug?: string): Promise<ScopeData | null> {
  const region = getRegionBySlug(regionSlug);
  if (!region) return null;
  const all = await fetchRegionProperties(region.name);
  const inArea = areaSlug ? filterByDistrict(all, areaSlug) : all;
  if (inArea.length === 0) return null;

  const filter = filterSlug ? getListingFilter(filterSlug) : undefined;
  if (filterSlug && !filter) return null;
  const scope = filter ? applyFilter(inArea, filter) : inArea;
  if (scope.length === 0) return null;

  const filterCounts: Record<string, number> = {};
  for (const { filter: f, count } of filtersWithListings(inArea, MIN_LISTINGS_TO_INDEX)) filterCounts[f.slug] = count;

  return {
    source: 'live',
    count: scope.length,
    verifiedCount: scope.filter((p) => p.verified).length,
    stats: computeRentStats(scope),
    cards: sortForDisplay(scope).slice(0, CARDS_PER_PAGE),
    areaName: areaSlug ? displayName(inArea[0].district || areaSlug) : undefined,
    filterCounts,
    regionAreas: summariseDistricts(all).filter((d) => d.count >= MIN_LISTINGS_TO_INDEX),
  };
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/** Data for a region, area, or either of those narrowed by a bedroom / price filter. */
export async function loadScope(regionSlug: string, areaSlug?: string, filterSlug?: string): Promise<ScopeData | null> {
  if (!getRegionBySlug(regionSlug)) return null;
  if (filterSlug && !getListingFilter(filterSlug)) return null;
  const summarised = await fromSummary(regionSlug, areaSlug, filterSlug);
  if (summarised !== undefined) return summarised;
  return fromLive(regionSlug, areaSlug, filterSlug);
}

export interface RegionOverview {
  slug: string;
  name: string;
  count: number;
  stats: RentStats;
}

/** One row per known region that has listings (hub page). */
export async function loadRegionOverviews(): Promise<RegionOverview[]> {
  const index = await getIndex();
  if (index) {
    return REGIONS.flatMap((r) => {
      const s = index.regions[r.slug];
      return s ? [{ slug: r.slug, name: r.name, count: s.count, stats: toStats(s.count, s.stats) }] : [];
    });
  }
  const rows = await Promise.all(
    REGIONS.map(async (r) => {
      const props = await fetchRegionProperties(r.name);
      return { slug: r.slug, name: r.name, count: props.length, stats: computeRentStats(props) };
    }),
  );
  return rows.filter((r) => r.count > 0);
}

export interface SitemapScope {
  regionSlug: string;
  areaSlug?: string;
  filterSlug?: string;
}

/** Every indexable location URL, without loading any card data when the summary is available. */
export async function loadSitemapScopes(): Promise<SitemapScope[]> {
  const out: SitemapScope[] = [];
  const index = await getIndex();

  if (index) {
    for (const r of REGIONS) {
      const region = index.regions[r.slug];
      if (!region || region.count < MIN_LISTINGS_TO_INDEX) continue;
      out.push({ regionSlug: r.slug });
      for (const f of Object.keys(region.filters)) out.push({ regionSlug: r.slug, filterSlug: f });
      for (const [areaSlug, area] of Object.entries(region.areas)) {
        out.push({ regionSlug: r.slug, areaSlug });
        for (const f of Object.keys(area.filters)) out.push({ regionSlug: r.slug, areaSlug, filterSlug: f });
      }
    }
    return out;
  }

  for (const r of REGIONS) {
    const props = await fetchRegionProperties(r.name);
    if (props.length < MIN_LISTINGS_TO_INDEX) continue;
    out.push({ regionSlug: r.slug });
    for (const { filter } of filtersWithListings(props, MIN_LISTINGS_TO_INDEX)) {
      out.push({ regionSlug: r.slug, filterSlug: filter.slug });
    }
    for (const d of summariseDistricts(props)) {
      if (d.count < MIN_LISTINGS_TO_INDEX) continue;
      out.push({ regionSlug: r.slug, areaSlug: d.slug });
      for (const { filter } of filtersWithListings(filterByDistrict(props, d.slug), MIN_LISTINGS_TO_INDEX)) {
        out.push({ regionSlug: r.slug, areaSlug: d.slug, filterSlug: filter.slug });
      }
    }
  }
  return out;
}
