'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/API';
import { getHomepagePropertiesFromCache } from '@/lib/homepage-cache';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePropertyFavorites } from '@/hooks/useProperty';
import SearchPropertyGrid from '@/components/property/SearchPropertyGrid';

const HOME_LISTINGS_COUNT = 12;
// Below this a TZS listing is almost certainly a data-entry error, not a monthly rent
const MIN_PLAUSIBLE_TZS_RENT = 10000;

const isShowcaseReady = (property: PropertyCard) =>
  Boolean(property.thumbnail) &&
  (property.currency !== 'TZS' || property.monthlyRent >= MIN_PLAUSIBLE_TZS_RENT);

export function HomeListings() {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { toggleFavorite, isFavorited } = usePropertyFavorites();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    getHomepagePropertiesFromCache()
      .then((data) => {
        const unique = new Map<string, PropertyCard>();
        for (const property of [
          ...(data.featured || []),
          ...(data.recent || []),
          ...(data.lowestPrice || []),
        ]) {
          if (!unique.has(property.propertyId) && isShowcaseReady(property)) {
            unique.set(property.propertyId, property);
          }
        }
        if (active)
          setProperties(
            Array.from(unique.values()).slice(0, HOME_LISTINGS_COUNT),
          );
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <section className="py-10 sm:py-14" aria-labelledby="home-listings-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="home-listings-title"
            className="font-poster text-3xl font-extrabold tracking-[-0.03em] text-ink-900 [font-stretch:90%] sm:text-5xl dark:text-white"
          >
            {sw ? 'Nyumba za kuangalia' : 'Homes to explore'}
          </h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-gray-400">
            {sw
              ? 'Pata unayopenda, kisha uliza kuhusu kutembelea.'
              : 'Find a place you like, then ask about a viewing.'}
          </p>
        </div>
        <Link
          href="/search"
          className="group/more inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-bold text-sand-300 transition-colors hover:bg-brand-800 dark:bg-white dark:text-ink-900 dark:hover:bg-sand-300"
        >
          {sw ? 'Angalia nyumba zaidi' : 'Explore more homes'}
          <ArrowRight
            size={17}
            strokeWidth={2.5}
            className="transition-transform group-hover/more:translate-x-1"
          />
        </Link>
      </div>
      {loading ? (
        <div className="search-property-grid" role="status">
          <span className="sr-only">
            {sw ? 'Inapakia nyumba…' : 'Loading homes…'}
          </span>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="overflow-hidden rounded-2xl border border-stone-200 dark:border-gray-700"
            >
              <div className="aspect-[4/3] animate-pulse bg-stone-100 motion-reduce:animate-none dark:bg-gray-800" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded bg-stone-100 dark:bg-gray-800" />
                <div className="h-4 w-1/2 rounded bg-stone-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : failed || properties.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-ink-700 dark:text-gray-200">
            {failed
              ? sw
                ? 'Nyumba hazijapakia. Unaweza kujaribu tena au kutafuta kwa eneo.'
                : 'Homes could not load. Try again or search by area.'
              : sw
                ? 'Tafuta kwa eneo kuona nyumba zinazokufaa.'
                : 'Search by area to find homes that suit you.'}
          </p>
          {failed && (
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="mt-4 min-h-11 rounded-xl bg-ink-900 px-5 text-sm font-bold text-sand-300 hover:bg-brand-800"
            >
              {sw ? 'Jaribu tena' : 'Try again'}
            </button>
          )}
        </div>
      ) : (
        <>
          <SearchPropertyGrid
            properties={properties}
            onFavoriteToggle={toggleFavorite}
            isFavorited={isFavorited}
          />
          <div className="mt-8 flex justify-center">
            <Link
              href="/search"
              className="group/all inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-500 px-7 font-poster text-lg font-extrabold text-ink-900 transition-colors hover:bg-brand-400"
            >
              {sw ? 'Angalia nyumba zote' : 'See all homes'}
              <ArrowRight
                size={19}
                strokeWidth={2.5}
                className="transition-transform group-hover/all:translate-x-1"
              />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
