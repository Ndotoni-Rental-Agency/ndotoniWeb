'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cachedGraphQL, getPropertyCards } from '@/lib/graphql';
import { PropertyCard as PropertyCardType, PropertyFilters } from '@/types';
import PropertyCard from '@/components/property/PropertyCard';
// import SearchFilters from '@/components/ui/SearchFilters'; // Disabled for now

import { usePropertyFavorites } from '@/hooks/useProperty';
import { Button } from '@/design-system/components/Button';
import Link from 'next/link';

// Force dynamic rendering for pages using useSearchParams
export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyCardType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyCardType[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { toggleFavorite, isFavorited } = usePropertyFavorites();

  // Parse search parameters
  useEffect(() => {
    const initialFilters: PropertyFilters = {};
    
    // Get filters from URL parameters
    const region = searchParams.get('region');
    const district = searchParams.get('district');
    const ward = searchParams.get('ward');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');

    const q = searchParams.get('q');

    if (region) initialFilters.region = region;
    if (district) initialFilters.district = district;
    if (ward) initialFilters.ward = ward;
    if (propertyType) initialFilters.propertyType = propertyType as any;
    if (minPrice && !isNaN(parseInt(minPrice))) initialFilters.minPrice = parseInt(minPrice);
    if (maxPrice && !isNaN(parseInt(maxPrice))) initialFilters.maxPrice = parseInt(maxPrice);
    if (bedrooms && !isNaN(parseInt(bedrooms))) initialFilters.bedrooms = parseInt(bedrooms);

    if (q) initialFilters.q = q;

    setFilters(initialFilters);
  }, [searchParams]);

  // Fetch properties and locations
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Set all properties as filtered properties (no filtering for now)
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      


      // Fetch all properties with caching
      try {
        const response = await cachedGraphQL.query({
          query: getPropertyCards,
          variables: { limit: 100 } // Get more properties for search
        });
        
        const items = response.data?.getPropertyCards?.properties || [];
        
        if (items.length > 0) {
          // Add missing fields for frontend compatibility
          const processedProperties = items.map((property: any) => ({
            ...property,
            ward: property.ward || property.district,
          }));
          
          setProperties(processedProperties);
        } else {
          setError('No properties found');
        }
      } catch (graphqlError) {
        console.error('GraphQL query failed:', graphqlError);
        setError('Failed to load properties from server');
      }
    } catch (err) {
      console.error('Error in fetchInitialData:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Filtering disabled for now - just show all properties
  // const applyFilters = () => {
  //   // Filtering logic will be implemented later
  // };



  const getSearchTitle = () => {
    if (filters.ward) {
      return `Stay in ${filters.ward}`;
    }
    if (filters.district) {
      return `Stay in ${filters.district}`;
    }
    if (filters.region) {
      return `Stay in ${filters.region}`;
    }
    if (filters.q) {
      return `"${filters.q}"`;
    }
    return 'All Properties';
  };

  const getSearchSubtitle = () => {
    const resultCount = filteredProperties.length;
    return `${resultCount} ${resultCount === 1 ? 'property' : 'properties'} • Showing all available properties`;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Searching properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400 mb-4 transition-colors">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">Error loading properties</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">{error}</p>
            <Button onClick={fetchInitialData} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {filters.ward ? filters.ward :
               filters.district ? filters.district :
               filters.region ? filters.region :
               filters.q ? `Search: ${filters.q}` :
               'All Properties'}
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

        {/* Search Filters - Disabled for now */}
        {/* <div className="mb-8">
          <SearchFilters 
            locations={locations}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div> */}

        {/* Results Actions - Simplified for now */}
        <div className="flex items-center justify-end mb-6">
          <Button 
            variant="outline"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            }
          >
            Sort
          </Button>
        </div>

        {/* Search Results */}
        {filteredProperties.length > 0 ? (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.propertyId} 
                property={property}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited(property.propertyId)}
              />
            ))}
          </div>
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
  );
}