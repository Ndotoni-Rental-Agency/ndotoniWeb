import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationLanding from '@/components/seo/LocationLanding';
import { filterChips, getListingFilter } from '@/lib/seo/listingFilters';
import { loadScope } from '@/lib/seo/locationData';
import {
  LOCATION_BASE_PATH,
  MIN_LISTINGS_TO_INDEX,
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

  const data = await loadScope(regionSlug, areaSlug, filterSlug);
  if (!data) return null;

  const areaName = areaSlug ? data.areaName : undefined;
  const place = areaName ? `${areaName}, ${region.name}` : region.name;
  const shortPlace = areaName ?? region.name;
  return { region, filter, data, areaName, place, shortPlace, areaSlug };
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

  const stats = d.data.stats;
  const title = `${d.filter.heading(d.place)} | Ndotoni`;
  const description = `Nyumba ${d.data.count} za kupanga ${d.filter.phrase} ${d.place}${
    stats.median ? `, bei ya kati ${formatTzs(stats.median)}/mwezi` : ''
  }. Picha halisi, wasiliana na mwenye nyumba kwa WhatsApp.`;
  const url = urlFor(d);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: d.data.count >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false, follow: true },
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

  const stats = d.data.stats;
  const base = [LOCATION_BASE_PATH, d.region.slug, d.areaSlug].filter(Boolean).join('/');

  const intro =
    `Hizi ni nyumba ${d.data.count} za kupanga ${d.filter.phrase} zilizotangazwa sasa ${d.place}` +
    (stats.median && stats.min && stats.max && stats.tzsCount >= 3
      ? `. Nyumba nyingi zina kodi ya mwezi kati ya ${formatTzs(stats.min)} na ${formatTzs(stats.max)}, na bei ya kati ni takriban ${formatTzs(stats.median)}.`
      : '.') +
    ` Unaweza kuona pia nyumba nyingine ${d.areaName ? `za ${d.areaName}` : `za ${d.region.name}`} kwa kutumia viungo vilivyo hapa chini.`;

  const counts = { ...d.data.filterCounts };
  delete counts[d.filter.slug];

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
      cards={d.data.cards}
      total={d.data.count}
      verifiedCount={d.data.verifiedCount}
      stats={d.data.stats}
      breadcrumbs={breadcrumbs}
      searchHref={`/search?${searchParams.toString()}`}
      extraSections={[
        { heading: 'Idadi ya vyumba', items: filterChips(base, counts, 'bedrooms') },
        { heading: 'Kodi ya mwezi', items: filterChips(base, counts, 'price') },
        {
          heading: d.areaName ? `Nyumba zote ${d.areaName}` : `Nyumba zote ${d.region.name}`,
          items: [{ href: base, label: d.areaName ? `Nyumba za kupanga ${d.areaName}` : `Nyumba za kupanga ${d.region.name}` }],
        },
      ]}
    />
  );
}
