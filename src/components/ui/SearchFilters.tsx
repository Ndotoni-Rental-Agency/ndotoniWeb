'use client';

import React, { useState, useEffect } from 'react';
import FiltersModal from './FiltersModal';
import { PriceSortToggle } from '@/components/ui';
import { fetchRegions, fetchDistricts, type Region, type District } from '@/lib/location/hierarchical';
import { useLanguage } from '@/contexts/LanguageContext';
import { toTitleCase } from '@/lib/utils/common';

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

interface SearchFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const data = await fetchRegions();
        setRegions(data);
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  // Load districts when region changes
  useEffect(() => {
    if (!filters.region) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        // Find the region ID from the region name
        const region = regions.find(r => r.name === filters.region);
        if (region) {
          const data = await fetchDistricts(region.id);
          setDistricts(data);
        }
      } catch (error) {
        console.error('Error loading districts:', error);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [filters.region, regions]);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Clear dependent filters when parent changes
    if (key === 'region') {
      delete newFilters.district;
      delete newFilters.ward;
    } else if (key === 'district') {
      delete newFilters.ward;
    }
    
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    // Preserve region and district when clearing filters
    const preservedFilters: PropertyFilters = {};
    if (filters.region) preservedFilters.region = filters.region;
    if (filters.district) preservedFilters.district = filters.district;
    
    onFiltersChange(preservedFilters);
  };

  const hasActiveFilters = Object.keys(filters).filter(key => 
    !['region', 'district'].includes(key)
  ).length > 0;

  // Count advanced filters (excluding location filters and basic filters shown in main bar)
  const advancedFiltersCount = Object.keys(filters).filter(key => 
    !['region', 'district', 'ward', 'propertyType', 'priceSort'].includes(key) && filters[key as keyof PropertyFilters] !== undefined
  ).length;

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 pb-2">
          {/* Location Filter */}
          <div className="flex-shrink-0">
            <label htmlFor="region-select" className="sr-only">{sw ? 'Chagua mkoa' : 'Select Region'}</label>
            <select
              id="region-select"
              value={filters.region || ''}
              onChange={(e) => updateFilter('region', e.target.value || undefined)}
              disabled={loadingRegions}
              className="min-h-11 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-ink-900 dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-ink-900 dark:focus:ring-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={sw ? 'Chuja kwa mkoa' : 'Filter by region'}
            >
              <option value="">{loadingRegions ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Mkoa' : 'Region')}</option>
              {regions.map((region) => (
                <option key={region.id} value={region.name}>{toTitleCase(region.name)}</option>
              ))}
            </select>
          </div>

          {filters.region && (
            <div className="flex-shrink-0">
              <label htmlFor="district-select" className="sr-only">{sw ? 'Chagua wilaya' : 'Select District'}</label>
              <select
                id="district-select"
                value={filters.district || ''}
                onChange={(e) => updateFilter('district', e.target.value || undefined)}
                disabled={loadingDistricts || districts.length === 0}
                className="min-h-11 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-ink-900 dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-ink-900 dark:focus:ring-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={sw ? 'Chuja kwa wilaya' : 'Filter by district'}
              >
                <option value="">
                  {loadingDistricts ? (sw ? 'Inapakia…' : 'Loading…') : districts.length === 0 ? (sw ? 'Hakuna wilaya' : 'No districts') : (sw ? 'Wilaya' : 'District')}
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>{toTitleCase(district.name)}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Sort Toggle */}
          <div className="flex-shrink-0">
            <PriceSortToggle
              sortOrder={filters.priceSort}
              onSortChange={(order) => updateFilter('priceSort', order)}
            />
          </div>

          {/* Property Type Filter */}
          <div className="flex-shrink-0">
            <label htmlFor="property-type-select" className="sr-only">{sw ? 'Chagua aina ya nyumba' : 'Select Property Type'}</label>
            <select
              id="property-type-select"
              value={filters.propertyType || ''}
              onChange={(e) => updateFilter('propertyType', e.target.value || undefined)}
              className="min-h-11 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-ink-900 dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-ink-900 dark:focus:ring-white transition-colors"
              aria-label={sw ? 'Chuja kwa aina' : 'Filter by property type'}
            >
              <option value="">{sw ? 'Aina' : 'Type'}</option>
              <option value="APARTMENT">{sw ? 'Ghorofa' : 'Apartment'}</option>
              <option value="HOUSE">{sw ? 'Nyumba' : 'House'}</option>
              <option value="STUDIO">Studio</option>
              <option value="ROOM">{sw ? 'Chumba' : 'Room'}</option>
            </select>
          </div>

          {/* More Filters Modal Trigger */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="min-h-11 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-ink-900 dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-ink-900 dark:focus:ring-white transition-colors flex items-center space-x-2 relative"
              aria-label={sw ? 'Fungua vichujio zaidi' : 'Open additional filters modal'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>{sw ? 'Chuja zaidi' : 'More filters'}</span>
              {advancedFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-ink-900 ring-2 ring-white dark:ring-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {advancedFiltersCount}
                </span>
              )}
            </button>
          </div>

          {hasActiveFilters && (
            <div className="flex-shrink-0">
              <button
                onClick={clearFilters}
                className="min-h-11 px-4 py-2 bg-ink-900 hover:bg-ink-800 text-white rounded-full text-sm font-bold transition-colors dark:bg-white dark:text-ink-900"
                aria-label={sw ? 'Ondoa vichujio' : 'Clear all active filters'}
              >
                {sw ? 'Ondoa vyote' : 'Clear all'}
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Pills */}
        {(filters.bedrooms || filters.bathrooms || filters.minPrice || filters.maxPrice) && (
          <div className="flex items-center space-x-2 mt-3 flex-wrap gap-2">
            {filters.bedrooms && (
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 font-semibold rounded-full text-sm">
                <span>{filters.bedrooms}+ {sw ? 'vyumba' : 'bedrooms'}</span>
                <button
                  onClick={() => updateFilter('bedrooms', undefined)}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand-100 dark:hover:bg-brand-800"
                  aria-label={sw ? 'Ondoa kichujio cha vyumba' : 'Remove bedrooms filter'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {filters.bathrooms && (
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 font-semibold rounded-full text-sm">
                <span>{filters.bathrooms}+ {sw ? 'bafu' : 'bathrooms'}</span>
                <button
                  onClick={() => updateFilter('bathrooms', undefined)}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand-100 dark:hover:bg-brand-800"
                  aria-label={sw ? 'Ondoa kichujio cha bafu' : 'Remove bathrooms filter'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 font-semibold rounded-full text-sm">
                <span>
                  {filters.minPrice ? `${filters.minPrice.toLocaleString()}` : '0'} - {filters.maxPrice ? `${filters.maxPrice.toLocaleString()}` : '∞'} TZS
                </span>
                <button
                  onClick={() => {
                    updateFilter('minPrice', undefined);
                    updateFilter('maxPrice', undefined);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand-100 dark:hover:bg-brand-800"
                  aria-label={sw ? 'Ondoa kichujio cha bei' : 'Remove price filter'}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      <FiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={clearFilters}
      />
    </>
  );
}