'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
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
import { SearchOptimizedLocationItem } from '@/lib/location';
import { useDebouncedLocationSearch } from '@/hooks/useLocationSearch';

// Custom hook for debouncing values (keeping for potential other uses)
function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  
  return debounced;
}

interface SearchBarProps {
  onSearch: (filters: PropertyFilters) => void;
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}

export default function SearchBar({ onSearch, variant = 'hero', isScrolled = false, className = '' }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  // Use the debounced location search hook
  const { results: filteredLocations, isLoading } = useDebouncedLocationSearch(searchQuery, 200);

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position when showing suggestions
  useEffect(() => {
    if (showSuggestions && searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 12, // 12px = mt-3 gap
        left: rect.left + 32, // 32px = left-8 padding to align with input
        width: rect.width - 64 // subtract left-8 and right-8 padding
      });
    }
  }, [showSuggestions, searchQuery]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!showSuggestions) return;

    const updatePosition = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 12,
          left: rect.left + 32,
          width: rect.width - 64
        });
      }
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showSuggestions]);

  // Update suggestions visibility based on search query
  useEffect(() => {
    setShowSuggestions(searchQuery.length > 0);
  }, [searchQuery]);

  // Helper function to get location display info
  const getLocationDisplay = (location: SearchOptimizedLocationItem) => {
    if (location.street) {
      return {
        primary: location.street,
        secondary: [location.ward, location.district, location.region].filter(Boolean).join(', '),
        icon: 'street'
      };
    } else if (location.ward) {
      return {
        primary: location.ward,
        secondary: [location.district, location.region].filter(Boolean).join(', '),
        icon: 'ward'
      };
    } else if (location.district) {
      return {
        primary: location.district,
        secondary: location.region,
        icon: 'district'
      };
    } else {
      return {
        primary: location.region,
        secondary: 'Region',
        icon: 'region'
      };
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside both the search bar and the dropdown
      if (
        searchRef.current && 
        !searchRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationClick = (location: SearchOptimizedLocationItem) => {
    // Navigate directly to search results with selected location
    const locationFilters: PropertyFilters = {};
    if (location.region) locationFilters.region = location.region;
    if (location.district) locationFilters.district = location.district;
    if (location.ward) locationFilters.ward = location.ward;
    
    // Close suggestions and navigate
    setShowSuggestions(false);
    router.push(buildSearchUrl(locationFilters));
  };

  const buildSearchUrl = (additionalFilters: PropertyFilters = {}) => {
    const searchParams = new URLSearchParams();
    
    // Add location filters from search query if no specific location filters provided
    if (searchQuery.trim() && !additionalFilters.region && !additionalFilters.district && !additionalFilters.ward) {
      if (filteredLocations.length > 0) {
        const location = filteredLocations[0];
        if (location.region) searchParams.set('region', location.region);
        if (location.district) searchParams.set('district', location.district);
        if (location.ward) searchParams.set('ward', location.ward);
      } else {
        searchParams.set('q', searchQuery.trim());
      }
    }

    // Add any additional filters
    Object.entries(additionalFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value.toString());
      }
    });

    return `/search?${searchParams.toString()}`;
  };

  const handleSearch = () => {
    router.push(buildSearchUrl());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Render dropdown suggestions using portal
  const renderDropdown = () => {
    if (!mounted || !showSuggestions) return null;

    const dropdownContent = (
      <div 
        ref={dropdownRef}
        className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl dropdown-shadow max-h-80 overflow-y-auto transition-colors"
        style={{ 
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 99999
        }}
      >
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location, index) => {
            const display = getLocationDisplay(location);
            return (
              <button
                key={`${location.region}-${location.district}-${location.ward}-${location.street}-${index}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLocationClick(location);
                }}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-150 first:rounded-t-3xl last:rounded-b-3xl group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
                    <svg className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{display.primary}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{display.secondary}</div>
                  </div>
                </div>
              </button>
            );
          })
        ) : searchQuery ? (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSuggestions(false);
              const searchParams = new URLSearchParams();
              searchParams.set('q', searchQuery.trim());
              router.push(`/search?${searchParams.toString()}`);
            }}
            className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 rounded-3xl group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Search for "{searchQuery}"
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Find properties matching your search</div>
              </div>
            </div>
          </button>
        ) : null}
      </div>
    );

    return createPortal(dropdownContent, document.body);
  };

  // Sticky variant (simplified)
  if (variant === 'sticky') {
    return (
      <>
        <div className={`fixed top-0 left-0 right-0 sticky-search-backdrop border-b border-gray-200 dark:border-gray-700 transition-all duration-300 transform animate-slide-down ${isScrolled ? 'shadow-lg py-3' : 'py-4'} ${className}`} style={{ zIndex: 10000 }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative" ref={searchRef}>
              <div className="bg-white dark:bg-gray-800 rounded-full airbnb-search-bar border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center">
                  {/* Where Section */}
                  <div className="flex-1 px-8 py-4 relative search-section rounded-l-full">
                    <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 text-left">Where</div>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search destinations"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.length > 0) {
                          setShowSuggestions(true);
                        } else {
                          setShowSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (searchQuery) setShowSuggestions(true);
                      }}
                      onKeyDown={handleKeyPress}
                      className="w-full text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 border-none outline-none bg-transparent text-left transition-colors"
                    />
                  </div>

                  {/* Search Button */}
                  <div className="pr-2">
                    <button 
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl md:hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderDropdown()}
      </>
    );
  }

  // Hero variant (full featured)
  return (
    <>
      <div className={`relative ${className}`} ref={searchRef}>
        {/* Airbnb-style Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-full airbnb-search-bar border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            {/* Where Section */}
            <div className="flex-1 px-8 py-4 relative search-section rounded-l-full">
              <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 text-left">Where</div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search Locations"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) {
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery) setShowSuggestions(true);
                }}
                onKeyDown={handleKeyPress}
                className="w-full text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 border-none outline-none bg-transparent text-left transition-colors"
              />
            </div>

            {/* Search Button */}
            <div className="pr-2">
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl md:hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {renderDropdown()}
    </>
  );
}