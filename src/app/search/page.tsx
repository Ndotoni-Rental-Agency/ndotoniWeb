'use client';

import design from '@/components/design/Brand.module.css';

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
import { PAGINATION } from '@/constants/pagination';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import SearchFilterDialog from '@/components/property/SearchFilterDialog';
import { saveSearchPreferences } from '@/lib/search/preferences';
import NaturalLanguageSearch from '@/components/ui/NaturalLanguageSearch';
import React from 'react';
import { toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertySearchLoadingWrapper from '@/components/property/PropertySearchLoadingWrapper';
import SearchEmptyState from '@/components/property/SearchEmptyState';
import SearchPropertyGrid from '@/components/property/SearchPropertyGrid';
import { normalizeLocationName } from '@/lib/location/normalize';
import { HousingRequestBanner } from '@/components/housing/HousingRequestBanner';
import { SlidersHorizontal } from 'lucide-react';
import { Highlight } from '@/components/motion';

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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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

  // Bumped each time we surface results, to flash the results header so the
  // user's eye lands on "here's what you asked for" after the scroll.
  const [resultsHandoff, setResultsHandoff] = useState(0);

  const showResults = useCallback(() => {
    setResultsHandoff((n) => n + 1);
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
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

  const sw = language === 'sw';
  const typeNames: Record<string, string> = { ROOM: sw ? 'Vyumba' : 'Rooms', APARTMENT: sw ? 'Ghorofa' : 'Apartments', HOUSE: sw ? 'Nyumba' : 'Houses', STUDIO: 'Studios' };
  const activeFilterSummary = [
    filters.propertyType ? typeNames[filters.propertyType] || toTitleCase(filters.propertyType) : '',
    filters.minPrice !== undefined && filters.maxPrice !== undefined
      ? `TSh ${filters.minPrice.toLocaleString()} – ${filters.maxPrice.toLocaleString()} / ${sw ? 'mwezi' : 'month'}`
      : filters.maxPrice !== undefined ? `${sw ? 'Hadi' : 'Up to'} TSh ${filters.maxPrice.toLocaleString()} / ${sw ? 'mwezi' : 'month'}`
      : filters.minPrice !== undefined ? `${sw ? 'Kuanzia' : 'From'} TSh ${filters.minPrice.toLocaleString()} / ${sw ? 'mwezi' : 'month'}` : '',
    filters.bedrooms ? `${filters.bedrooms}+ ${sw ? 'vyumba vya kulala' : 'bedrooms'}` : '',
    filters.bathrooms ? `${filters.bathrooms}+ ${sw ? 'bafu' : 'bathrooms'}` : '',
    filters.moveInDate ? `${sw ? 'Kuhamia' : 'Move in'} ${filters.moveInDate}` : '',
  ].filter(Boolean).join(' · ');

  // =========================
  // Render logic
  // =========================

  return (
    <div className={design.page}>
      <div className={design.searchContainer}>
        <header className={design.searchMasthead}>
          <h1 className={design.title}>{getSearchTitle()}</h1>

        </header>
        <div className={design.searchWorkspace}>
          <section className={design.searchResults} aria-label={language === 'sw' ? 'Matokeo ya utafutaji' : 'Search results'}>
            <div className={design.searchToolbar}>
              <NaturalLanguageSearch filters={filters} onApply={(next, unsupported) => { handleFiltersChange(next); setUnsupportedPreferences(unsupported || []); showResults(); }} />
              <button type="button" className={design.filtersButton} aria-haspopup="dialog" aria-expanded={isFiltersOpen} onClick={() => setIsFiltersOpen(true)}>
                <SlidersHorizontal size={18} aria-hidden="true" />{language === 'sw' ? 'Vichujio' : 'Filters'}
                {Object.entries(filters).filter(([key, value]) => !['region', 'originalText', 'priceSort'].includes(key) && value !== undefined && value !== '').length > 0 && <span className={design.filterCount}>{Object.entries(filters).filter(([key, value]) => !['region', 'originalText', 'priceSort'].includes(key) && value !== undefined && value !== '').length}</span>}
              </button>
            </div>

            {activeFilterSummary && <p className={design.appliedCriteria}>{activeFilterSummary}</p>}
            {unsupportedPreferences.length > 0 && <p role="status" className="mb-4 text-sm text-ink-500 dark:text-gray-400">{language === 'sw' ? 'Hatuwezi kuchuja haya bado:' : 'Not filtered yet:'} {unsupportedPreferences.join(', ')}</p>}
            <div ref={resultsRef} tabIndex={-1} className="scroll-mt-28 focus:outline-none" />
            <Highlight trigger={resultsHandoff} variant="flash" as="div" className={design.resultsBar}>
              <p role="status" aria-live="polite" className="text-sm font-semibold text-ink-900 dark:text-white">
                {isLoading ? (language === 'sw' ? 'Tunatafuta nyumba…' : 'Finding homes…')
                  : error ? (language === 'sw' ? 'Utafutaji umekatizwa' : 'Search interrupted')
                  : filteredProperties.length === 0 ? (language === 'sw' ? 'Hakuna inayolingana kwa sasa' : 'No matches yet')
                  : `${exactProperties.length} ${language === 'sw' ? 'nyumba zilizopakia' : 'homes loaded'}${suggestions.length ? ` · ${suggestions.length} ${language === 'sw' ? 'za kuzingatia' : 'alternatives'}` : ''}`}
              </p>
              <label className={design.resultsSort}>
                <span>{language === 'sw' ? 'Panga' : 'Sort'}</span>
                <select aria-label={language === 'sw' ? 'Panga matokeo' : 'Sort results'} value={filters.priceSort || ''} onChange={(event) => handleFiltersChange({ ...filters, priceSort: (event.target.value || undefined) as PropertyFilters['priceSort'] })}>
                  <option value="">{language === 'sw' ? 'Mpangilio wa kawaida' : 'Recommended'}</option>
                  <option value="asc">{language === 'sw' ? 'Bei: ndogo hadi kubwa' : 'Price: low to high'}</option>
                  <option value="desc">{language === 'sw' ? 'Bei: kubwa hadi ndogo' : 'Price: high to low'}</option>
                </select>
              </label>
            </Highlight>
            {error && <div role="alert" className="mb-6 rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
              <h2 className="text-xl font-bold">{language === 'sw' ? 'Nyumba hazijapakia' : 'Homes could not load'}</h2>
              <p className="mt-2 text-sm text-ink-500">{language === 'sw' ? 'Angalia mtandao wako na ujaribu tena.' : 'Check your connection and try again.'}</p>
              <Button className="mt-4" onClick={() => fetchProperties(PAGINATION.INITIAL_FETCH_LIMIT)}>{language === 'sw' ? 'Jaribu tena' : 'Try again'}</Button>
            </div>}
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
                    stagger
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
          </section>
        </div>
      </div>
      <SearchFilterDialog isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} filters={filters} onApply={(next) => { handleFiltersChange(next); setResultsHandoff((value) => value + 1); }} />
    </div>
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
