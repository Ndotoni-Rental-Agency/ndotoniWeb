import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LOCATION_BASE_PATH,
  REGIONS,
  computeRentStats,
  fetchRegionProperties,
  formatTzs,
  pageUrl,
} from '@/lib/seo/locationPages';

export const revalidate = 3600;

const title = 'Nyumba za Kupanga Tanzania – Dar es Salaam, Arusha, Mwanza, Dodoma | Ndotoni';
const description =
  'Tafuta nyumba na vyumba vya kupanga katika mikoa yote ya Tanzania. Picha halisi, bei wazi, wasiliana na mwenye nyumba kwa WhatsApp. Find houses and apartments for rent across Tanzania.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl() },
  openGraph: { title, description, url: pageUrl(), type: 'website', siteName: 'Ndotoni', locale: 'sw_TZ' },
};

export default async function RentalsHubPage() {
  const regions = await Promise.all(
    REGIONS.map(async (region) => {
      const properties = await fetchRegionProperties(region.name);
      return { region, count: properties.length, stats: computeRentStats(properties) };
    }),
  );
  const visible = regions.filter((r) => r.count > 0).sort((a, b) => b.count - a.count);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Nyumbani', item: 'https://www.ndotoni.com/' },
      { '@type': 'ListItem', position: 2, name: 'Nyumba za Kupanga', item: pageUrl() },
    ],
  };

  return (
    <div className="bg-cream-100 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Nyumba za Kupanga Tanzania</h1>
        <p className="mt-4 max-w-3xl text-ink-700 leading-relaxed">
          Chagua mkoa kuona nyumba na vyumba vya kupanga vilivyotangazwa kwenye Ndotoni, pamoja na bei za kodi ya mwezi,
          maeneo maarufu na vidokezo vya kupanga kwa usalama. Unaweza kuwasiliana na mwenye nyumba moja kwa moja kupitia
          WhatsApp.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {visible.map(({ region, count, stats }) => (
            <li key={region.slug}>
              <Link
                href={`${LOCATION_BASE_PATH}/${region.slug}`}
                className="block h-full rounded-xl border border-ink-200 bg-white p-5 hover:border-brand-500"
              >
                <h2 className="text-lg font-semibold text-ink-900">Nyumba za kupanga {region.name}</h2>
                <p className="mt-1 text-sm text-ink-600">
                  Nyumba {count}
                  {stats.min ? ` · kuanzia ${formatTzs(stats.min)}/mwezi` : ''}
                </p>
                <p className="mt-2 text-sm text-ink-700 line-clamp-3">{region.introSw}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-ink-600">
          Unatafuta kukaa kwa siku chache? Tembelea{' '}
          <a href="https://www.ndotonistays.com" className="text-brand-600 hover:underline">
            Ndotoni Stays
          </a>
          . Una nyumba ya kupangisha?{' '}
          <Link href="/landlord" className="text-brand-600 hover:underline">
            Tangaza hapa
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
