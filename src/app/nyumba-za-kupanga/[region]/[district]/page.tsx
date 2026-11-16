import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationLanding from '@/components/seo/LocationLanding';
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
  summariseDistricts,
} from '@/lib/seo/locationPages';

interface Props {
  params: { region: string; district: string };
}

export const revalidate = 3600;
// Districts are discovered from live data, so render unknown ones on demand.
export const dynamicParams = true;

async function load(params: Props['params']) {
  const region = getRegionBySlug(params.region);
  if (!region) return null;
  const all = await fetchRegionProperties(region.name);
  const properties = filterByDistrict(all, params.district);
  if (properties.length === 0) return null;
  const districtName = displayName(properties[0].district || params.district);
  const siblings = summariseDistricts(all).filter(
    (d) => d.slug !== params.district && d.count >= MIN_LISTINGS_TO_INDEX,
  );
  return { region, properties, districtName, siblings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return { title: 'Ukurasa haujapatikana – Ndotoni', robots: { index: false } };

  const { region, properties, districtName } = data;
  const place = `${districtName}, ${region.name}`;
  const stats = computeRentStats(properties);
  const title = `Nyumba za Kupanga ${place}${stats.min ? ` – Bei kuanzia ${formatTzs(stats.min)}` : ''} | Ndotoni`;
  const description = `Nyumba ${properties.length} za kupanga ${place}${stats.median ? `, bei ya kati ${formatTzs(stats.median)}/mwezi` : ''}. Picha halisi, wasiliana na mwenye nyumba kwa WhatsApp. Houses for rent in ${place}.`;
  const url = pageUrl(region.slug, params.district);

  return {
    title,
    description,
    alternates: { canonical: url },
    // Thin pages stay reachable for users but are kept out of the index.
    robots: properties.length >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: 'website', siteName: 'Ndotoni', locale: 'sw_TZ' },
  };
}

export default async function DistrictPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();

  const { region, properties, districtName, siblings } = data;
  const place = `${districtName}, ${region.name}`;
  const stats = computeRentStats(properties);

  const intro =
    `Hizi ni nyumba za kupanga zilizotangazwa sasa ${place}` +
    (stats.median
      ? `. Kodi ya mwezi ya kati ni takriban ${formatTzs(stats.median)}, ikianzia ${formatTzs(stats.min!)} hadi ${formatTzs(stats.max!)}.`
      : '.') +
    ` Kabla ya kuamua, tembelea nyumba, uliza kuhusu maji, umeme na usalama, na linganisha na maeneo jirani ya ${region.name}.`;

  return (
    <LocationLanding
      h1={`Nyumba za Kupanga ${districtName}, ${region.name}`}
      placeName={place}
      intro={intro}
      tips={region.tips}
      properties={properties}
      areas={siblings}
      areasHeading={`Maeneo mengine ya ${region.name}`}
      areaHref={(slug) => `${LOCATION_BASE_PATH}/${region.slug}/${slug}`}
      breadcrumbs={[
        { name: 'Nyumbani', href: '/' },
        { name: 'Nyumba za Kupanga', href: LOCATION_BASE_PATH },
        { name: region.name, href: `${LOCATION_BASE_PATH}/${region.slug}` },
        { name: districtName, href: `${LOCATION_BASE_PATH}/${region.slug}/${params.district}` },
      ]}
      searchHref={`/search?region=${encodeURIComponent(region.name)}&district=${encodeURIComponent(districtName)}`}
    />
  );
}
