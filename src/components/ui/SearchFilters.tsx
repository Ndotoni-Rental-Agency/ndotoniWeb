'use client';

import React, { useState, useEffect } from 'react';
import FiltersModal from './FiltersModal';
import { PriceSortToggle } from '@/components/ui';
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
import { LocationItem, getUniqueRegions, getDistrictsByRegion, getWardsByDistrict } from '@/lib/location';

interface SearchFiltersProps {
  locations: LocationItem[];
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export default function SearchFilters({ locations, filters, onFiltersChange }: SearchFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    setRegions(getUniqueRegions(locations));
  }, [locations]);

  useEffect(() => {
    if (filters.region) {
      setDistricts(getDistrictsByRegion(locations, filters.region));
    } else {
      setDistricts([]);
    }
  }, [filters.region, locations]);

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
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Count advanced filters (excluding basic location and type filters)
  const advancedFiltersCount = Object.keys(filters).filter(key => 
    !['region', 'district', 'ward', 'propertyType', 'priceSort'].includes(key)
  ).length;

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {/* Location Filter */}
          <div className="flex-shrink-0">
            <label htmlFor="region-select" className="sr-only">Select Region</label>
            <select
              id="region-select"
              value={filters.region || ''}
              onChange={(e) => updateFilter('region', e.target.value || undefined)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
              aria-label="Filter by region"
            >
              <option value="">Location</option>
              {regions.map((region: string) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {filters.region && (
            <div className="flex-shrink-0">
              <label htmlFor="district-select" className="sr-only">Select District</label>
              <select
                id="district-select"
                value={filters.district || ''}
                onChange={(e) => updateFilter('district', e.target.value || undefined)}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
                aria-label="Filter by district"
              >
                <option value="">District</option>
                {districts.map((district: string) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          )}

          {/* Property Type Filter */}
          <div className="flex-shrink-0">
            <label htmlFor="property-type-select" className="sr-only">Select Property Type</label>
            <select
              id="property-type-select"
              value={filters.propertyType || ''}
              onChange={(e) => updateFilter('propertyType', e.target.value || undefined)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
              aria-label="Filter by property type"
            >
              <option value="">Type</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="STUDIO">Studio</option>
              <option value="ROOM">Room</option>
            </select>
          </div>

          {/* Price Sort Toggle */}
          <div className="flex-shrink-0">
            <PriceSortToggle
              sortOrder={filters.priceSort}
              onSortChange={(order) => updateFilter('priceSort', order)}
            />
          </div>

          {/* More Filters Modal Trigger */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors flex items-center space-x-2 relative"
              aria-label="Open additional filters modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>Filters</span>
              {advancedFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {advancedFiltersCount}
                </span>
              )}
            </button>
          </div>

          {hasActiveFilters && (
            <div className="flex-shrink-0">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                aria-label="Clear all active filters"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
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