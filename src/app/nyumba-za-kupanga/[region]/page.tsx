import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationLanding from '@/components/seo/LocationLanding';
import { filterChips } from '@/lib/seo/listingFilters';
import { loadScope } from '@/lib/seo/locationData';
import {
  LOCATION_BASE_PATH,
  MIN_LISTINGS_TO_INDEX,
  formatTzs,
  getRegionBySlug,
  pageUrl,
} from '@/lib/seo/locationPages';

interface Props {
  params: { region: string };
}

export const revalidate = 3600;

// Not pre-rendered: pages render on first request and are then cached for an hour. Data comes from
// the precomputed summary (fast); if that is unavailable it falls back to a slow live crawl.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = getRegionBySlug(params.region);
  const data = region ? await loadScope(params.region) : null;
  if (!region || !data) return { title: 'Ukurasa haujapatikana – Ndotoni', robots: { index: false } };

  const { stats, count } = data;
  const priceBit = stats.min ? ` Bei kuanzia ${formatTzs(stats.min)}/mwezi.` : '';
  const title = `Nyumba za Kupanga ${region.name} (Houses for Rent)${stats.min ? ` – Bei kuanzia ${formatTzs(stats.min)}` : ''} | Ndotoni`;
  const description = `Nyumba ${count} za kupanga ${region.name} zenye picha halisi.${priceBit} Wasiliana na mwenye nyumba moja kwa moja kupitia WhatsApp. Houses and apartments for rent in ${region.name}, Tanzania.`;
  const url = pageUrl(region.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: count >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: 'website', siteName: 'Ndotoni', locale: 'sw_TZ' },
  };
}

export default async function RegionPage({ params }: Props) {
  const region = getRegionBySlug(params.region);
  if (!region) notFound();
  const data = await loadScope(region.slug);
  if (!data) notFound();

  const base = `${LOCATION_BASE_PATH}/${region.slug}`;

  return (
    <LocationLanding
      h1={`Nyumba za Kupanga ${region.name}`}
      placeName={region.name}
      intro={region.introSw}
      tips={region.tips}
      cards={data.cards}
      total={data.count}
      verifiedCount={data.verifiedCount}
      stats={data.stats}
      areas={data.regionAreas.slice(0, 30)}
      areasHeading={`Maeneo ya ${region.name}`}
      areaHref={(slug) => `${base}/${slug}`}
      extraSections={[
        { heading: `Nyumba za ${region.name} kwa idadi ya vyumba`, items: filterChips(base, data.filterCounts, 'bedrooms') },
        { heading: `Nyumba za ${region.name} kwa kodi ya mwezi`, items: filterChips(base, data.filterCounts, 'price') },
      ]}
      breadcrumbs={[
        { name: 'Nyumbani', href: '/' },
        { name: 'Nyumba za Kupanga', href: LOCATION_BASE_PATH },
        { name: region.name, href: base },
      ]}
      searchHref={`/search?region=${encodeURIComponent(region.name)}`}
    />
  );
}
