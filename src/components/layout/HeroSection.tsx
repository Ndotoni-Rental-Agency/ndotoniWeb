'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';
import { HousingRequestModal } from '@/components/housing/HousingRequestModal';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { useRentalType } from '@/hooks/useRentalType';
import { RentalType } from '@/config/features';
import { toTitleCase } from '@/lib/utils/common';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';

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

interface HeroSectionProps {
  onSearch: (filters: PropertyFilters) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { t, language } = useLanguage();
  const { isOpen, openModal, closeModal, titleId } = useHousingRequestModal();
  const router = useRouter();
  const { rentalType } = useRentalType();
  const isShortTerm = rentalType === RentalType.SHORT_TERM;

  // Search state
  const [searchQuery, setSearchQuery] = useState('Dar es Salaam');
  const [selectedLocation, setSelectedLocation] = useState<FlattenedLocation | null>({ type: 'region', name: 'DAR ES SALAAM', displayName: 'Dar es Salaam' } as FlattenedLocation);
  const [moveInDate, setMoveInDate] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results: filteredLocations } = useRegionSearch(searchQuery, 8);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: FlattenedLocation) => {
    setSelectedLocation(location);
    setSearchQuery(toTitleCase(location.displayName));
    setShowLocationDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (selectedLocation) {
      if (selectedLocation.type === 'region') {
        params.set('region', selectedLocation.name);
      } else if (selectedLocation.type === 'district' && selectedLocation.regionName) {
        params.set('region', selectedLocation.regionName);
        params.set('district', selectedLocation.name);
      }
    }

    if (isShortTerm) {
      if (checkInDate) params.set('checkIn', checkInDate);
      if (checkOutDate) params.set('checkOut', checkOutDate);
      router.push(`/search-short-stay?${params.toString()}`);
    } else {
      if (moveInDate) params.set('moveInDate', moveInDate);
      router.push(`/search?${params.toString()}`);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background image — img tag for natural sizing like ndotoniStays */}
        <div className="absolute inset-0">
          <img
            src="https://d3qiuw9agheakm.cloudfront.net/image/28214330-80c1-7048-64a8-0e745f9e5c39/dgyZmIWNX3kA-hero3.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] mb-5">
              {t('hero.titleBefore')}{' '}
              <span className="text-brand-300">{t('hero.titleHighlight')}</span>{' '}
              {t('hero.titleAfter')}
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Search Card — white card style like ndotoniStays */}
          <form onSubmit={handleSearch} className="mt-2 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Location */}
                <div className="relative lg:col-span-1" ref={dropdownRef}>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedLocation(null);
                        setShowLocationDropdown(true);
                      }}
                      onFocus={() => {
                        setSearchQuery('');
                        setSelectedLocation(null);
                        setShowLocationDropdown(true);
                      }}
                      placeholder={t('search.wherePlaceholder') || 'Where?'}
                      className="w-full rounded-xl bg-ink-50 dark:bg-gray-700 border-0 pl-10 pr-4 py-3.5 text-sm text-ink-900 dark:text-white font-medium placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      aria-label="Location"
                    />
                  </div>

                  {/* Location modal — rendered as portal, centered like CalendarDatePicker */}
                  {showLocationDropdown && filteredLocations.length > 0 && mounted && createPortal(
                    <>
                      <div
                        className="fixed inset-0 bg-black/40 z-[9998]"
                        onClick={() => setShowLocationDropdown(false)}
                      />
                      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-stone-200 dark:border-gray-700 w-full max-w-md max-h-[70vh] overflow-y-auto pointer-events-auto">
                          <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 pt-4 pb-2 border-b border-stone-100 dark:border-gray-700">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSelectedLocation(null);
                              }}
                              placeholder={t('search.wherePlaceholder') || 'Search region or district...'}
                              className="w-full rounded-xl bg-ink-50 dark:bg-gray-700 border-0 px-4 py-3 text-sm text-ink-900 dark:text-white font-medium placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                              autoFocus
                            />
                          </div>
                          <div className="p-2">
                            {filteredLocations.map((location, index) => (
                              <button
                                key={`${location.type}-${location.name}-${index}`}
                                type="button"
                                onClick={() => handleLocationSelect(location)}
                                className="w-full px-4 py-3 text-left hover:bg-ink-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                              >
                                <div className="text-sm font-medium text-ink-900 dark:text-white">
                                  {toTitleCase(location.displayName)}
                                </div>
                                <div className="text-xs text-ink-500 dark:text-gray-400">
                                  {location.type === 'region' ? 'Region' : 'District'}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>,
                    document.body
                  )}
                </div>

                {/* Date fields */}
                {isShortTerm ? (
                  <>
                    {/* Check-in */}
                    <CalendarDatePicker
                      value={checkInDate}
                      onChange={(val) => {
                        setCheckInDate(val);
                        if (checkOutDate && val >= checkOutDate) setCheckOutDate('');
                      }}
                      min={getMinDate()}
                      label="Check-in"
                      placeholder="Check-in"
                      rangeStart={checkInDate}
                      rangeEnd={checkOutDate}
                    />
                    {/* Check-out */}
                    <CalendarDatePicker
                      value={checkOutDate}
                      onChange={setCheckOutDate}
                      min={checkInDate || getMinDate()}
                      label="Check-out"
                      placeholder="Check-out"
                      disabled={!checkInDate}
                      rangeStart={checkInDate}
                      rangeEnd={checkOutDate}
                    />
                  </>
                ) : (
                  /* Move-in date for long-term */
                  <div className="lg:col-span-2">
                    <CalendarDatePicker
                      value={moveInDate}
                      onChange={setMoveInDate}
                      min={getMinDate()}
                      label=""
                      placeholder="Move-in date"
                    />
                  </div>
                )}

                {/* Search Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/30 transition-all active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{t('search.searchButton')}</span>
                </button>
              </div>
            </div>

            {/* Quick action chips below search */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <a
                href="https://wa.me/255790720329?text=Habari%2C%20natafuta%20nyumba%20Dar%20es%20salaam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-sm text-white/90 hover:bg-white/25 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                {t('hero.sendWhatsApp')}
              </a>
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-sm text-white/90 hover:bg-white/25 transition-colors"
              >
                {t('hero.cantFind')}
              </button>
            </div>
          </form>


        </div>
      </section>

      <HousingRequestModal isOpen={isOpen} onClose={closeModal} titleId={titleId} />
    </>
  );
}
