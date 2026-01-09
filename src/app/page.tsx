'use client';

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { fetchLocations, flattenLocations } from '@/lib/locations';
import { PropertyCard as PropertyCardType } from '@/API';

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
}
import { LocationItem } from '@/lib/locations';
import PropertyCard from '@/components/property/PropertyCard';

import SearchFilters from '@/components/ui/SearchFilters';
import HeroSection from '@/components/layout/HeroSection';
import ClientOnly from '@/components/ui/ClientOnly';
import SearchBar from '@/components/ui/SearchBar';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { usePropertyFavorites, usePropertyFilters, usePropertyCards } from '@/hooks/useProperty';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { useFadeIn } from '@/hooks/useFadeIn';

// Animated Section Component
function AnimatedSection({ 
  children, 
  delay = 0,
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useFadeIn({ delay });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [filteredProperties, setFilteredProperties] = useState<PropertyCardType[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<PropertyCardType[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<PropertyCardType[]>([]);
  const [favorites, setFavorites] = useState<PropertyCardType[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const { filters, clearFilters, setFilters } = usePropertyFilters();
  const { toggleFavorite, isFavorited } = usePropertyFavorites();
  const { properties, isLoading: loading, error, fetchProperties } = usePropertyCards();
  const [showFiltered, setShowFiltered] = useState(false);
  const isScrolled = useScrollPosition(200);
  const { setIsScrolled } = useScroll();

  const segmentProperties = useCallback(() => {
    if (properties.length === 0) return;

    // For now, show all properties in each category
    // Later we'll implement proper filtering logic
    setNearbyProperties(properties);
    setRecentlyViewed(properties);
    setFavorites(properties);
  }, [properties]);

  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    if (filters.region) {
      filtered = filtered.filter(p => p.region === filters.region);
    }
    if (filters.district) {
      filtered = filtered.filter(p => p.district === filters.district);
    }
    if (filters.ward) {
      // Ward filtering would need to be handled differently since PropertyCard doesn't include ward
      // For now, we'll skip this filter or implement it at the API level
    }
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => (p.monthlyRent || 0) >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => (p.monthlyRent || 0) <= filters.maxPrice!);
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(p => (p.bedrooms || 0) >= filters.bedrooms!);
    }
    // Note: PropertyCard doesn't have bathrooms, furnished, etc. - these would need full Property data

    setFilteredProperties(filtered);
  }, [properties, filters]);

  const fetchInitialData = async () => {
    try {
      // Fetch locations
      try {
        const locationsData = await fetchLocations();
        const flattenedLocations = flattenLocations(locationsData);
        setLocations(flattenedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }

      // Fetch properties using the hook
      await fetchProperties(20);
    } catch (err) {
      console.error('Error in fetchInitialData:', err);
    }
  };

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setShowFiltered(Object.keys(newFilters).length > 0);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
    segmentProperties();
  }, [properties, applyFilters, segmentProperties]);

  // Sync scroll state with context
  useEffect(() => {
    setIsScrolled(isScrolled);
  }, [isScrolled, setIsScrolled]);



  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <HeroSection 
        onSearch={handleFiltersChange} 
        properties={properties}
        loading={loading}
      />
      
      {/* Sticky Search Bar */}
      {isScrolled && (
        <SearchBar 
          onSearch={handleFiltersChange}
          variant="sticky"
          isScrolled={isScrolled}
        />
      )}
      
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 layout-transition ${isScrolled ? 'pt-20' : ''}`}>
        <AnimatedSection delay={0}>
          <SearchFilters 
            locations={locations}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </AnimatedSection>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">{t('common.loadingProperties')}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 transition-colors">
            <p className="font-medium">{t('common.error')} loading properties</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && showFiltered && (
          <AnimatedSection delay={100}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
              <ClientOnly fallback={
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                    Loading stays...
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                    Rent monthly or longer
                  </p>
                </div>
              }>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
                    {filteredProperties.length > 300 ? '300+' : filteredProperties.length} stays
                    {filters.ward ? (
                      <span className="text-gray-600 dark:text-gray-400 font-normal transition-colors"> in {filters.ward}</span>
                    ) : filters.region && (
                      <span className="text-gray-600 dark:text-gray-400 font-normal transition-colors"> in {filters.region}</span>
                    )}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                    {filters.ward ? `${filters.ward}, ${filters.district} • ` : filters.district ? `${filters.district} • ` : ''}
                    Rent monthly or longer
                  </p>
                </div>
              </ClientOnly>
              
              {/* Sort/Filter Toggle - Airbnb style */}
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost"
                  onClick={() => {clearFilters(); setShowFiltered(false);}}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  Clear filters
                </Button>
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
            </div>
            
            <ClientOnly fallback={
              <div className="property-grid">
                {/* Skeleton loading cards */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse transition-colors">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
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
            </ClientOnly>
            </div>
          </AnimatedSection>
        )}

        {!loading && !showFiltered && (
          <div className="space-y-12">
            {/* Nearby Properties Section */}
            {nearbyProperties.length > 0 && (
              <AnimatedSection delay={100}>
                <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Stay Near Dar es Salaam</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Properties close to you</p>
                  </div>
                  <button 
                    onClick={() => handleFiltersChange({ region: 'Dar es Salaam' })}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors"
                  >
                    Show all
                  </button>
                </div>
                <div className="relative scroll-container">
                  {/* Left Arrow */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('nearby-scroll');
                      if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center opacity-0 md:hover:opacity-100 transition-all duration-200 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:flex"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right Arrow */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('nearby-scroll');
                      if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center scroll-arrow hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div id="nearby-scroll" className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                    {nearbyProperties.map((property) => (
                      <div key={property.propertyId} className="flex-none w-64">
                        <PropertyCard 
                          property={property}
                          onFavoriteToggle={toggleFavorite}
                          isFavorited={isFavorited(property.propertyId)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              </AnimatedSection>
            )}

            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
              <AnimatedSection delay={200}>
                <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Recently viewed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Properties you've checked out</p>
                  </div>
                </div>
                <div className="relative scroll-container">
                  {/* Left Arrow */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('recent-scroll');
                      if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center scroll-arrow hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right Arrow */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('recent-scroll');
                      if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center scroll-arrow hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div id="recent-scroll" className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                    {recentlyViewed.map((property) => (
                      <div key={property.propertyId} className="flex-none w-64">
                        <PropertyCard 
                          property={property}
                          onFavoriteToggle={toggleFavorite}
                          isFavorited={isFavorited(property.propertyId)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              </AnimatedSection>
            )}

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <AnimatedSection delay={300}>
                <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Your favorites</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Properties you've saved</p>
                  </div>
                </div>
                <div className="relative scroll-container">
                  {/* Left Arrow */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('favorites-scroll');
                      if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center scroll-arrow hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right Arrow */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('favorites-scroll');
                      if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center scroll-arrow hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div id="favorites-scroll" className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                    {favorites.map((property) => (
                      <div key={property.propertyId} className="flex-none w-64">
                        <PropertyCard 
                          property={property}
                          onFavoriteToggle={toggleFavorite}
                          isFavorited={isFavorited(property.propertyId)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              </AnimatedSection>
            )}

            {/* All Properties Section */}
            <AnimatedSection delay={400}>
              <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Explore all properties</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Discover more places to stay</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <span className="text-sm font-medium">Sort</span>
                  </button>
                </div>
              </div>
              <ClientOnly fallback={
                <div className="property-grid">
                  {/* Skeleton loading cards */}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse transition-colors">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <div className="property-grid">
                  {properties.map((property) => (
                    <PropertyCard 
                      key={property.propertyId} 
                      property={property}
                      onFavoriteToggle={toggleFavorite}
                      isFavorited={isFavorited(property.propertyId)}
                    />
                  ))}
                </div>
              </ClientOnly>
              </section>
            </AnimatedSection>
          </div>
        )}

        {!loading && filteredProperties.length === 0 && properties.length > 0 && (
          <AnimatedSection delay={100}>
            <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4 transition-colors">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">No properties match your filters</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Try adjusting your search criteria</p>
            <Button 
              onClick={clearFilters}
              variant="primary"
            >
              Clear all filters
            </Button>
            </div>
          </AnimatedSection>
        )}
      </main>
    </div>
  );
}