'use client';

import React, { memo, useMemo } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { fetchLocations, flattenLocations, LocationItem } from '@/lib/location';
import SearchFilters from '@/components/ui/SearchFilters';
import HeroSection from '@/components/layout/HeroSection';
import SearchBar from '@/components/ui/SearchBar';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { PAGINATION } from '@/constants/pagination';
import { logger } from '@/lib/utils/logger';

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
import { usePropertyFavorites, usePropertyFilters, usePropertyCards } from '@/hooks/useProperty';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useRecentlyViewedProperties, useFavoriteProperties } from '@/hooks/usePropertySections';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useFadeIn } from '@/hooks/useFadeIn';
import { ScrollablePropertySection } from '@/components/home/ScrollablePropertySection';
import { FilteredPropertiesSection } from '@/components/home/FilteredPropertiesSection';
import { AllPropertiesSection } from '@/components/home/AllPropertiesSection';

// Import cache debug utilities in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  import('@/lib/utils/cacheDebug');
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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Check if mobile and disable animations
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, skip animation and show content immediately
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

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

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();
  console.log('Home page - user object:', user);
  console.log('Home page - user.userId:', user?.userId);
  
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const { filters, clearFilters, setFilters } = usePropertyFilters();
  const { properties, isLoading: loading, error, fetchProperties, loadMore, hasMore, favorites: backendFavorites, recentlyViewed: backendRecentlyViewed, refreshPersonalizedSections } = usePropertyCards(user?.userId);
  const { toggleFavorite, isFavorited } = usePropertyFavorites(backendFavorites, user?.userId);
  const isScrolled = useScrollPosition(400); // Balanced threshold for sticky search
  const { setIsScrolled } = useScroll();
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Derive hasActiveFilters from filters (no need for separate state)
  const hasActiveFilters = useMemo(() => 
    Object.keys(filters).length > 0, 
    [filters]
  );

  // Derive filteredProperties from properties and filters (no need for separate state)
  const filteredProperties = useMemo(() => {
    if (!hasActiveFilters) return [];
    
    let filtered = properties.filter(p => {
      if (filters.region && p.region !== filters.region) return false;
      if (filters.district && p.district !== filters.district) return false;
      if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
      if (filters.minPrice && (p.monthlyRent || 0) < filters.minPrice) return false;
      if (filters.maxPrice && (p.monthlyRent || 0) > filters.maxPrice) return false;
      if (filters.bedrooms && (p.bedrooms || 0) < filters.bedrooms) return false;
      return true;
    });

    // Apply price sorting if specified
    if (filters.priceSort) {
      filtered = filtered.sort((a, b) => {
        const priceA = a.monthlyRent || 0;
        const priceB = b.monthlyRent || 0;
        return filters.priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return filtered;
  }, [properties, filters, hasActiveFilters]);

  // Property sections with their own pagination
  const recentSection = useRecentlyViewedProperties(backendRecentlyViewed || []);
  const favoritesSection = useFavoriteProperties(backendFavorites || []);
  
  console.log('Home page - backendRecentlyViewed:', backendRecentlyViewed);
  console.log('Home page - recentSection.properties:', recentSection.properties);

  // Horizontal scroll handlers with constants
  const { scrollContainerRef: recentScrollRef } = useHorizontalScroll({
    hasMore: recentSection.hasMore,
    isLoading: loading,
    onLoadMore: recentSection.loadMore,
    threshold: PAGINATION.SCROLL_THRESHOLD
  });

  const { scrollContainerRef: favoritesScrollRef } = useHorizontalScroll({
    hasMore: favoritesSection.hasMore,
    isLoading: loading,
    onLoadMore: favoritesSection.loadMore,
    threshold: PAGINATION.SCROLL_THRESHOLD
  });

  // Infinite scroll for main property grid
  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore,
    threshold: PAGINATION.SCROLL_THRESHOLD
  });

  const fetchInitialData = async () => {
    try {
      // Fetch locations
      try {
        const locationsData = await fetchLocations();
        const flattenedLocations = flattenLocations(locationsData);
        setLocations(flattenedLocations);
      } catch (error) {
        logger.error('Error fetching locations:', error);
      }

      // Properties will be fetched automatically by usePropertyCards hook
      // when user is available or immediately if no user is needed
    } catch (err) {
      logger.error('Error in fetchInitialData:', err);
    }
  };

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
  }, [setFilters]);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh personalized sections when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.userId) {
        // User returned to the page, refresh personalized sections
        refreshPersonalizedSections();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.userId, refreshPersonalizedSections]);

  // Sync scroll state with context
  useEffect(() => {
    setIsScrolled(isScrolled);
  }, [isScrolled, setIsScrolled]);



  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <HeroSection 
        onSearch={handleFiltersChange}
      />
      
      {/* Sticky Search Bar */}
      {isScrolled && (
        <SearchBar 
          onSearch={handleFiltersChange}
          variant="sticky"
          isScrolled={isScrolled}
        />
      )}
      
      <main className={`max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-6 layout-transition ${isScrolled ? 'pt-20' : ''}`}>
          <SearchFilters 
            locations={locations}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

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

        <div ref={resultsRef}>
          {!loading && hasActiveFilters && (
              <FilteredPropertiesSection
                properties={filteredProperties}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited}
              />
          )}
        </div>

        {!loading && !hasActiveFilters && (
          <div className="space-y-12">
            {/* Recently Viewed Section */}
              <ScrollablePropertySection
                id="recent-scroll"
                title="Recently viewed"
                description="Properties you've checked out"
                properties={recentSection.properties}
                scrollRef={recentScrollRef}
                hasMore={recentSection.hasMore}
                isLoading={loading}
                displayedCount={recentSection.displayedCount}
                totalCount={properties.length}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited}
              />

            {/* Favorites Section */}
              <ScrollablePropertySection
                id="favorites-scroll"
                title="Your favorites"
                description="Properties you've saved"
                properties={favoritesSection.properties}
                scrollRef={favoritesScrollRef}
                hasMore={favoritesSection.hasMore}
                isLoading={loading}
                displayedCount={favoritesSection.displayedCount}
                totalCount={properties.length}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited}
              />

            {/* All Properties Section - No animation delay for immediate loading */}
            <div id="all-properties-section">
              <AllPropertiesSection
                properties={properties}
                loadingRef={loadingRef}
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={loadMore}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited}
              />
            </div>
          </div>
        )}

        {!loading && hasActiveFilters && filteredProperties.length === 0 && properties.length > 0 && (
          <AnimatedSection delay={0}>
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
