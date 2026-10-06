'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  MapPin,
  MessageCircle,
  Search,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { toTitleCase } from '@/lib/utils/common';
import { KangaBand } from '@/components/ui/KangaBand';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';

interface PropertyFilters {
  region?: string;
  district?: string;
  propertyType?: string;
  maxPrice?: number;
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

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({
      region: location.type === 'region' ? location.name : location.regionName,
      district: location.type === 'district' ? location.name : undefined,
      maxPrice: budget ? Number(budget) : undefined,
      propertyType: propertyType || undefined,
    });
  };
  const fieldClass =
    'w-full min-h-[54px] rounded-xl border border-stone-200 bg-stone-50 px-4 text-base text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
  const assistanceMessage = sw
    ? 'Habari, naomba msaada kutafuta nyumba.'
    : 'Hello, I need help finding a home.';

  return (
    <section className="relative">
      <div className="relative overflow-hidden bg-brand-500 dark:bg-brand-800">
        <div className="relative mx-auto grid max-w-7xl gap-5 px-4 pb-7 pt-5 sm:gap-8 sm:px-6 sm:pb-14 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-20">
          <div>
            <h1 className="font-poster text-[2.1rem] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink-900 [font-stretch:88%] sm:text-6xl lg:text-7xl xl:text-[5.25rem] dark:text-white">
              <span className="block">
                {sw ? 'Nyumba unayoipenda.' : 'A home you’ll love.'}
              </span>
              <span className="hero-sticker mt-3 inline-block -rotate-2 rounded-lg bg-cream-50 px-3 py-1 text-brand-800 shadow-[0_14px_28px_-12px_rgba(17,24,39,0.55)] sm:mt-4 sm:px-4 dark:bg-white dark:text-ink-900">
                {sw ? 'Bajeti unayoweza.' : 'A budget that fits.'}
              </span>
            </h1>
            <p className="mt-3 max-w-md text-sm sm:mt-6 sm:text-base font-medium leading-relaxed text-ink-800 sm:text-lg dark:text-brand-50">
              {sw
                ? 'Chagua eneo na bajeti, angalia nyumba, kisha wasiliana kupitia WhatsApp kupanga kutembelea.'
                : 'Choose your area and budget, explore homes, then arrange a viewing on WhatsApp.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:mt-5 sm:text-sm font-semibold text-ink-900 dark:text-white">
              <span className="inline-flex items-center gap-2">
                <Check size={17} strokeWidth={2.5} />
                {sw ? 'Tafuta bila akaunti' : 'Browse without an account'}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={17} strokeWidth={2.25} />
                {sw ? 'Msaada kupitia WhatsApp' : 'Help on WhatsApp'}
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-[0_28px_60px_-24px_rgba(17,24,39,0.6)] sm:p-7 dark:bg-gray-800">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-white dark:bg-gray-900">
                <Search size={21} strokeWidth={2.5} />
              </span>
              <div>
                <h2 className="font-poster text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white">
                  {sw ? 'Tuanze kutafuta' : 'Find your next home'}
                </h2>
                <p className="mt-0.5 hidden text-sm text-ink-500 sm:block dark:text-gray-400">
                  {sw
                    ? 'Hatua ndogo kuelekea nyumba yako.'
                    : 'A few simple choices to get started.'}
                </p>
              </div>
            </div>
            <form
              action="/search"
              method="get"
              onSubmit={submit}
              className="space-y-3 sm:space-y-4"
            >
              <input
                type="hidden"
                name="region"
                value={
                  location.type === 'region'
                    ? location.name
                    : location.regionName || ''
                }
              />
              {location.type === 'district' && (
                <input type="hidden" name="district" value={location.name} />
              )}
              <div>
                <label
                  id="home-location-label"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-gray-200"
                >
                  <MapPin size={16} />
                  {sw ? 'Unatafuta eneo gani?' : 'Where are you looking?'}
                </label>
                <button
                  ref={locationButtonRef}
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setLocationOpen(true);
                  }}
                  aria-labelledby="home-location-label home-location-value"
                  aria-haspopup="dialog"
                  className={`${fieldClass} flex items-center justify-between text-left`}
                >
                  <span id="home-location-value">
                    {toTitleCase(location.displayName)}
                  </span>
                  <Search size={18} className="text-ink-500" />
                </button>
              </div>
              <div>
                <label
                  htmlFor="home-budget"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-gray-200"
                >
                  <Banknote size={16} />
                  {sw ? 'Bajeti yako kwa mwezi' : 'Your monthly budget'}
                </label>
                <div className="relative">
                  <input
                    id="home-budget"
                    name="maxPrice"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={
                      sw
                        ? 'Kiasi cha juu, mfano 300000'
                        : 'Maximum amount, e.g. 300000'
                    }
                    className={`${fieldClass} pr-16`}
                  />
                  <span className="pointer-events-none absolute right-4 top-4 text-sm font-semibold text-ink-500 dark:text-gray-400">
                    TSh
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {[100000, 300000, 500000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={budget === String(amount)}
                      onClick={() =>
                        setBudget(
                          budget === String(amount) ? '' : String(amount),
                        )
                      }
                      className={`min-h-11 rounded-full border px-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${budget === String(amount) ? 'border-ink-900 bg-ink-900 text-white' : 'border-stone-200 text-ink-700 hover:border-ink-900 hover:bg-stone-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      {sw ? 'Hadi' : 'Up to'} {amount.toLocaleString('en-TZ')}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ink-500 dark:text-gray-400">
                  {sw
                    ? 'Si lazima — acha wazi kuona bei zote.'
                    : 'Optional — leave blank to see all prices.'}
                </p>
              </div>
              <div>
                <label
                  htmlFor="home-type"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-gray-200"
                >
                  <Building2 size={16} />
                  {sw
                    ? 'Unahitaji nyumba ya aina gani?'
                    : 'What kind of place?'}
                </label>
                <select
                  id="home-type"
                  name="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">{sw ? 'Aina zote' : 'All types'}</option>
                  <option value="ROOM">{sw ? 'Chumba' : 'Room'}</option>
                  <option value="HOUSE">{sw ? 'Nyumba' : 'House'}</option>
                  <option value="APARTMENT">
                    {sw ? 'Ghorofa' : 'Apartment'}
                  </option>
                  <option value="STUDIO">Studio</option>
                </select>
              </div>
              <button
                type="submit"
                className="group/submit flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-brand-800 bg-white px-5 py-4 font-sans text-lg font-bold text-brand-900 transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              >
                {sw ? 'Onyesha nyumba' : 'Show homes'}
                <ArrowRight
                  size={20}
                  strokeWidth={2.5}
                  className="transition-transform group-hover/submit:translate-x-1"
                />
              </button>
            </form>
            <div className="mt-5 border-t border-stone-200 pt-5 dark:border-gray-700">
              <a
                href={`https://wa.me/255790720329?text=${encodeURIComponent(assistanceMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-brand-800 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-gray-700"
              >
                <MessageCircle size={19} />
                {sw
                  ? 'Nisaidie kutafuta kupitia WhatsApp'
                  : 'Help me find a home on WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>
      <KangaBand />
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
