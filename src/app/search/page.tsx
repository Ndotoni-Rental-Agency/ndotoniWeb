'use client';

import { useState, useEffect, Suspense, memo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { logger } from '@/lib/utils/logger';
import { usePropertyFavorites, usePropertyCards } from '@/hooks/useProperty';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PAGINATION } from '@/constants/pagination';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useFadeIn } from '@/hooks/useFadeIn';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';
import SearchBar from '@/components/ui/SearchBar';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import SearchFilters from '@/components/ui/SearchFilters';
import { fetchLocations, flattenLocations, LocationItem } from '@/lib/location';
import React from 'react';

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

// Animated Section Component
const AnimatedSection = memo(({ 
  children, 
  delay = 0,
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) => {
  const { ref, isVisible } = useFadeIn({ delay });

  return (
    <div
      ref={ref}
      className={`transition-all duration-100 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
});

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<PropertyCardType[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});
  
  const { properties, isLoading, error, fetchProperties, loadMore, hasMore, setProperties } = usePropertyCards();
  const { toggleFavorite, isFavorited } = usePropertyFavorites();
  const isScrolled = useScrollPosition(100);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Parse search parameters & fetch locations
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const locationsData = await fetchLocations();
        const flattenedLocations = flattenLocations(locationsData);
        setLocations(flattenedLocations);
      } catch (err) {
        logger.error('Error fetching locations:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Track first fetch completion
  useEffect(() => {
    if (!hasInitialized && !isLoading && properties.length > 0) {
      setHasInitialized(true);
    }
  }, [isLoading, properties, hasInitialized]);

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

  // Infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
    threshold: PAGINATION.SCROLL_THRESHOLD
  });

  const handleSearch = (newFilters: PropertyFilters) => {
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    window.history.pushState({}, '', `/search?${params.toString()}`);
    setFilters(newFilters);
  };

  const getSearchTitle = () => {
    if (filters.ward) return `Stay in ${filters.ward}`;
    if (filters.district) return `Stay in ${filters.district}`;
    if (filters.region) return `Stay in ${filters.region}`;
    if (filters.q) return `"${filters.q}"`;
    return 'All Properties';
  };

  const getSearchSubtitle = () => {
    const resultCount = filteredProperties.length;
    return `${resultCount} ${resultCount === 1 ? 'property' : 'properties'} • Showing all available properties`;
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
      {/* Sticky Search Bar */}
      {isScrolled && (
        <SearchBar 
          onSearch={handleSearch}
          variant="sticky"
          isScrolled={isScrolled}
        />
      )}
      
      <div className={`py-8 ${isScrolled ? 'pt-20' : ''}`} ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link 
                href="/" 
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
              >
                Home
              </Link>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-600 dark:text-gray-400 transition-colors">
                {filters.ward ?? filters.district ?? filters.region ?? (filters.q ? `Search: ${filters.q}` : 'All Properties')}
              </span>
            </nav>
          </div>

          {/* Search Results Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              {getSearchTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              {getSearchSubtitle()}
            </p>
          </div>

          {/* Search Filters */}
          <SearchFilters 
            locations={locations}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Search Results */}
          {!hasInitialized || isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Loading properties...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <AllPropertiesSection
              properties={filteredProperties}
              loadingRef={loadingRef}
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
