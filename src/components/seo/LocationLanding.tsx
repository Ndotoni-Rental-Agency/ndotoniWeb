import Link from 'next/link';
import type { PropertyCard } from '@/API';
import SearchPropertyGrid from '@/components/property/SearchPropertyGrid';
import {
  LOCATION_BASE_PATH,
  formatTzs,
  type DistrictSummary,
  type RentStats,
} from '@/lib/seo/locationPages';

interface Crumb {
  name: string;
  href: string;
}

interface LocationLandingProps {
  /** Human place name, e.g. "Kinondoni, Dar es Salaam" */
  placeName: string;
  /** Hand-written intro paragraph (region pages) or data-driven fallback (district pages). */
  intro: string;
  tips?: string[];
  /** Cards to show, already in display order. */
  cards: PropertyCard[];
  /** Total listings in this scope (may exceed cards.length). */
  total: number;
  verifiedCount: number;
  stats: RentStats;
  /** Child/sibling areas to link to. */
  areas?: DistrictSummary[];
  areasHeading?: string;
  areaHref?: (slug: string) => string;
  breadcrumbs: Crumb[];
  searchHref: string;
  h1: string;
  /** Additional link groups (e.g. bedroom / price filters, child areas). */
  extraSections?: { heading: string; items: { href: string; label: string; count?: number }[] }[];
  /** Replaces the default "Nyumba za kupanga {place}" listing heading (filter pages). */
  listingsHeading?: string;
}

function buildFaq(placeName: string, stats: RentStats, total: number, verified: number) {
  const faq: { q: string; a: string }[] = [];

  if (stats.median && stats.min && stats.max && stats.tzsCount >= 3) {
    faq.push({
      q: `Bei ya kupanga nyumba ${placeName} ni kiasi gani?`,
      a: `Kwa nyumba zilizotangazwa sasa kwenye Ndotoni, nyumba nyingi ${placeName} zina kodi ya mwezi kati ya ${formatTzs(stats.min)} na ${formatTzs(stats.max)}, na bei ya kati ni takriban ${formatTzs(stats.median)} (kulingana na nyumba ${stats.tzsCount} zenye bei kwa shilingi). Bei hubadilika kulingana na ukubwa, hali ya nyumba na umbali na barabara kuu.`,
    });
  }

  faq.push({
    q: `Ninawezaje kuwasiliana na mwenye nyumba ${placeName}?`,
    a: 'Fungua tangazo la nyumba unayoipenda na utumie kitufe cha WhatsApp kuwasiliana moja kwa moja na mwenye nyumba au timu ya Ndotoni. Hakuna haja ya kupitia dalali.',
  });

  faq.push({
    q: 'Nyumba zilizothibitishwa na Ndotoni ni zipi?',
    a:
      verified > 0
        ? `Nyumba zenye alama ya "Imethibitishwa" zimekaguliwa na Ndotoni. Kwa sasa ${verified} kati ya nyumba ${total} ${placeName} zina alama hii. Hata hivyo, tembelea nyumba kila mara kabla ya kulipa.`
        : 'Nyumba zenye alama ya "Imethibitishwa" zimekaguliwa na Ndotoni. Tembelea nyumba kila mara kabla ya kulipa kodi au amana.',
  });

  faq.push({
    q: 'Ni mambo gani nikague kabla ya kulipa kodi?',
    a: 'Tembelea nyumba mwenyewe, uliza kuhusu maji na umeme, hakikisha mkataba ulioandikwa unaonyesha kiasi, muda na sarafu ya kodi, na usilipe kabla ya kuthibitisha mwenye nyumba halisi.',
  });

  return faq;
}

