import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationLanding from '@/components/seo/LocationLanding';
import {
  applyFilter,
  filtersWithListings,
  getListingFilter,
} from '@/lib/seo/listingFilters';
import {
  LOCATION_BASE_PATH,
  MIN_LISTINGS_TO_INDEX,
  computeRentStats,
  displayName,
  fetchRegionProperties,
  filterByDistrict,
  formatTzs,
  getRegionBySlug,
  pageUrl,
} from '@/lib/seo/locationPages';

/**
 * A bedroom / price-band page, either for a whole region
 *   /nyumba-za-kupanga/[region]/[filter]
 * or for one area inside it
 *   /nyumba-za-kupanga/[region]/[area]/[filter]
 */
export async function loadFilterPage(regionSlug: string, areaSlug: string | undefined, filterSlug: string) {
  const region = getRegionBySlug(regionSlug);
  const filter = getListingFilter(filterSlug);
  if (!region || !filter) return null;

  const all = await fetchRegionProperties(region.name);
  const scope = areaSlug ? filterByDistrict(all, areaSlug) : all;
  if (scope.length === 0) return null;

  const properties = applyFilter(scope, filter);
  if (properties.length === 0) return null;

  const areaName = areaSlug ? displayName(scope[0].district || areaSlug) : undefined;
  const place = areaName ? `${areaName}, ${region.name}` : region.name;
  const shortPlace = areaName ?? region.name;
  return { region, filter, scope, properties, areaName, place, shortPlace, areaSlug };
}

type Loaded = NonNullable<Awaited<ReturnType<typeof loadFilterPage>>>;

const urlFor = (d: Loaded) => pageUrl(d.region.slug, d.areaSlug, d.filter.slug);

export async function filterMetadata(
  regionSlug: string,
  areaSlug: string | undefined,
  filterSlug: string,
): Promise<Metadata> {
  const d = await loadFilterPage(regionSlug, areaSlug, filterSlug);
  if (!d) return { title: 'Ukurasa haujapatikana – Ndotoni', robots: { index: false } };

  const stats = computeRentStats(d.properties);
  const title = `${d.filter.heading(d.place)} | Ndotoni`;
  const description = `Nyumba ${d.properties.length} za kupanga ${d.filter.phrase} ${d.place}${
    stats.median ? `, bei ya kati ${formatTzs(stats.median)}/mwezi` : ''
  }. Picha halisi, wasiliana na mwenye nyumba kwa WhatsApp.`;
  const url = urlFor(d);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: d.properties.length >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: 'website', siteName: 'Ndotoni', locale: 'sw_TZ' },
  };
}

export default async function FilterLandingPage({
  regionSlug,
  areaSlug,
  filterSlug,
}: {
  regionSlug: string;
  areaSlug?: string;
  filterSlug: string;
}) {
  const d = await loadFilterPage(regionSlug, areaSlug, filterSlug);
  if (!d) notFound();

  const stats = computeRentStats(d.properties);
  const base = [LOCATION_BASE_PATH, d.region.slug, d.areaSlug].filter(Boolean).join('/');

  const intro =
    `Hizi ni nyumba ${d.properties.length} za kupanga ${d.filter.phrase} zilizotangazwa sasa ${d.place}` +
    (stats.median && stats.min && stats.max && stats.tzsCount >= 3
      ? `. Nyumba nyingi zina kodi ya mwezi kati ya ${formatTzs(stats.min)} na ${formatTzs(stats.max)}, na bei ya kati ni takriban ${formatTzs(stats.median)}.`
      : '.') +
    ` Unaweza kuona pia nyumba nyingine ${d.areaName ? `za ${d.areaName}` : `za ${d.region.name}`} kwa kutumia viungo vilivyo hapa chini.`;

  const siblings = filtersWithListings(d.scope, MIN_LISTINGS_TO_INDEX).filter((x) => x.filter.slug !== d.filter.slug);
  const sibling = (kind: 'bedrooms' | 'price') =>
    siblings
      .filter((x) => x.filter.kind === kind)
      .map((x) => ({ href: `${base}/${x.filter.slug}`, label: x.filter.label, count: x.count }));

  const breadcrumbs = [
    { name: 'Nyumbani', href: '/' },
    { name: 'Nyumba za Kupanga', href: LOCATION_BASE_PATH },
    { name: d.region.name, href: `${LOCATION_BASE_PATH}/${d.region.slug}` },
    ...(d.areaName ? [{ name: d.areaName, href: base }] : []),
    { name: d.filter.label, href: `${base}/${d.filter.slug}` },
  ];

  const searchParams = new URLSearchParams({ region: d.region.name });
  if (d.areaName) searchParams.set('district', d.areaName);
  if (d.filter.kind === 'bedrooms') {
    const n = parseInt(d.filter.slug.replace('vyumba-', ''), 10);
    if (!Number.isNaN(n)) searchParams.set('bedrooms', String(n));
  }

  return (
    <LocationLanding
      h1={d.filter.heading(d.shortPlace)}
      listingsHeading={d.filter.heading(d.shortPlace)}
      placeName={d.place}
      intro={intro}
      tips={d.region.tips}
      properties={d.properties}
      breadcrumbs={breadcrumbs}
      searchHref={`/search?${searchParams.toString()}`}
      extraSections={[
        { heading: 'Idadi ya vyumba', items: sibling('bedrooms') },
        { heading: 'Kodi ya mwezi', items: sibling('price') },
        {
          heading: d.areaName ? `Nyumba zote ${d.areaName}` : `Nyumba zote ${d.region.name}`,
          items: [{ href: base, label: d.areaName ? `Nyumba za kupanga ${d.areaName}` : `Nyumba za kupanga ${d.region.name}` }],
        },
      ]}
    />
  );
}
