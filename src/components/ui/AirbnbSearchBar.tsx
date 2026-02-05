'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';
import { toTitleCase } from '@/utils/common';

interface PropertyFilters {
  region?: string;
  district?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
}

interface AirbnbSearchBarProps {
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}

type SearchSection = 'location' | 'type' | 'price' | 'details' | null;

export default function AirbnbSearchBar({
  variant = 'hero',
  isScrolled = false,
  className = '',
}: AirbnbSearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<SearchSection>(null);
  const [mounted, setMounted] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<FlattenedLocation | null>(null);
  const [propertyType, setPropertyType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [bathrooms, setBathrooms] = useState<number | undefined>();

  const searchRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { results: filteredLocations } = useRegionSearch(searchQuery, 10);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        overlayRef.current &&
        !overlayRef.current.contains(target)
      ) {
        setIsExpanded(false);
        setActiveSection(null);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const handleLocationSelect = (location: FlattenedLocation) => {
    setSelectedLocation(location);
    setSearchQuery(location.displayName);
    setActiveSection('type');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedLocation) {
      if (selectedLocation.type === 'region') {
        params.set('region', selectedLocation.name);
      } else if (selectedLocation.type === 'district' && selectedLocation.regionName) {
        params.set('region', selectedLocation.regionName);
        params.set('district', selectedLocation.name);
      }
    }
    
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange.min) params.set('minPrice', priceRange.min.toString());
    if (priceRange.max) params.set('maxPrice', priceRange.max.toString());
    if (bedrooms) params.set('bedrooms', bedrooms.toString());
    if (bathrooms) params.set('bathrooms', bathrooms.toString());

    setIsExpanded(false);
    setActiveSection(null);
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    setPropertyType('');
    setPriceRange({});
    setBedrooms(undefined);
    setBathrooms(undefined);
    setActiveSection('location');
  };

  // Compact search bar (when not expanded)
  const renderCompactBar = () => (
    <button
      onClick={() => {
        setIsExpanded(true);
        setActiveSection('location');
      }}
      className={`
        w-full bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-200 border border-gray-200 dark:border-gray-700
        ${variant === 'sticky' ? 'py-3 px-6' : 'py-5 px-8'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-left">
            <div className={`font-semibold text-gray-900 dark:text-white ${variant === 'sticky' ? 'text-sm' : 'text-base'}`}>
              {selectedLocation ? toTitleCase(selectedLocation.displayName) : t('search.whereQuestion')}
            </div>
            {(propertyType || bedrooms || priceRange.min || priceRange.max) && (
              <div className={`text-gray-500 dark:text-gray-400 ${variant === 'sticky' ? 'text-xs' : 'text-sm'}`}>
                {[
                  propertyType && toTitleCase(propertyType),
                  bedrooms && `${bedrooms} bed`,
                  (priceRange.min || priceRange.max) && 'Price set'
                ].filter(Boolean).join(' • ')}
              </div>
            )}
          </div>
        </div>
        <div className={`bg-red-500 text-white rounded-full ${variant === 'sticky' ? 'p-2.5' : 'p-3'}`}>
          <svg className={`${variant === 'sticky' ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </button>
  );

  // Expanded search sections
  const renderExpandedBar = () => (
    <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-stretch divide-x divide-gray-200 dark:divide-gray-700">
        {/* Location Section */}
        <button
          onClick={() => setActiveSection('location')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'location' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
          `}
        >
          <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">Where</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {selectedLocation ? toTitleCase(selectedLocation.displayName) : 'Search locations'}
          </div>
        </button>

        {/* Property Type Section */}
        <button
          onClick={() => setActiveSection('type')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'type' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
          `}
        >
          <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">Type</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {propertyType ? toTitleCase(propertyType) : 'Any type'}
          </div>
        </button>

        {/* Price Section */}
        <button
          onClick={() => setActiveSection('price')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'price' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
          `}
        >
          <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">Price</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {priceRange.min || priceRange.max 
              ? `${priceRange.min ? `${priceRange.min.toLocaleString()}` : '0'} - ${priceRange.max ? `${priceRange.max.toLocaleString()}` : '∞'}`
              : 'Any price'}
          </div>
        </button>

        {/* Details Section */}
        <button
          onClick={() => setActiveSection('details')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'details' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
          `}
        >
          <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">Details</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {bedrooms || bathrooms 
              ? [bedrooms && `${bedrooms} bed`, bathrooms && `${bathrooms} bath`].filter(Boolean).join(', ')
              : 'Add details'}
          </div>
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-8 bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Dropdown content based on active section
  const renderDropdownContent = () => {
    if (!activeSection) return null;

    return (
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-h-[400px] overflow-y-auto">
        {activeSection === 'location' && (
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a region or district..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              autoFocus
            />
            <div className="space-y-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <button
                    key={`${location.type}-${location.name}-${index}`}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {toTitleCase(location.displayName)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {location.type === 'region' ? 'Region' : 'District'}
                    </div>
                  </button>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No locations found
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Start typing to search locations
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'type' && (
          <div className="grid grid-cols-2 gap-3">
            {['Apartment', 'House', 'Studio', 'Room'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setPropertyType(type.toUpperCase());
                  setActiveSection('price');
                }}
                className={`
                  px-6 py-4 rounded-xl border-2 transition-all text-left
                  ${propertyType === type.toUpperCase()
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="font-semibold text-gray-900 dark:text-white">{type}</div>
              </button>
            ))}
          </div>
        )}

        {activeSection === 'price' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Price (TZS)
              </label>
              <input
                type="number"
                value={priceRange.min || ''}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Price (TZS)
              </label>
              <input
                type="number"
                value={priceRange.max || ''}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="No limit"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        )}

        {activeSection === 'details' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Bedrooms
              </label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBedrooms(bedrooms === num ? undefined : num)}
                    className={`
                      w-12 h-12 rounded-full border-2 transition-all font-semibold
                      ${bedrooms === num
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Bathrooms
              </label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBathrooms(bathrooms === num ? undefined : num)}
                    className={`
                      w-12 h-12 rounded-full border-2 transition-all font-semibold
                      ${bathrooms === num
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
          >
            Clear all
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    );
  };

  // Overlay backdrop
  const renderOverlay = () => {
    if (!mounted || !isExpanded) return null;

    return createPortal(
      <>
        <div
          className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
          onClick={() => {
            setIsExpanded(false);
            setActiveSection(null);
          }}
        />
        <div
          ref={overlayRef}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-4xl px-4"
        >
          {renderExpandedBar()}
          {renderDropdownContent()}
        </div>
      </>,
      document.body
    );
  };

  return (
    <>
      <div
        ref={searchRef}
        className={`relative ${className}`}
      >
        {!isExpanded ? renderCompactBar() : null}
      </div>
      {renderOverlay()}
    </>
  );
}
