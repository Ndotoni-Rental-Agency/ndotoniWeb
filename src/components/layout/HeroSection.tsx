'use client';

import MoneyInput from '@/components/ui/MoneyInput';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  X,
} from 'lucide-react';
import NaturalLanguageSearch from '@/components/ui/NaturalLanguageSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { toTitleCase } from '@/lib/utils/common';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/home/HomeDesign.module.css';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';

interface PropertyFilters {
  region?: string;
  district?: string;
  propertyType?: string;
  maxPrice?: number;
  minPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  ward?: string;
  originalText?: string;
}

export default function HeroSection({
  onSearch,
}: {
  onSearch: (filters: PropertyFilters) => void;
}) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [location, setLocation] = useState<FlattenedLocation>({
    type: 'region',
    name: 'DAR ES SALAAM',
    displayName: 'Dar es Salaam',
  });
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isLoading, error, retry } = useRegionSearch(query);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (locationOpen && dialog && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!locationOpen && dialog?.open) {
      dialog.close();
      locationButtonRef.current?.focus();
    }
  }, [locationOpen]);

  const fieldClass =
    'w-full min-h-[54px] rounded-xl border border-stone-200 bg-stone-50 px-4 text-base text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white';


  return (
    <section className={styles.hero}>
      <div className={styles.searchWrap} id="home-search">
        <NaturalLanguageSearch
          filters={{ region: location.type === 'region' ? location.name : location.regionName, district: location.type === 'district' ? location.name : undefined, maxPrice: budget ? Number(budget) : undefined, propertyType: propertyType || undefined }}
          onApply={(next) => onSearch(next)}
          onSearch={() => onSearch({ region: location.type === 'region' ? location.name : location.regionName, district: location.type === 'district' ? location.name : undefined, maxPrice: budget ? Number(budget) : undefined, propertyType: propertyType || undefined })}
        >
          <input type="hidden" name="region" value={location.type === 'region' ? location.name : location.regionName || ''} />
          {location.type === 'district' && <input type="hidden" name="district" value={location.name} />}
          <div className={styles.searchField}>
            <label id="home-location-label">{sw ? 'Eneo' : 'Location'}</label>
            <button ref={locationButtonRef} type="button" onClick={() => { setQuery(''); setLocationOpen(true); }} aria-labelledby="home-location-label home-location-value" aria-haspopup="dialog" className={styles.locationButton}>
              <MapPin size={17} /><span id="home-location-value">{toTitleCase(location.displayName)}</span><span aria-hidden="true" className={styles.chevron}>⌄</span>
            </button>
          </div>
          <div className={styles.searchField}>
            <label htmlFor="home-type">{sw ? 'Aina ya nyumba' : 'Home type'}</label>
            <select id="home-type" name="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option value="">{sw ? 'Aina zote' : 'All home types'}</option>
              <option value="APARTMENT">{sw ? 'Ghorofa' : 'Apartment'}</option>
              <option value="HOUSE">{sw ? 'Nyumba' : 'House'}</option>
              <option value="STUDIO">Studio</option>
              <option value="ROOM">{sw ? 'Chumba' : 'Room'}</option>
            </select>
          </div>
          <div className={styles.searchField}>
            <label htmlFor="home-budget">{sw ? 'Bajeti ya mwezi · TSh' : 'Monthly budget · TSh'}</label>
            <MoneyInput id="home-budget" name="maxPrice"  inputMode="numeric" min="1" step="1" value={budget} onValueChange={(value) => setBudget(value)} placeholder={sw ? 'Bajeti yoyote' : 'Any budget'} />
          </div>
        </NaturalLanguageSearch>
      </div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>
            {sw ? 'Nyumba nzuri.' : 'A place to love.'}
            <em>{sw ? 'Mwanzo mpya.' : 'A life to build.'}</em>
          </h1>
          <p className={styles.heroDescription}>
            {sw
              ? 'Pata sehemu ya kutulia. Nyumba za kupanga, kwa maisha yako yanayofuata.'
              : 'Find a place to settle in. Long-term homes for your next chapter.'}
          </p>

        </div>
        <Link href="/property/fXqFmtxthEYv" className={styles.heroPhoto} aria-label={sw ? 'Angalia nyumba hii Goba' : 'Explore this home in Goba'}>
          <Image src="/images/home-goba.webp" alt={sw ? 'Nyumba yenye bustani na mitende Goba, Dar es Salaam' : 'A home with a garden and palms in Goba, Dar es Salaam'} fill priority unoptimized sizes="(max-width: 767px) 100vw, 50vw" className={styles.heroImage} />
          <span className={styles.photoLabel}><MapPin size={14} /> Goba, Dar es Salaam <ArrowRight size={18} /></span>
        </Link>
      </div>
      <dialog
        ref={dialogRef}
        onCancel={() => setLocationOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLocationOpen(false);
        }}
        aria-labelledby="location-dialog-title"
        className="m-auto max-h-[80dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-stone-200 bg-white p-0 shadow-2xl backdrop:bg-black/50 dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2
              id="location-dialog-title"
              className="text-lg font-bold text-ink-900 dark:text-white"
            >
              {sw ? 'Chagua eneo' : 'Choose an area'}
            </h2>
            <button
              type="button"
              onClick={() => setLocationOpen(false)}
              aria-label={sw ? 'Funga' : 'Close'}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-700 hover:bg-stone-100 dark:text-white dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <label htmlFor="home-location-query" className="sr-only">
            {sw ? 'Tafuta mkoa au wilaya' : 'Search region or district'}
          </label>
          <input
            ref={inputRef}
            id="home-location-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              sw ? 'Tafuta mkoa au wilaya…' : 'Search region or district…'
            }
            className={fieldClass}
          />
        </div>
        <div className="p-3" aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <p className="p-5 text-sm text-ink-500 dark:text-gray-300">
              {sw ? 'Inapakia maeneo…' : 'Loading areas…'}
            </p>
          ) : error ? (
            <div className="p-5 text-sm text-ink-700 dark:text-gray-300">
              <p>
                {sw
                  ? 'Maeneo hayajapakia. Angalia intaneti yako.'
                  : 'Areas could not load. Check your connection.'}
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 min-h-11 rounded-xl bg-brand-700 px-4 font-semibold text-white"
              >
                {sw ? 'Jaribu tena' : 'Try again'}
              </button>
            </div>
          ) : results.length === 0 ? (
            <p className="p-5 text-sm text-ink-500 dark:text-gray-300">
              {sw
                ? 'Hakuna eneo lililopatikana. Jaribu jina la mkoa au wilaya.'
                : 'No matching area. Try a region or district name.'}
            </p>
          ) : (
            results.map((item, index) => (
              <button
                key={`${item.type}-${item.regionName}-${item.name}-${index}`}
                type="button"
                onClick={() => {
                  setLocation(item);
                  setLocationOpen(false);
                }}
                className="flex min-h-16 w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-600 dark:hover:bg-gray-700"
              >
                <MapPin
                  size={19}
                  className="shrink-0 text-brand-700 dark:text-brand-300"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink-900 dark:text-white">
                    {toTitleCase(item.displayName)}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-gray-400">
                    {item.type === 'region'
                      ? sw
                        ? 'Mkoa'
                        : 'Region'
                      : sw
                        ? 'Wilaya'
                        : 'District'}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </dialog>
    </section>
  );
}
