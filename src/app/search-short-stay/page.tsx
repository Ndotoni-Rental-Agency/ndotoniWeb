'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { toTitleCase } from '@/lib/utils/common';
import PropertySearchLoadingWrapper from '@/components/property/PropertySearchLoadingWrapper';
import SearchPropertyCard from '@/components/property/SearchPropertyCard';
import { GraphQLClient } from '@/lib/graphql-client';
import { searchShortTermProperties } from '@/graphql/queries';
import { ShortTermSortOption } from '@/API';
import type { ShortTermProperty, ShortTermSearchInput } from '@/API';

interface ShortTermFilters {
  region?: string;
  district?: string;
  checkIn?: string;
  checkOut?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  priceSort?: 'asc' | 'desc';
}

function SearchShortStayContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<ShortTermProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ShortTermFilters>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  // Extract parameters from URL
  const region = filters.region || searchParams.get('region') || 'Dar es Salaam';
  const district = filters.district || searchParams.get('district') || undefined;
  const checkInParam = filters.checkIn || searchParams.get('checkIn') || undefined;
  const checkOutParam = filters.checkOut || searchParams.get('checkOut') || undefined;
  
  // Default checkout to 1 month from check-in (or 1 month from today if no check-in)
  const getDefaultCheckOut = (checkInDate?: string): string => {
    const baseDate = checkInDate ? new Date(checkInDate) : new Date();
    const checkOutDate = new Date(baseDate);
    checkOutDate.setMonth(checkOutDate.getMonth() + 1);
    return checkOutDate.toISOString().split('T')[0];
  };
  
  // Default check-in to today if not provided
  const getDefaultCheckIn = (): string => {
    return new Date().toISOString().split('T')[0];
  };
  
  const checkIn = checkInParam || getDefaultCheckIn();
  const checkOut = checkOutParam || getDefaultCheckOut(checkIn);

  console.log('🔎 [SearchShortStay] Rendering with params:', {
    region,
    district,
    checkIn,
    checkOut,
    filters
  });

  // Parse search parameters on mount
  useEffect(() => {
    const initialFilters: ShortTermFilters = {};
    const regionParam = searchParams.get('region');
    const districtParam = searchParams.get('district');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const propertyTypeParam = searchParams.get('propertyType');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const guestsParam = searchParams.get('guests');

    if (regionParam) initialFilters.region = regionParam;
    if (districtParam) initialFilters.district = districtParam;
    if (checkInParam) initialFilters.checkIn = checkInParam;
    if (checkOutParam) initialFilters.checkOut = checkOutParam;
    if (propertyTypeParam) initialFilters.propertyType = propertyTypeParam;
    if (minPriceParam) initialFilters.minPrice = Number(minPriceParam);
    if (maxPriceParam) initialFilters.maxPrice = Number(maxPriceParam);
    if (guestsParam) initialFilters.guests = Number(guestsParam);

    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [searchParams]);

  // Fetch short-term properties
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate required parameters
        if (!region) {
          throw new Error('Region is required');
        }

        // Build search input
        const searchInput: ShortTermSearchInput = {
          region,
          district: district || undefined,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: filters.guests || 1,
          propertyType: filters.propertyType as any,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortBy: filters.priceSort === 'asc' ? ShortTermSortOption.PRICE_LOW_HIGH : 
                  filters.priceSort === 'desc' ? ShortTermSortOption.PRICE_HIGH_LOW : undefined,
          limit: 20,
        };

        console.log('Fetching short-term properties with input:', searchInput);

        const response = await GraphQLClient.executePublic<{
          searchShortTermProperties: {
            properties: ShortTermProperty[];
            nextToken?: string;
          };
        }>(searchShortTermProperties, { input: searchInput });

        const result = response?.searchShortTermProperties;
        
        if (result?.properties) {
          setProperties(result.properties);
          console.log(`Loaded ${result.properties.length} short-term properties`);
        } else {
          setProperties([]);
        }
      } catch (err) {
        console.error('Error fetching short-term properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [region, district, checkIn, checkOut, filters.guests, filters.propertyType, filters.minPrice, filters.maxPrice, filters.priceSort]);

  const handleFiltersChange = useCallback((newFilters: ShortTermFilters) => {
    setFilters(newFilters);

    // Scroll to results when filters are applied
    setTimeout(() => {
      if (resultsRef.current) {
        const offset = 100;
        const elementPosition = resultsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  const getSearchTitle = () => {
    const location = filters.district 
      ? toTitleCase(filters.district)
      : filters.region 
        ? toTitleCase(filters.region)
        : toTitleCase(region);
    
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `Short-term stays in ${location} • ${checkInDate} - ${checkOutDate}`;
    }
    
    return `Short-term stays in ${location}`;
  };

  const formatDateRange = () => {
    if (!checkIn || !checkOut) return null;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return `${checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${nights} night${nights !== 1 ? 's' : ''}`;
  };

  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error loading properties</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-12" ref={resultsRef}>
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
            <svg className="w-4 h-4 text-ink-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink-500 dark:text-gray-400">Short-term Stays</span>
            {filters.region && (
              <>
                <svg className="w-4 h-4 text-ink-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/search-short-stay?region=${filters.region}`}
                  className="text-clay-700 dark:text-clay-300 hover:text-clay-800 dark:hover:text-clay-200 transition-colors"
                >
                  {toTitleCase(filters.region)}
                </Link>
                {filters.district && (
                  <>
                    <svg className="w-4 h-4 text-ink-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-ink-500 dark:text-gray-400">
                      {toTitleCase(filters.district)}
                    </span>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Search Results Header */}
        <div className="mb-8">
          <p className="eyebrow mb-2">Nightly Stays</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink-900 dark:text-white text-balance">
            {getSearchTitle()}
          </h1>
          {formatDateRange() && (
            <p className="text-ink-500 dark:text-gray-400 mt-2">
              {formatDateRange()}
            </p>
          )}
        </div>

        {/* TODO: Add Short-term Search Filters Component */}
        {/* <ShortTermSearchFilters filters={filters} onFiltersChange={handleFiltersChange} /> */}

        {/* Price & Sort Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Price range filter */}
          <div className="flex items-center gap-2">
            <select
              value={filters.minPrice || ''}
              onChange={(e) => handleFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="text-sm py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Min price</option>
              <option value="10000">TZS 10,000+</option>
              <option value="25000">TZS 25,000+</option>
              <option value="50000">TZS 50,000+</option>
              <option value="100000">TZS 100,000+</option>
              <option value="200000">TZS 200,000+</option>
              <option value="500000">TZS 500,000+</option>
            </select>
            <span className="text-gray-400 text-sm">–</span>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => handleFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="text-sm py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Max price</option>
              <option value="25000">Up to TZS 25,000</option>
              <option value="50000">Up to TZS 50,000</option>
              <option value="100000">Up to TZS 100,000</option>
              <option value="200000">Up to TZS 200,000</option>
              <option value="500000">Up to TZS 500,000</option>
              <option value="1000000">Up to TZS 1,000,000</option>
            </select>
          </div>

          {/* Sort by price */}
          <select
            value={filters.priceSort || ''}
            onChange={(e) => handleFiltersChange({ ...filters, priceSort: (e.target.value || undefined) as any })}
            className="text-sm py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Sort by</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          {/* Guests filter */}
          <select
            value={filters.guests || ''}
            onChange={(e) => handleFiltersChange({ ...filters, guests: e.target.value ? Number(e.target.value) : undefined })}
            className="text-sm py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Guests</option>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5">5+ guests</option>
          </select>

          {/* Clear filters */}
          {(filters.minPrice || filters.maxPrice || filters.priceSort || filters.guests) && (
            <button
              onClick={() => handleFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined, priceSort: undefined, guests: undefined })}
              className="text-sm text-brand-600 dark:text-emerald-400 font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Search Results */}
        <PropertySearchLoadingWrapper isLoading={isLoading} skeletonCount={12}>
          {properties.length > 0 ? (
            <div className="search-property-grid">
              {properties.map((property) => (
                <SearchPropertyCard
                  key={property.propertyId}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-cream-200 dark:bg-gray-800 rounded-3xl border border-stone-200 dark:border-gray-700">
              <div className="text-ink-300 dark:text-gray-500 mb-4">
                <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-ink-900 dark:text-white mb-2">No properties found</h3>
              <p className="text-ink-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                No short-term stays are available for your selected dates. Try adjusting your search criteria or dates.
              </p>
              <Link href="/">
                <Button variant="primary">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </PropertySearchLoadingWrapper>
      </div>
    </div>
  );
}

// Force dynamic rendering for pages using useSearchParams
export const dynamic = 'force-dynamic';

export default function SearchShortStayPage() {
  return (
    <Suspense fallback={
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-600 mx-auto"></div>
            <p className="mt-4 text-ink-500 dark:text-gray-400">Loading short-term stays...</p>
          </div>
        </div>
      </div>
    }>
      <SearchShortStayContent />
    </Suspense>
  );
}