/** Server component – all content is in the initial HTML for crawlers. */
export default function LocationLanding({
  placeName,
  intro,
  tips,
  cards,
  total,
  verifiedCount,
  stats,
  areas,
  areasHeading,
  areaHref,
  breadcrumbs,
  searchHref,
  h1,
  extraSections,
  listingsHeading,
}: LocationLandingProps) {
  const faq = buildFaq(placeName, stats, total, verifiedCount);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.href.startsWith('http') ? c.href : `https://www.ndotoni.com${c.href}`,
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="bg-cream-100 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-500 mb-6">
          <ol className="flex flex-wrap items-center gap-1.5">
            {breadcrumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-ink-900 font-medium">{c.name}</span>
                ) : (
                  <Link href={c.href} className="hover:text-brand-600">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">{h1}</h1>
          <p className="mt-4 text-ink-700 leading-relaxed">{intro}</p>
        </header>

        <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          <Stat label="Nyumba zilizopo" value={String(total)} />
          <Stat label="Bei kuanzia" value={stats.min ? formatTzs(stats.min) : '–'} />
          <Stat label="Bei ya kati" value={stats.median ? formatTzs(stats.median) : '–'} />
          <Stat label="Bei hadi" value={stats.max ? formatTzs(stats.max) : '–'} />
        </dl>
        {stats.tzsCount > 0 && (
          <p className="mt-2 text-xs text-ink-500">
            Kodi ya mwezi kwa shilingi kulingana na nyumba {stats.tzsCount} zilizotangazwa sasa. "Kuanzia" na "hadi" zinaonyesha bei ambazo nyumba nyingi (80%) ziko ndani yake, si bei za chini au za juu kabisa.
          </p>
        )}

        <section className="mt-10" aria-labelledby="listings-heading">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 id="listings-heading" className="text-xl sm:text-2xl font-semibold text-ink-900">
              {listingsHeading ?? `Nyumba za kupanga ${placeName}`}
            </h2>
            <Link href={searchHref} className="text-sm font-medium text-brand-600 hover:underline whitespace-nowrap">
              Tazama zote →
            </Link>
          </div>
          <SearchPropertyGrid properties={cards} />
          {total > cards.length && (
            <div className="mt-6 text-center">
              <Link
                href={searchHref}
                className="inline-block rounded-full bg-brand-600 text-white px-6 py-3 text-sm font-semibold hover:bg-brand-700"
              >
                Tazama nyumba zote {total}
              </Link>
            </div>
          )}
        </section>

        {areas && areas.length > 0 && areaHref && (
          <section className="mt-12" aria-labelledby="areas-heading">
            <h2 id="areas-heading" className="text-xl font-semibold text-ink-900 mb-3">
              {areasHeading}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={areaHref(a.slug)}
                    className="inline-block rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:border-brand-500 hover:text-brand-600"
                  >
                    {a.name} <span className="text-ink-400">({a.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {extraSections?.map((section) =>
          section.items.length > 0 ? (
            <section key={section.heading} className="mt-12" aria-label={section.heading}>
              <h2 className="text-xl font-semibold text-ink-900 mb-3">{section.heading}</h2>
              <ul className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 hover:border-brand-500 hover:text-brand-600"
                    >
                      {item.label}
                      {typeof item.count === 'number' && <span className="text-ink-400"> ({item.count})</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )}

        {tips && tips.length > 0 && (
          <section className="mt-12 max-w-3xl" aria-labelledby="tips-heading">
            <h2 id="tips-heading" className="text-xl font-semibold text-ink-900 mb-3">
              Vidokezo vya kupanga nyumba {placeName}
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-ink-700">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 max-w-3xl" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-semibold text-ink-900 mb-3">
            Maswali yanayoulizwa mara kwa mara
          </h2>
          <div className="divide-y divide-ink-200 rounded-xl border border-ink-200 bg-white">
            {faq.map((f) => (
              <details key={f.q} className="group p-4">
                <summary className="cursor-pointer font-medium text-ink-900">{f.q}</summary>
                <p className="mt-2 text-ink-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 max-w-3xl">
          <div className="rounded-xl bg-white border border-ink-200 p-5">
            <h2 className="font-semibold text-ink-900">Hukuoni unachotafuta?</h2>
            <p className="mt-1 text-sm text-ink-700">Tuambie bajeti na eneo lako, tutakutafutia nyumba.</p>
            <Link href={searchHref} className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
              Tafuta nyumba →
            </Link>
          </div>
          <div className="rounded-xl bg-white border border-ink-200 p-5">
            <h2 className="font-semibold text-ink-900">Una nyumba ya kupangisha?</h2>
            <p className="mt-1 text-sm text-ink-700">Tangaza nyumba yako kwenye Ndotoni na upate wapangaji haraka.</p>
            <Link href="/landlord" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
              Kwa wamiliki →
            </Link>
          </div>
        </section>

        <p className="mt-10 text-xs text-ink-500">
          <Link href={LOCATION_BASE_PATH} className="hover:underline">
            Nyumba za kupanga Tanzania – maeneo yote
          </Link>
          {' · '}
          <Link href="/blog" className="hover:underline">
            Miongozo ya kupanga nyumba
          </Link>
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-ink-200 p-3">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-1 text-base sm:text-lg font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
