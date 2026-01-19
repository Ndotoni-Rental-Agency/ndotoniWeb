'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';

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

interface SearchBarProps {
  onSearch: (filters: PropertyFilters) => void;
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}

export default function SearchBar({ variant = 'hero', isScrolled = false, className = '' }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  // Use the location search hook with fuzzy matching
  const { results: filteredLocations } = useRegionSearch(searchQuery, 200);

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

  const handleLocationClick = (location: FlattenedLocation) => {
    // Navigate directly to search results with selected location
    const searchParams = new URLSearchParams();
    
    if (location.type === 'region') {
      searchParams.set('region', location.name);
    } else if (location.type === 'district' && location.regionName) {
      searchParams.set('region', location.regionName);
      searchParams.set('district', location.name);
    }
    
    // Close suggestions and navigate
    setShowSuggestions(false);
    setSearchQuery(location.displayName);
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredLocations.length > 0) {
      // Select first location on Enter
      handleLocationClick(filteredLocations[0]);
    } else if (e.key === 'Enter' && searchQuery.trim()) {
      // Fallback to general search if no locations match
      const searchParams = new URLSearchParams();
      searchParams.set('q', searchQuery.trim());
      router.push(`/search?${searchParams.toString()}`);
      setShowSuggestions(false);
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
          filteredLocations.map((location, index) => (
            <button
              key={`${location.type}-${location.name}-${index}`}
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
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {location.displayName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {location.type === 'region' ? 'Region' : 'District'}
                  </div>
                </div>
              </div>
            </button>
          ))
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
                <div className="flex items-center px-8 py-4">
                  {/* Where Section */}
                  <div className="flex-1 relative">
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
          <div className="flex items-center px-8 py-4">
            {/* Where Section */}
            <div className="flex-1 relative">
              <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 text-left">Where</div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search a Region"
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
          </div>
        </div>
      </div>
      {renderDropdown()}
    </>
  );
}