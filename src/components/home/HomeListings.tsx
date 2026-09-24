'use client';

import Link from 'next/link';
import type { PropertyCard } from '@/API';
import SearchPropertyCard from '@/components/property/SearchPropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeListingsProps {
  titleKey: string;
  properties: PropertyCard[];
  seeAllHref: string;
}

export function HomeListings({ titleKey, properties, seeAllHref }: HomeListingsProps) {
  const { t } = useLanguage();
  if (properties.length === 0) return null;

  const id = `listings-${titleKey.replace(/\W/g, '-')}`;

  return (
    <section className="py-8 sm:py-10" aria-labelledby={id}>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 id={id} className="font-display text-2xl sm:text-3xl tracking-tight text-ink-900 dark:text-white">
          {t(titleKey)}
        </h2>
        <Link
          href={seeAllHref}
          className="inline-flex items-center min-h-11 text-base font-semibold text-brand-700 dark:text-brand-300 hover:underline underline-offset-4"
        >
          {t('home.seeAll')}
        </Link>
      </div>
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4">
        {properties.map((property) => (
          <SearchPropertyCard key={property.propertyId} property={property} showFavorite={false} />
        ))}
      </div>
    </section>
  );
}
