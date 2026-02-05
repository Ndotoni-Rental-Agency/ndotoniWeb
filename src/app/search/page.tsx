'use client';

import { useState, useEffect, Suspense, memo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { usePropertiesByLocation } from '@/hooks/useProperty';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PAGINATION } from '@/constants/pagination';
import { useFadeIn } from '@/hooks/useFadeIn';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import SearchFilters from '@/components/ui/SearchFilters';
import React from 'react';
import { toTitleCase } from '@/utils/common';
import PropertySearchLoadingWrapper from '@/components/property/PropertySearchLoadingWrapper';

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
  
  // Extract additional filters
  const additionalFilters = {
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    propertyType: filters.propertyType,
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
    
    if (regionParam) initialFilters.region = regionParam;
    if (districtParam) initialFilters.district = districtParam;
    if (propertyTypeParam) initialFilters.propertyType = propertyTypeParam;
    if (minPriceParam) initialFilters.minPrice = Number(minPriceParam);
    if (maxPriceParam) initialFilters.maxPrice = Number(maxPriceParam);
    if (bedroomsParam) initialFilters.bedrooms = Number(bedroomsParam);
    if (bathroomsParam) initialFilters.bathrooms = Number(bathroomsParam);
    
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">Error loading properties</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">{error}</p>
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
      <div className={`py-8 ${isScrolled ? 'pt-20' : ''}`} ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link 
                href="/" 
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Home
              </Link>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {filters.region ? (
                <>
                  <Link 
                    href={`/search?region=${filters.region}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                  >
                    {toTitleCase(filters.region)}
                  </Link>
                  {filters.district && (
                    <>
                      <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400 transition-colors">
                        {toTitleCase(filters.district)}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-gray-600 dark:text-gray-400 transition-colors">
                  {toTitleCase(filters.region)}
                  {filters.district && ` • ${toTitleCase(filters.district)}`}
                </span>
              )}
            </nav>
          </div>

          {/* Search Results Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
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
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4 transition-colors">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">No properties found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                No properties are currently available. Please check back later.
              </p>
            </div>
          )}
          </PropertySearchLoadingWrapper>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
