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
    <div className="py-8" ref={resultsRef}>
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
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">Short-term Stays</span>
            {filters.region && (
              <>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/search-short-stay?region=${filters.region}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                >
                  {toTitleCase(filters.region)}
                </Link>
                {filters.district && (
                  <>
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getSearchTitle()}
          </h1>
          {formatDateRange() && (
            <p className="text-gray-600 dark:text-gray-400">
              {formatDateRange()}
            </p>
          )}
        </div>

        {/* TODO: Add Short-term Search Filters Component */}
        {/* <ShortTermSearchFilters filters={filters} onFiltersChange={handleFiltersChange} /> */}

        {/* Search Results */}
        <PropertySearchLoadingWrapper isLoading={isLoading} skeletonCount={12}>
          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((property) => (
                <SearchPropertyCard
                  key={property.propertyId}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading short-term stays...</p>
          </div>
        </div>
      </div>
    }>
      <SearchShortStayContent />
    </Suspense>
  );
}
