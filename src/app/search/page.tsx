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
import NaturalLanguageSearch from '@/components/ui/NaturalLanguageSearch';
import React from 'react';
import { KangaBand } from '@/components/ui/KangaBand';
import { toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertySearchLoadingWrapper from '@/components/property/PropertySearchLoadingWrapper';
import { HousingRequestForm } from '@/components/housing/HousingRequestForm';
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
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
      });
      router.replace(`/search?${params.toString()}`, { scroll: false });
    },
    [router],
  );

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
      return `${language === 'sw' ? 'Nyumba zilizopo' : 'Homes in'} ${toTitleCase(filters.ward)}`;
    if (filters.district)
      return `${language === 'sw' ? 'Nyumba zilizopo' : 'Homes in'} ${toTitleCase(filters.district)}`;
    if (filters.region)
      return `${language === 'sw' ? 'Nyumba zilizopo' : 'Homes in'} ${toTitleCase(filters.region)}`;
    return `${language === 'sw' ? 'Nyumba zilizopo' : 'Homes in'} ${toTitleCase(region)}`;
  };

  // =========================
  // Render logic
  // =========================

  return (
    <>
      <div className={`py-6 sm:py-10`} ref={resultsRef}>
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

          <NaturalLanguageSearch
            filters={filters}
            onApply={handleFiltersChange}
          />

          {/* Search Filters */}
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

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
              <div className="py-8">
                <div className="text-center mb-8">
                  <svg
                    className="w-16 h-16 mx-auto text-ink-300 dark:text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-2">
                    {language === 'sw'
                      ? 'Hakuna nyumba zilizopatikana'
                      : 'No properties found'}
                  </h3>
                  <p className="text-ink-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                    {language === 'sw'
                      ? 'Hatukupata nyumba zinazofanana na utafutaji wako. Jaribu kubadilisha vichujio, au tuambie unachotafuta hapa chini.'
                      : "We couldn't find any properties matching your search. Try adjusting your filters, or let us know what you're looking for below."}
                  </p>
                </div>
                {hasMore && (
                  <div className="mb-6 text-center">
                    <Button onClick={loadMore} variant="outline">
                      {language === 'sw'
                        ? 'Tafuta nyumba zaidi'
                        : 'Check more homes'}
                    </Button>
                  </div>
                )}
                <HousingRequestForm className="max-w-lg mx-auto text-left" />
              </div>
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
