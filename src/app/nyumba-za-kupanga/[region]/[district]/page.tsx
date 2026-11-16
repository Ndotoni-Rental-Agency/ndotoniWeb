import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilterLandingPage, { filterMetadata } from '@/components/seo/FilterLanding';
import LocationLanding from '@/components/seo/LocationLanding';
import { getAreaCopy } from '@/lib/seo/areaCopy';
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
 * /nyumba-za-kupanga/[region]/[district]
 * The segment is normally an area (stored as `district` on listings), but a bedroom / price-band
 * slug such as "vyumba-2" is a region-wide filter page and is routed to the filter renderer.
 */
interface Props {
  params: { region: string; district: string };
}

export const revalidate = 3600;
// Areas are discovered from live data, so render unknown ones on demand.
export const dynamicParams = true;

const MAX_SIBLING_CHIPS = 24;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (getListingFilter(params.district)) return filterMetadata(params.region, undefined, params.district);

  const region = getRegionBySlug(params.region);
  const data = region ? await loadScope(params.region, params.district) : null;
  if (!region || !data) return { title: 'Ukurasa haujapatikana – Ndotoni', robots: { index: false } };

  const place = `${data.areaName}, ${region.name}`;
  const { stats, count } = data;
  const title = `Nyumba za Kupanga ${place}${stats.min ? ` – Bei kuanzia ${formatTzs(stats.min)}` : ''} | Ndotoni`;
  const description = `Nyumba ${count} za kupanga ${place}${stats.median ? `, bei ya kati ${formatTzs(stats.median)}/mwezi` : ''}. Picha halisi, wasiliana na mwenye nyumba kwa WhatsApp. Houses for rent in ${place}.`;
  const url = pageUrl(region.slug, params.district);

  return {
    title,
    description,
    alternates: { canonical: url },
    // Thin pages stay reachable for users but are kept out of the index.
    robots: count >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: 'website', siteName: 'Ndotoni', locale: 'sw_TZ' },
  };
}

export default async function DistrictPage({ params }: Props) {
  if (getListingFilter(params.district)) {
    return <FilterLandingPage regionSlug={params.region} filterSlug={params.district} />;
  }

  const region = getRegionBySlug(params.region);
  if (!region) notFound();
  const data = await loadScope(region.slug, params.district);
  if (!data || !data.areaName) notFound();

  const districtName = data.areaName;
  const place = `${districtName}, ${region.name}`;
  const { stats } = data;
  const copy = getAreaCopy(region.slug, params.district);

  const dataSentence =
    stats.median && stats.min && stats.max && stats.tzsCount >= 3
      ? `Kwa nyumba ${data.count} zilizotangazwa sasa ${place}, nyumba nyingi zina kodi ya mwezi kati ya ${formatTzs(stats.min)} na ${formatTzs(stats.max)}, na bei ya kati ni takriban ${formatTzs(stats.median)}.`
      : `Hizi ni nyumba za kupanga zilizotangazwa sasa ${place}.`;

  const intro = copy
    ? `${copy.intro} ${dataSentence}`
    : `${dataSentence} Kabla ya kuamua, tembelea nyumba, uliza kuhusu maji, umeme na usalama, na linganisha na maeneo jirani ya ${region.name}.`;

  const base = `${LOCATION_BASE_PATH}/${region.slug}/${params.district}`;
  const siblings = data.regionAreas.filter((a) => a.slug !== params.district).slice(0, MAX_SIBLING_CHIPS);

  return (
    <LocationLanding
      h1={`Nyumba za Kupanga ${districtName}, ${region.name}`}
      placeName={place}
      intro={intro}
      tips={[...(copy?.tips ?? []), ...region.tips]}
      cards={data.cards}
      total={data.count}
      verifiedCount={data.verifiedCount}
      stats={data.stats}
      areas={siblings}
      areasHeading={`Maeneo mengine ya ${region.name}`}
      areaHref={(slug) => `${LOCATION_BASE_PATH}/${region.slug}/${slug}`}
      extraSections={[
        { heading: `Nyumba za ${districtName} kwa idadi ya vyumba`, items: filterChips(base, data.filterCounts, 'bedrooms') },
        { heading: `Nyumba za ${districtName} kwa kodi ya mwezi`, items: filterChips(base, data.filterCounts, 'price') },
      ]}
      breadcrumbs={[
        { name: 'Nyumbani', href: '/' },
        { name: 'Nyumba za Kupanga', href: LOCATION_BASE_PATH },
        { name: region.name, href: `${LOCATION_BASE_PATH}/${region.slug}` },
        { name: districtName, href: base },
      ]}
      searchHref={`/search?region=${encodeURIComponent(region.name)}&district=${encodeURIComponent(districtName)}`}
    />
  );
}
