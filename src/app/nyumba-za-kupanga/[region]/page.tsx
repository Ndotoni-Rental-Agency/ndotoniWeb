import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationLanding from '@/components/seo/LocationLanding';
import { filtersWithListings } from '@/lib/seo/listingFilters';
import {
  LOCATION_BASE_PATH,
  MIN_LISTINGS_TO_INDEX,
  REGIONS,
  computeRentStats,
  fetchRegionProperties,
  formatTzs,
  getRegionBySlug,
  pageUrl,
  summariseDistricts,
} from '@/lib/seo/locationPages';

interface Props {
  params: { region: string };
}

export const revalidate = 3600;

// Not pre-rendered: a full crawl of a large region (Dar es Salaam has ~4,300 listings) is slow, so
// pages render on first request and are then cached for an hour.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = getRegionBySlug(params.region);
  if (!region) return { title: 'Ukurasa haujapatikana – Ndotoni', robots: { index: false } };

  const properties = await fetchRegionProperties(region.name);
  const stats = computeRentStats(properties);
  const priceBit = stats.min ? ` Bei kuanzia ${formatTzs(stats.min)}/mwezi.` : '';
  const title = `Nyumba za Kupanga ${region.name} (Houses for Rent)${stats.min ? ` – Bei kuanzia ${formatTzs(stats.min)}` : ''} | Ndotoni`;
  const description = `Nyumba ${properties.length} za kupanga ${region.name} zenye picha halisi.${priceBit} Wasiliana na mwenye nyumba moja kwa moja kupitia WhatsApp. Houses and apartments for rent in ${region.name}, Tanzania.`;
  const url = pageUrl(region.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: properties.length >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: 'website', siteName: 'Ndotoni', locale: 'sw_TZ' },
  };
}

export default async function RegionPage({ params }: Props) {
  const region = getRegionBySlug(params.region);
  if (!region) notFound();

  const properties = await fetchRegionProperties(region.name);
  const districts = summariseDistricts(properties)
    .filter((d) => d.count >= MIN_LISTINGS_TO_INDEX)
    .slice(0, 30);
  const base = `${LOCATION_BASE_PATH}/${region.slug}`;
  const filterLinks = (kind: 'bedrooms' | 'price') =>
    filtersWithListings(properties, MIN_LISTINGS_TO_INDEX)
      .filter((x) => x.filter.kind === kind)
      .map((x) => ({ href: `${base}/${x.filter.slug}`, label: x.filter.label, count: x.count }));

  return (
    <LocationLanding
      h1={`Nyumba za Kupanga ${region.name}`}
      placeName={region.name}
      intro={region.introSw}
      tips={region.tips}
      properties={properties}
      areas={districts}
      areasHeading={`Maeneo ya ${region.name}`}
      areaHref={(slug) => `${LOCATION_BASE_PATH}/${region.slug}/${slug}`}
      extraSections={[
        { heading: `Nyumba za ${region.name} kwa idadi ya vyumba`, items: filterLinks('bedrooms') },
        { heading: `Nyumba za ${region.name} kwa kodi ya mwezi`, items: filterLinks('price') },
      ]}
      breadcrumbs={[
        { name: 'Nyumbani', href: '/' },
        { name: 'Nyumba za Kupanga', href: LOCATION_BASE_PATH },
        { name: region.name, href: `${LOCATION_BASE_PATH}/${region.slug}` },
      ]}
      searchHref={`/search?region=${encodeURIComponent(region.name)}`}
    />
  );
}
