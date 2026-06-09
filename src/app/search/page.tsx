'use client';

import { useState, useEffect, Suspense, memo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { usePropertiesByLocation } from '@/hooks/useProperty';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PAGINATION } from '@/constants/pagination';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import SearchFilters from '@/components/ui/SearchFilters';
import React from 'react';
import { toTitleCase } from '@/lib/utils/common';
import PropertySearchLoadingWrapper from '@/components/property/PropertySearchLoadingWrapper';
import { HousingRequestForm } from '@/components/housing/HousingRequestForm';
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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<PropertyCardType[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});
  
  // Extract region, district, and sortBy from filters or URL params
  const region = filters.region || searchParams.get('region') || 'Dar es Salaam';
  const district = filters.district || searchParams.get('district') || undefined;
  const sortBy = filters.priceSort === 'asc' ? 'PRICE_LOW_HIGH' : 
                 filters.priceSort === 'desc' ? 'PRICE_HIGH_LOW' : undefined;
  
  // Extract additional filters — fallback to URL params for initial render
  const additionalFilters = {
    minPrice: filters.minPrice ?? (searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined),
    maxPrice: filters.maxPrice ?? (searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined),
    bedrooms: filters.bedrooms ?? (searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined),
    bathrooms: filters.bathrooms ?? (searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined),
    propertyType: filters.propertyType ?? searchParams.get('propertyType') ?? undefined,
    moveInDate: filters.moveInDate ?? searchParams.get('moveInDate') ?? undefined,
  };
  
  console.log('🔎 [SearchPage] Rendering with params:', {
    urlRegion: searchParams.get('region'),
    urlDistrict: searchParams.get('district'),
    filtersRegion: filters.region,
    filtersDistrict: filters.district,
    finalRegion: region,
    finalDistrict: district,
    sortBy,
    additionalFilters
  });
  
  const { properties, isLoading, error, fetchProperties, loadMore, hasMore } = usePropertiesByLocation(
    region, 
    district, 
    sortBy, 
    additionalFilters
  );
  const { toggleFavorite, isFavorited } = usePropertyFavorites();
  const isScrolled = useScrollPosition(100);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Parse search parameters on mount
  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters: PropertyFilters = {};
    const regionParam = searchParams.get('region');
    const districtParam = searchParams.get('district');
    const propertyTypeParam = searchParams.get('propertyType');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const bedroomsParam = searchParams.get('bedrooms');
    const bathroomsParam = searchParams.get('bathrooms');
    const moveInDateParam = searchParams.get('moveInDate');
    
    if (regionParam) initialFilters.region = regionParam;
    if (districtParam) initialFilters.district = districtParam;
    if (propertyTypeParam) initialFilters.propertyType = propertyTypeParam;
    if (minPriceParam) initialFilters.minPrice = Number(minPriceParam);
    if (maxPriceParam) initialFilters.maxPrice = Number(maxPriceParam);
    if (bedroomsParam) initialFilters.bedrooms = Number(bedroomsParam);
    if (bathroomsParam) initialFilters.bathrooms = Number(bathroomsParam);
    if (moveInDateParam) initialFilters.moveInDate = moveInDateParam;
    
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [searchParams]);

  const handleFiltersChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
    
    // Scroll to results when filters are applied
    setTimeout(() => {
      if (resultsRef.current) {
        const offset = 100; // Offset for header/spacing
        const elementPosition = resultsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  // Apply filters locally (can extend to API filtering)
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);
 

  const getSearchTitle = () => {
    if (filters.district) return `Properties in ${toTitleCase(filters.district)}`;
    if (filters.region) return `Properties in ${toTitleCase(filters.region)}`;
    return `Properties in ${toTitleCase(region)}`;
  };

  // =========================
  // Render logic
  // =========================
  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400 mb-4 transition-colors">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-ink-900 dark:text-white mb-2 transition-colors">Error loading properties</h3>
            <p className="text-ink-500 dark:text-gray-400 mb-4 transition-colors">{error}</p>
            <Button onClick={() => fetchProperties(PAGINATION.INITIAL_FETCH_LIMIT)} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <> 
      <div className={`py-10 sm:py-12`} ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="text-clay-700 dark:text-clay-300 hover:text-clay-800 dark:hover:text-clay-200 font-medium transition-colors"
              >
                Home
              </Link>
              <svg className="w-4 h-4 text-ink-300 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                      <svg className="w-4 h-4 text-ink-300 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          <div className="mb-8">
            <p className="eyebrow mb-2">Results</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink-900 dark:text-white text-balance">
              {getSearchTitle()}
            </h1>
          </div>

          {/* Search Filters */}
          <SearchFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Search Results */}
          <PropertySearchLoadingWrapper isLoading={isLoading} skeletonCount={12}>
            {filteredProperties.length > 0 ? (
            <AllPropertiesSection
              properties={filteredProperties}
              hasMore={hasMore}
              isLoading={isLoading}
              onLoadMore={loadMore}
              onFavoriteToggle={toggleFavorite}
              isFavorited={isFavorited}
              showHeader={false}
            />
          ) : (
            <div className="py-8">
              <HousingRequestForm className="max-w-lg mx-auto text-left" />
            </div>
          )}
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
    <Suspense fallback={
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-600 mx-auto"></div>
            <p className="mt-4 text-ink-500 dark:text-gray-400 transition-colors">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
