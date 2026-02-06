'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';
import { toTitleCase } from '@/utils/common';

interface SimpleSearchBarProps {
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}

export default function SimpleSearchBar({
  variant = 'hero',
  isScrolled = false,
  className = '',
}: SimpleSearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<FlattenedLocation | null>(null);

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
    
    // Navigate immediately to search page with location
    const params = new URLSearchParams();
    if (location.type === 'region') {
      params.set('region', location.name);
    } else if (location.type === 'district' && location.regionName) {
      params.set('region', location.regionName);
      params.set('district', location.name);
    }
    
    setIsExpanded(false);
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedLocation(null);
  };

  // Compact search bar (when not expanded)
  const renderCompactBar = () => (
    <button
      onClick={() => setIsExpanded(true)}
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
              {selectedLocation ? toTitleCase(selectedLocation.displayName) : variant === 'sticky' ? t('search.whereShort') : t('search.whereQuestion')}
            </div>
          </div>
        </div>
        <div className={`bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700 text-white rounded-full ${variant === 'sticky' ? 'p-2.5' : 'p-3'} hover:from-gray-800 hover:to-black dark:hover:from-emerald-700 dark:hover:to-emerald-800 transition-all`}>
          <svg className={`${variant === 'sticky' ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </button>
  );

  // Unified modal with input at top and results below
  const renderExpandedModal = () => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-h-[500px] overflow-y-auto">
      <div>
        <label className="block text-xs font-semibold mb-2 text-gray-900 dark:text-white">{t('search.where')}</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.wherePlaceholder')}
          className="w-full px-4 py-3 border-2 border-gray-700 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 mb-4 font-medium"
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

      {/* Action buttons */}
      {selectedLocation && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );

  // Overlay backdrop
  const renderOverlay = () => {
    if (!mounted || !isExpanded) return null;

    return createPortal(
      <>
        <div
          className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
        <div
          ref={overlayRef}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-4xl px-4"
        >
          {renderExpandedModal()}
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
