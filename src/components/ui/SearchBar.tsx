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

export default function SearchBar({
  variant = 'hero',
  isScrolled = false,
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Location search
  const { results: filteredLocations } = useRegionSearch(searchQuery, 200);

  useEffect(() => setMounted(true), []);

  const updateDropdownPosition = () => {
    if (!searchRef.current) return;
    const rect = searchRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 12,
      left: rect.left + 32,
      width: rect.width - 64,
    });
  };

  useEffect(() => {
    if (showSuggestions) updateDropdownPosition();
  }, [showSuggestions, searchQuery]);

  useEffect(() => {
    if (!showSuggestions) return;
    window.addEventListener('scroll', updateDropdownPosition, { passive: true });
    window.addEventListener('resize', updateDropdownPosition, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
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
    const params = new URLSearchParams();
    if (location.type === 'region') params.set('region', location.name);
    else if (location.type === 'district' && location.regionName) {
      params.set('region', location.regionName);
      params.set('district', location.name);
    }
    setSearchQuery(location.displayName);
    setShowSuggestions(false);
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredLocations.length > 0) {
      handleLocationClick(filteredLocations[0]);
    } else if (e.key === 'Enter' && searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      setShowSuggestions(false);
      router.push(`/search?${params.toString()}`);
    }
  };

  const renderDropdown = () => {
    if (!mounted || !showSuggestions) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl dropdown-shadow max-h-80 overflow-y-auto"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 99999,
        }}
      >
        {filteredLocations.length > 0
          ? filteredLocations.map((location, index) => (
              <button
                key={`${location.type}-${location.name}-${index}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleLocationClick(location);
                }}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {toTitleCase(location.displayName)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {location.type === 'region' ? 'Region' : 'District'}
                </div>
              </button>
            ))
          : searchQuery.trim() && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams();
                  params.set('q', searchQuery.trim());
                  setShowSuggestions(false);
                  router.push(`/search?${params.toString()}`);
                }}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-3xl"
              >
                Search for “{toTitleCase(searchQuery)}”
              </button>
            )}
      </div>,
      document.body
    );
  };

  const inputProps = {
    ref: inputRef,
    type: 'text',
    value: toTitleCase(searchQuery),
    placeholder: t('search.wherePlaceholder'),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setShowSuggestions(true);
    },
    onFocus: () => setShowSuggestions(true),
    onKeyDown: handleKeyPress,
  };

  // Sticky variant
  if (variant === 'sticky') {
    return (
      <>
        <div
          className={`fixed top-0 left-0 right-0 border-b bg-white dark:bg-gray-900 shadow-md z-50 ${className}`}
        >
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div
              className="bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-2 flex items-center"
              ref={searchRef}
            >
              <div className="flex-1">
                <div className="text-xs font-semibold mb-1 text-gray-900 dark:text-white text-left">
                  {t('search.whereQuestion')}
                </div>
                <input
                  {...inputProps}
                  className="w-full text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none text-left"
                />
              </div>
            </div>
          </div>
        </div>
        {renderDropdown()}
      </>
    );
  }

  // Hero variant
  return (
    <>
      <div className={`relative ${className}`} ref={searchRef}>
        <div className="bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="text-xs font-semibold mb-1 text-gray-900 dark:text-white text-left">
            {t('search.whereQuestion')}
          </div>
          <input
            {...inputProps}
            className="w-full text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none text-left"
          />
        </div>
      </div>
      {renderDropdown()}
    </>
  );
}
