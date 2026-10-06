'use client';

import {
  useState,
  useEffect,
  Suspense,
  memo,
  useCallback,
  useRef,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { usePropertiesByLocation } from '@/hooks/useProperty';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PAGINATION } from '@/constants/pagination';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import SearchFilters from '@/components/ui/SearchFilters';
import { saveSearchPreferences, searchDescription } from '@/lib/search/preferences';
import NaturalLanguageSearch from '@/components/ui/NaturalLanguageSearch';
import React from 'react';
import { KangaBand } from '@/components/ui/KangaBand';
import { toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertySearchLoadingWrapper from '@/components/property/PropertySearchLoadingWrapper';
import SearchEmptyState from '@/components/property/SearchEmptyState';
import SearchPropertyGrid from '@/components/property/SearchPropertyGrid';
import { normalizeLocationName } from '@/lib/location/normalize';
import { HousingRequestBanner } from '@/components/housing/HousingRequestBanner';

// Define PropertyFilters interface here since it's frontend-specific
interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  originalText?: string;
  priceSort?: 'asc' | 'desc';
}

function filtersFromParams(params: {
  get: (key: string) => string | null;
}): PropertyFilters {
  const result: PropertyFilters = {};
  for (const key of [
    'region',
    'district',
    'ward',
    'propertyType',
    'moveInDate',
    'originalText',
  ] as const) {
    const value = params.get(key);
    if (value) result[key] = value;
  }
  for (const key of [
    'minPrice',
    'maxPrice',
    'bedrooms',
    'bathrooms',
  ] as const) {
    const value = params.get(key);
    if (value && Number.isFinite(Number(value)) && Number(value) >= 0)
      result[key] = Number(value);
  }
  const priceSort = params.get('priceSort');
  if (priceSort === 'asc' || priceSort === 'desc') result.priceSort = priceSort;
  return result;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [unsupportedPreferences, setUnsupportedPreferences] = useState<string[]>([]);
  const arrivedWithSearch = useRef(searchParams.size > 0);
  const [searchCollapsed, setSearchCollapsed] = useState(() => searchParams.size > 0);
  const { language } = useLanguage();
  const [filteredProperties, setFilteredProperties] = useState<
    PropertyCardType[]
  >([]);
  const [filters, setFilters] = useState<PropertyFilters>(() =>
    filtersFromParams(searchParams),
  );

  // Extract region, district, and sortBy from filters or URL params
  const region = filters.region || 'Dar es Salaam';
  const district = filters.district || undefined;
  const sortBy =
    filters.priceSort === 'asc'
      ? 'PRICE_LOW_HIGH'
      : filters.priceSort === 'desc'
        ? 'PRICE_HIGH_LOW'
        : undefined;

  // Extract additional filters — fallback to URL params for initial render
  const additionalFilters = {
    ward: filters.ward,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    propertyType: filters.propertyType,
    moveInDate: filters.moveInDate,
  };

  const { properties, isLoading, error, fetchProperties, loadMore, hasMore } =
    usePropertiesByLocation(region, district, sortBy, additionalFilters);
  const { toggleFavorite, isFavorited } = usePropertyFavorites();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);

  const handleFiltersChange = useCallback(
    (newFilters: PropertyFilters) => {
      setFilters(newFilters);
      setUnsupportedPreferences([]);
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
      });
      router.replace(`/search?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    saveSearchPreferences({ ...filters, region });
  }, [filters, region]);

  const showResults = useCallback(() => {
    setSearchCollapsed(true);
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  }, []);

  // On arrival from the home search or a shared search URL, surface the results.
  useEffect(() => {
    if (!arrivedWithSearch.current) return;
    const frame = requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Apply filters locally (can extend to API filtering)
  useEffect(() => {
    setFilteredProperties(
      filters.ward
        ? properties.filter(
            (p) =>
              normalizeLocationName(p.ward || p.district) ===
              normalizeLocationName(filters.ward),
          )
        : properties,
    );
  }, [properties, filters.ward]);

  const hasBudget =
    filters.minPrice !== undefined || filters.maxPrice !== undefined;
  const exactProperties = filteredProperties.filter(
    (p) =>
      !hasBudget ||
      (p.currency === 'TZS' &&
        (filters.minPrice === undefined || p.monthlyRent >= filters.minPrice) &&
        (filters.maxPrice === undefined || p.monthlyRent <= filters.maxPrice)),
  );
  const suggestions = filteredProperties.filter(
    (p) => !exactProperties.includes(p),
  );

  const getSearchTitle = () => {
    if (filters.ward)
      return `${language === 'sw' ? 'Tafuta nyumba' : 'Find homes in'} ${toTitleCase(filters.ward)}`;
    if (filters.district)
      return `${language === 'sw' ? 'Tafuta nyumba' : 'Find homes in'} ${toTitleCase(filters.district)}`;
    if (filters.region)
      return `${language === 'sw' ? 'Tafuta nyumba' : 'Find homes in'} ${toTitleCase(filters.region)}`;
    return `${language === 'sw' ? 'Tafuta nyumba' : 'Find homes in'} ${toTitleCase(region)}`;
  };

  // =========================
  // Render logic
  // =========================

  return (
    <>
      <div className={`py-6 sm:py-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="text-clay-700 dark:text-clay-300 hover:text-clay-800 dark:hover:text-clay-200 font-medium transition-colors"
              >
                {language === 'sw' ? 'Nyumbani' : 'Home'}
              </Link>
              <svg
                className="w-4 h-4 text-ink-300 dark:text-gray-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {filters.region ? (
                <>
                  <Link
                    href={`/search?region=${filters.region}`}
                    className="text-clay-700 dark:text-clay-300 hover:text-clay-800 dark:hover:text-clay-200 transition-colors"
                  >
                    {toTitleCase(filters.region)}
                  </Link>
                  {filters.district && (
                    <>
                      <svg
                        className="w-4 h-4 text-ink-300 dark:text-gray-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="text-ink-500 dark:text-gray-400 transition-colors">
                        {toTitleCase(filters.district)}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-ink-500 dark:text-gray-400 transition-colors">
                  {toTitleCase(filters.region)}
                  {filters.district && ` · ${toTitleCase(filters.district)}`}
                </span>
              )}
            </nav>
          </div>

          {/* Search Results Header */}
          <div className="mb-6">
            <h1 className="font-poster text-3xl font-extrabold tracking-[-0.035em] text-ink-900 [font-stretch:88%] sm:text-4xl lg:text-5xl dark:text-white text-balance">
              {getSearchTitle()}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-gray-400">
              {language === 'sw'
                ? 'Chagua eneo na bajeti yako. Linganisha nyumba, hifadhi unazopenda na panga kutembelea.'
                : 'Choose your area and budget. Compare homes, save your favorites and arrange a viewing.'}
            </p>
            <KangaBand variant="thin" className="mt-4 max-w-[7rem]" />
          </div>

          <div ref={resultsRef} tabIndex={-1} className="scroll-mt-28 focus:outline-none" />
            <NaturalLanguageSearch
              filters={filters}
              onApply={(next, unsupported) => { handleFiltersChange(next); setUnsupportedPreferences(unsupported || []); showResults(); }}
            />
          {searchCollapsed && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-900">
              <div>
                <p className="text-sm font-medium leading-relaxed text-ink-700 dark:text-gray-200">{searchDescription({ ...filters, region }, language === 'sw')}</p>
                {unsupportedPreferences.length > 0 && <p className="mt-2 text-xs leading-relaxed text-ink-500 dark:text-gray-400">{language === 'sw' ? 'Hatuwezi kuchuja haya bado:' : 'These preferences cannot be filtered yet:'} {unsupportedPreferences.join(', ')}</p>}
              </div>
              <Button variant="outline" onClick={() => setSearchCollapsed(false)} aria-expanded={false} aria-controls="search-controls" className="shrink-0">{language === 'sw' ? 'Badilisha vichujio' : 'Edit filters'}</Button>
            </div>
          )}
          <div id="search-controls" hidden={searchCollapsed}>
            <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
            <div className="mb-6 flex justify-end">
              <Button onClick={showResults} aria-expanded={true} aria-controls="search-controls">{language === 'sw' ? 'Onyesha matokeo' : 'Show results'}</Button>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-4 dark:border-gray-700">
            <p
              role="status"
              aria-live="polite"
              className="text-sm font-semibold text-ink-900 dark:text-white"
            >
              {isLoading
                ? language === 'sw'
                  ? 'Tunatafuta nyumba…'
                  : 'Finding homes…'
                : error ? (language === 'sw' ? 'Utafutaji umekatizwa' : 'Search interrupted')
                : filteredProperties.length === 0 ? (language === 'sw' ? 'Hakuna inayolingana kwa sasa' : 'No matches yet')
                : `${exactProperties.length} ${language === 'sw' ? 'nyumba zilizopakia' : 'homes loaded'}${suggestions.length ? ` · ${suggestions.length} ${language === 'sw' ? 'za kuzingatia' : 'alternatives'}` : ''}`}
            </p>
            <p className="text-xs text-ink-500 dark:text-gray-400">
              {language === 'sw'
                ? 'Bei ni za kila mwezi'
                : 'Prices are per month'}
            </p>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-stone-200 p-5 dark:border-gray-700"
            >
              <h2 className="font-poster text-xl font-bold">
                {language === 'sw'
                  ? 'Nyumba hazijapakia'
                  : 'Homes could not load'}
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                {language === 'sw'
                  ? 'Angalia mtandao wako na ujaribu tena.'
                  : 'Check your connection and try again.'}
              </p>
              <Button
                className="mt-4"
                onClick={() => fetchProperties(PAGINATION.INITIAL_FETCH_LIMIT)}
              >
                {language === 'sw' ? 'Jaribu tena' : 'Try again'}
              </Button>
            </div>
          )}
          {/* Search Results */}
          <PropertySearchLoadingWrapper isLoading={isLoading} skeletonCount={4}>
            {filteredProperties.length > 0 ? (
              <>
                {hasBudget && exactProperties.length > 0 && (
                  <h2 className="mb-4 text-lg font-bold">
                    {language === 'sw'
                      ? 'Ndani ya bajeti yako'
                      : 'Within your budget'}
                  </h2>
                )}
                {suggestions.length > 0 && exactProperties.length > 0 && (
                  <SearchPropertyGrid
                    properties={exactProperties}
                    onFavoriteToggle={toggleFavorite}
                    isFavorited={isFavorited}
                  />
                )}
                {suggestions.length > 0 && (
                  <div className="mb-5 mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-ink-900 dark:border-brand-700 dark:bg-gray-800 dark:text-white">
                    <h2 className="font-bold">
                      {language === 'sw'
                        ? 'Nyumba nyingine za kuzingatia'
                        : 'Other homes to consider'}
                    </h2>
                    <p className="mt-1 text-sm">
                      {language === 'sw'
                        ? 'Bajeti hupanuliwa hadi 30% ikiwa matokeo ni machache. Bei za sarafu nyingine zinaonyeshwa kwa sarafu yake; thibitisha gharama kabla ya kuamua.'
                        : 'With few matches, the budget widens by up to 30%. Foreign-currency prices stay in their listed currency; confirm the cost before deciding.'}
                    </p>
                  </div>
                )}
                <AllPropertiesSection
                  properties={
                    suggestions.length ? suggestions : exactProperties
                  }
                  hasMore={hasMore}
                  isLoading={isLoading}
                  onLoadMore={loadMore}
                  onFavoriteToggle={toggleFavorite}
                  isFavorited={isFavorited}
                  showHeader={false}
                />
              </>
            ) : !error ? (
              <SearchEmptyState
                filters={{ ...filters, region }}
                onChange={handleFiltersChange}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            ) : null}
          </PropertySearchLoadingWrapper>

          {filteredProperties.length > 0 && (
            <HousingRequestBanner className="mt-8" />
          )}
        </div>
      </div>
    </>
  );
}

// Force dynamic rendering for pages using useSearchParams
export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
              <p className="mt-4 text-ink-500 dark:text-gray-400 transition-colors">
                Loading search...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
