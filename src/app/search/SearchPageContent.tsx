'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePropertiesByLocation, usePropertyFavorites } from '@/hooks/useProperty';
import { Button } from '@/components/ui/Button';
import { PAGINATION } from '@/constants/pagination';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import SearchFilters from '@/components/ui/SearchFilters';
import { PropertySearchCardSkeletonGrid } from '@/components/property/PropertySearchSkeleton';
import { toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import { HousingRequestForm } from '@/components/housing/HousingRequestForm';
import { HousingRequestBanner } from '@/components/housing/HousingRequestBanner';
import type { PropertyCard } from '@/API';
import { DEFAULT_REGION, filtersFromParams, paramsFromFilters, queryMinPrice, sortByFromFilters, type PropertyFilters } from '@/lib/search/params';

interface SearchPageContentProps {
  initial?: { properties: PropertyCard[]; nextToken: string | null };
}


export default function SearchPageContent({ initial }: SearchPageContentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { t } = useLanguage();

  const filters = useMemo(() => filtersFromParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const region = filters.region || DEFAULT_REGION;
  const sortBy = sortByFromFilters(filters);

  const { properties: rawProperties, isLoading, error, fetchProperties, loadMore, hasMore } = usePropertiesByLocation(
    region,
    filters.district,
    sortBy,
    {
      minPrice: queryMinPrice(filters),
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      propertyType: filters.propertyType,
      moveInDate: filters.moveInDate,
    },
    initial
  );
  const { toggleFavorite, isFavorited } = usePropertyFavorites();
  // The backend widens the price range when results are few, which can re-admit rent-0 (incomplete) listings.
  const properties = useMemo(() => rawProperties.filter((p) => p.monthlyRent > 0), [rawProperties]);

  const handleFiltersChange = useCallback(
    (next: PropertyFilters) => {
      // Update the URL without a server round-trip; useSearchParams picks it up and the hook refetches.
      window.history.replaceState(null, '', `${pathname}?${paramsFromFilters(next)}`);
    },
    [pathname]
  );

  const place = toTitleCase(filters.district || region);
  const showSkeleton = isLoading && properties.length === 0;

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 dark:text-white text-balance mb-6">
          {t('searchPage.housesIn').replace('{place}', place)}
        </h1>

        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

        <p role="status" aria-live="polite" className="min-h-6 mb-2 text-sm font-medium text-ink-600 dark:text-gray-400">
          {isLoading && properties.length > 0 ? t('searchPage.loading') : ''}
        </p>

        {error ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-2">{t('searchPage.errorTitle')}</h2>
            <p className="text-ink-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchProperties(PAGINATION.INITIAL_FETCH_LIMIT)} variant="primary">
              {t('searchPage.tryAgain')}
            </Button>
          </div>
        ) : showSkeleton ? (
          <PropertySearchCardSkeletonGrid count={8} />
        ) : properties.length > 0 ? (
          <>
            <AllPropertiesSection
              properties={properties}
              hasMore={hasMore}
              isLoading={isLoading}
              onLoadMore={loadMore}
              onFavoriteToggle={toggleFavorite}
              isFavorited={isFavorited}
              showHeader={false}
            />
            <HousingRequestBanner className="mt-8" />
          </>
        ) : (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-ink-900 dark:text-white mb-2">{t('searchPage.noResultsTitle')}</h2>
              <p className="text-ink-600 dark:text-gray-400 text-base max-w-md mx-auto">{t('searchPage.noResultsBody')}</p>
            </div>
            <HousingRequestForm className="max-w-lg mx-auto text-left" />
          </div>
        )}
      </div>
    </div>
  );
}
