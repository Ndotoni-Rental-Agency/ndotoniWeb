'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRentalType } from '@/hooks/useRentalType';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';
import { toTitleCase } from '@/lib/utils/common';
import { RentalType } from '@/config/features';
import ClickableDateInput from '@/components/ui/ClickableDateInput';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';

interface SimpleSearchBarProps {
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}

type SearchSection = 'location' | 'dates' | null;

export default function SimpleSearchBar({
  variant = 'hero',
  isScrolled = false,
  className = '',
}: SimpleSearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { rentalType } = useRentalType();
  const isShortTerm = rentalType === RentalType.SHORT_TERM;

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<SearchSection>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<FlattenedLocation | null>(null);
  
  // Date selection for short-term stays
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  
  // Move-in date for long-term stays
  const [moveInDate, setMoveInDate] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { results: filteredLocations } = useRegionSearch(searchQuery, 10);

  useEffect(() => setMounted(true), []);

  // Reset dates when rental type changes
  useEffect(() => {
    setCheckInDate('');
    setCheckOutDate('');
    setMoveInDate('');
    // Close expanded view if open
    if (isExpanded) {
      setIsExpanded(false);
      setActiveSection(null);
    }
  }, [rentalType]); // eslint-disable-line react-hooks/exhaustive-deps

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
    
    // Move to dates section for both types
    setActiveSection('dates');
  };

  const navigateToSearch = (location?: FlattenedLocation) => {
    const loc = location || selectedLocation;
    if (!loc) return;

    const params = new URLSearchParams();
    if (loc.type === 'region') {
      params.set('region', loc.name);
    } else if (loc.type === 'district' && loc.regionName) {
      params.set('region', loc.regionName);
      params.set('district', loc.name);
    }
    
    // Add dates for short-term stays or move-in date for long-term
    if (isShortTerm) {
      if (checkInDate) params.set('checkIn', checkInDate);
      if (checkOutDate) params.set('checkOut', checkOutDate);
    } else {
      if (moveInDate) params.set('moveInDate', moveInDate);
    }
    
    setIsExpanded(false);
    setActiveSection(null);
    
    // Route to /search for long-term or /search-short-stay for short-term
    const searchPath = isShortTerm ? '/search-short-stay' : '/search';
    router.push(`${searchPath}?${params.toString()}`);
  };

  const handleSearch = () => {
    if (!selectedLocation) {
      setActiveSection('location');
      return;
    }
    navigateToSearch();
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    setCheckInDate('');
    setCheckOutDate('');
    setMoveInDate('');
    setActiveSection('location');
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum checkout date (day after check-in)
  const getMinCheckOutDate = () => {
    if (!checkInDate) return getMinDate();
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Compact search bar (when not expanded)
  const renderCompactBar = () => {
    if (isShortTerm) {
      // Short-term: Show location and dates
      return (
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
              <div className="text-left flex-1">
                <div className={`font-semibold text-gray-900 dark:text-white ${variant === 'sticky' ? 'text-sm' : 'text-base'}`}>
                  {selectedLocation ? toTitleCase(selectedLocation.displayName) : 'Where'}
                </div>
                {(checkInDate || checkOutDate) && (
                  <div className={`text-gray-500 dark:text-gray-400 ${variant === 'sticky' ? 'text-xs' : 'text-sm'}`}>
                    {checkInDate && checkOutDate 
                      ? `${formatDateDisplay(checkInDate)} - ${formatDateDisplay(checkOutDate)}`
                      : checkInDate 
                        ? `From ${formatDateDisplay(checkInDate)}`
                        : 'Add dates'}
                  </div>
                )}
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
    }

    // Long-term: Show location and move-in date
    return (
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
            <div className="text-left flex-1">
              <div className={`font-semibold text-gray-900 dark:text-white ${variant === 'sticky' ? 'text-sm' : 'text-base'}`}>
                {selectedLocation ? toTitleCase(selectedLocation.displayName) : variant === 'sticky' ? t('search.whereShort') : t('search.whereQuestion')}
              </div>
              {moveInDate && (
                <div className={`text-gray-500 dark:text-gray-400 ${variant === 'sticky' ? 'text-xs' : 'text-sm'}`}>
                  Move in: {formatDateDisplay(moveInDate)}
                </div>
              )}
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
  };

  // Expanded search bar for short-term
  const renderExpandedBarShortTerm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-stretch divide-x divide-gray-200 dark:divide-gray-700">
        {/* Location Section */}
        <button
          onClick={() => setActiveSection('location')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'location' ? 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700' : ''}
          `}
        >
          <div className={`text-xs font-semibold mb-1.5 ${activeSection === 'location' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Where</div>
          <div className={`text-sm truncate ${activeSection === 'location' ? 'text-gray-200 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {selectedLocation ? toTitleCase(selectedLocation.displayName) : 'Search locations'}
          </div>
        </button>

        {/* Dates Section */}
        <button
          onClick={() => setActiveSection('dates')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'dates' ? 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700' : ''}
          `}
        >
          <div className={`text-xs font-semibold mb-1.5 ${activeSection === 'dates' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>When</div>
          <div className={`text-sm truncate ${activeSection === 'dates' ? 'text-gray-200 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {checkInDate && checkOutDate 
              ? `${formatDateDisplay(checkInDate)} - ${formatDateDisplay(checkOutDate)}`
              : 'Add dates'}
          </div>
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-8 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700 hover:from-gray-800 hover:to-black dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white transition-all flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Expanded search bar for long-term
  const renderExpandedBarLongTerm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-stretch divide-x divide-gray-200 dark:divide-gray-700">
        {/* Location Section */}
        <button
          onClick={() => setActiveSection('location')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'location' ? 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700' : ''}
          `}
        >
          <div className={`text-xs font-semibold mb-1.5 ${activeSection === 'location' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Where</div>
          <div className={`text-sm truncate ${activeSection === 'location' ? 'text-gray-200 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {selectedLocation ? toTitleCase(selectedLocation.displayName) : 'Search locations'}
          </div>
        </button>

        {/* Move-in Date Section */}
        <button
          onClick={() => setActiveSection('dates')}
          className={`
            flex-1 px-8 py-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors
            ${activeSection === 'dates' ? 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700' : ''}
          `}
        >
          <div className={`text-xs font-semibold mb-1.5 ${activeSection === 'dates' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Move-in</div>
          <div className={`text-sm truncate ${activeSection === 'dates' ? 'text-gray-200 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {moveInDate ? formatDateDisplay(moveInDate) : 'Add date'}
          </div>
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-8 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700 hover:from-gray-800 hover:to-black dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white transition-all flex items-center justify-center"
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
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-h-[600px] overflow-visible">
        {activeSection === 'location' && (
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
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
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

        {activeSection === 'dates' && isShortTerm && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Check-in <span className="text-red-500">*</span>
              </label>
              <CalendarDatePicker
                label=""
                value={checkInDate}
                onChange={(value) => {
                  setCheckInDate(value);
                  // Clear checkout if it's before new check-in
                  if (checkOutDate && value >= checkOutDate) {
                    setCheckOutDate('');
                  }
                }}
                min={getMinDate()}
                placeholder="Select check-in date"
                rangeStart={checkInDate}
                rangeEnd={checkOutDate}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Check-out <span className="text-red-500">*</span>
              </label>
              <CalendarDatePicker
                label=""
                value={checkOutDate}
                onChange={setCheckOutDate}
                min={getMinCheckOutDate()}
                placeholder="Select check-out date"
                disabled={!checkInDate}
                rangeStart={checkInDate}
                rangeEnd={checkOutDate}
              />
              {!checkInDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Select check-in date first
                </p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'dates' && !isShortTerm && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Move-in Date
            </label>
            <CalendarDatePicker
              label=""
              value={moveInDate}
              onChange={setMoveInDate}
              min={getMinDate()}
              placeholder="Select move-in date"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              When would you like to move in? (Optional)
            </p>
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
            className="px-6 py-2.5 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-emerald-600 dark:to-emerald-700 hover:from-gray-800 hover:to-black dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </div>
    );
  };

  // Unified modal for long-term (simple location search)
  const renderExpandedModalLongTerm = () => (
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
          onClick={() => {
            setIsExpanded(false);
            setActiveSection(null);
          }}
        />
        <div
          ref={overlayRef}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-4xl px-4"
        >
          {isShortTerm ? renderExpandedBarShortTerm() : renderExpandedBarLongTerm()}
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
