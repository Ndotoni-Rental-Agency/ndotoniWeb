'use client';

import React, { memo, useMemo } from 'react';
import { useState, useEffect, useCallback } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import SearchBar from '@/components/ui/SearchBar';
import { useScrollPosition } from '@/hooks/useScrollPosition';

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
import { usePropertyFavorites, usePropertyFilters } from '@/hooks/useProperty';
import { useCategorizedProperties, PropertyCategory } from '@/hooks/useCategorizedProperties';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import PropertyLoadingWrapper from '@/components/property/PropertyLoadingWrapper';
import { useFadeIn } from '@/hooks/useFadeIn';
import { CategorizedPropertiesSection } from '@/components/home/CategorizedPropertiesSection';

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
  const { isAuthenticated } = useAuth();
  
  const { filters, clearFilters, setFilters } = usePropertyFilters();
  const { appData, isLoading: loading, error, refetch, loadMoreForCategory, loadCategory, hasMoreForCategory, isCategoryLoaded } = useCategorizedProperties(isAuthenticated);
  const { toggleFavorite, isFavorited } = usePropertyFavorites(appData?.categorizedProperties?.favorites?.properties);
  const isScrolled = useScrollPosition(400); // Balanced threshold for sticky search
  const { setIsScrolled } = useScroll();
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Derive hasActiveFilters from filters
  const hasActiveFilters = useMemo(() => 
    Object.keys(filters).length > 0, 
    [filters]
  );

  // Get all properties for filtering (combine all categories)
  const allProperties = useMemo(() => {
    if (!appData?.categorizedProperties) return [];
    
    const all = [
      ...appData.categorizedProperties.nearby.properties,
      ...appData.categorizedProperties.lowestPrice.properties,
      ...appData.categorizedProperties.mostViewed?.properties || [],
      ...(appData.categorizedProperties.favorites?.properties || [])
    ];
    
    // Remove duplicates by propertyId
    const uniqueProperties = all.filter((property, index, self) => 
      index === self.findIndex(p => p.propertyId === property.propertyId)
    );
    
    return uniqueProperties;
  }, [appData]);

  // Derive filteredProperties from allProperties and filters
  const filteredProperties = useMemo(() => {
    if (!hasActiveFilters) return [];
    
    let filtered = allProperties.filter(p => {
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
  }, [allProperties, filters, hasActiveFilters]);

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

  // Sync scroll state with context
  useEffect(() => {
    setIsScrolled(isScrolled);
  }, [isScrolled, setIsScrolled]);

  // Lazy load additional categories as user scrolls
  useEffect(() => {
    if (!appData || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute('data-category') as PropertyCategory;
            // Only load categories that are supported and not already loaded
            if (category && !isCategoryLoaded(category)) {
              loadCategory(category);
            }
          }
        });
      },
      { rootMargin: '400px' } // Load 400px before the section comes into view
    );

    // Observe category sections
    const sections = document.querySelectorAll('[data-category]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [appData, loading, loadCategory, isCategoryLoaded]);



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
        
        <main className={`max-w-7xl mx-auto px-4 sm:px-3 lg:px-4 py-6 layout-transition ${isScrolled ? 'pt-20' : ''}`}>

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 dark:text-red-400 mb-4 transition-colors">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">Error loading properties</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">Failed to load properties</p>
              <Button onClick={() => refetch()} variant="primary">
                Try Again
              </Button>
            </div>
          )}

          <PropertyLoadingWrapper isLoading={loading} skeletonCount={8}>
            {!hasActiveFilters && appData?.categorizedProperties && (
              <CategorizedPropertiesSection
                nearby={appData.categorizedProperties.nearby}
                lowestPrice={appData.categorizedProperties.lowestPrice}
                mostViewed={appData.categorizedProperties.mostViewed}
                more={appData.categorizedProperties.more}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited}
                isLoading={loading}
                onLoadMoreForCategory={loadMoreForCategory}
                hasMoreForCategory={hasMoreForCategory}
            />
          )}
          </PropertyLoadingWrapper>

          {!loading && hasActiveFilters && filteredProperties.length === 0 && allProperties.length > 0 && (
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
          )}
        </main>
      </div>
  );
}
