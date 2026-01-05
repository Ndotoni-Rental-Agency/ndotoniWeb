'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/types';
import { LocationItem, fetchLocations, flattenLocations } from '@/lib/locations';

interface SearchBarProps {
  onSearch: (filters: PropertyFilters) => void;
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}

export default function SearchBar({ onSearch, variant = 'hero', isScrolled = false, className = '' }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load locations for autocomplete
    const loadLocations = async () => {
      try {
        const locationsData = await fetchLocations();
        const flattenedLocations = flattenLocations(locationsData);
        setLocations(flattenedLocations);
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    };
    loadLocations();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      
      // Create hierarchical location suggestions
      const regionMatches = new Set<string>();
      const districtMatches = new Set<string>();
      const wardMatches = new Set<string>();
      const specificLocations: LocationItem[] = [];
      
      locations.forEach(location => {
        const regionMatch = location.region?.toLowerCase().includes(query);
        const districtMatch = location.district?.toLowerCase().includes(query);
        const wardMatch = location.ward?.toLowerCase().includes(query);
        
        if (regionMatch || districtMatch || wardMatch) {
          // Add to region matches if region matches
          if (regionMatch) {
            regionMatches.add(location.region);
          }
          
          // Add to district matches if district matches
          if (districtMatch && location.district) {
            districtMatches.add(`${location.region}|${location.district}`);
          }
          
          // Add to ward matches if ward matches
          if (wardMatch && location.ward) {
            wardMatches.add(`${location.region}|${location.district}|${location.ward}`);
          }
          
          // Add specific locations (with streets or most specific available)
          if (location.street || (!regionMatch && !districtMatch && wardMatch)) {
            const key = `${location.region}-${location.district || ''}-${location.ward || ''}-${location.street || ''}`;
            if (!specificLocations.some(loc => 
              `${loc.region}-${loc.district || ''}-${loc.ward || ''}-${loc.street || ''}` === key
            )) {
              specificLocations.push(location);
            }
          }
        }
      });
      
      // Build hierarchical results
      const hierarchicalResults: LocationItem[] = [];
      
      // 1. Add region-only matches
      regionMatches.forEach(region => {
        if (!districtMatches.has(`${region}|`) && !wardMatches.has(`${region}||`)) {
          hierarchicalResults.push({ region });
        }
      });
      
      // 2. Add district-level matches
      districtMatches.forEach(districtKey => {
        const [region, district] = districtKey.split('|');
        if (district && !wardMatches.has(`${region}|${district}|`)) {
          hierarchicalResults.push({ region, district });
        }
      });
      
      // 3. Add ward-level matches
      wardMatches.forEach(wardKey => {
        const [region, district, ward] = wardKey.split('|');
        if (ward) {
          hierarchicalResults.push({ region, district, ward });
        }
      });
      
      // 4. Add specific locations (with streets)
      hierarchicalResults.push(...specificLocations);
      
      // Remove duplicates and limit results
      const uniqueResults = hierarchicalResults.slice(0, 8);
      
      setFilteredLocations(uniqueResults);
      setShowSuggestions(true);
    } else {
      setFilteredLocations([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, locations]);

  // Helper function to get location display info
  const getLocationDisplay = (location: LocationItem) => {
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationClick = (location: LocationItem) => {
    // Navigate directly to search results with selected location
    const locationFilters: PropertyFilters = {};
    if (location.region) locationFilters.region = location.region;
    if (location.district) locationFilters.district = location.district;
    if (location.ward) locationFilters.ward = location.ward;
    
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

  // Sticky variant (simplified)
  if (variant === 'sticky') {
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 sticky-search-backdrop border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${isScrolled ? 'shadow-lg py-3' : 'py-4'} ${className}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative" ref={searchRef}>
            <div className="bg-white dark:bg-gray-800 rounded-full airbnb-search-bar border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-center">
                {/* Where Section */}
                <div className="flex-1 px-8 py-4 relative search-section rounded-l-full">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 text-left">Where</div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Autocomplete Suggestions */}
            {showSuggestions && filteredLocations.length > 0 && (
              <div className="absolute top-full left-8 right-8 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl dropdown-shadow max-h-80 overflow-y-auto z-30 transition-colors">
                {filteredLocations.map((location, index) => {
                  const display = getLocationDisplay(location);
                  return (
                    <button
                      key={`${location.region}-${location.district}-${location.ward}-${location.street}-${index}`}
                      onClick={() => handleLocationClick(location)}
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
                })}
              </div>
            )}

            {/* No results message with search option */}
            {showSuggestions && searchQuery && filteredLocations.length === 0 && (
              <div className="absolute top-full left-8 right-8 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl dropdown-shadow z-30 transition-colors">
                <button
                  onClick={() => {
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
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hero variant (full featured)
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Airbnb-style Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-full airbnb-search-bar border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center">
          {/* Where Section */}
          <div className="flex-1 px-8 py-4 relative search-section rounded-l-full">
            <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 text-left">Where</div>
            <input
              type="text"
              placeholder="Search destinations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Autocomplete Suggestions */}
      {showSuggestions && filteredLocations.length > 0 && (
        <div className="absolute top-full left-8 right-8 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl dropdown-shadow max-h-80 overflow-y-auto z-30 transition-colors">
          {filteredLocations.map((location, index) => {
            const display = getLocationDisplay(location);
            return (
              <button
                key={`${location.region}-${location.district}-${location.ward}-${location.street}-${index}`}
                onClick={() => handleLocationClick(location)}
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
          })}
        </div>
      )}

      {/* No results message with search option */}
      {showSuggestions && searchQuery && filteredLocations.length === 0 && (
        <div className="absolute top-full left-8 right-8 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl dropdown-shadow z-30 transition-colors">
          <button
            onClick={() => {
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
        </div>
      )}
    </div>
  );
}