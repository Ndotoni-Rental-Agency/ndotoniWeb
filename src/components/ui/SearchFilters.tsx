'use client';

import { useState, useEffect } from 'react';
import { PropertyFilters } from '@/types';
import { LocationItem, getUniqueRegions, getDistrictsByRegion, getWardsByDistrict } from '@/lib/locations';

interface SearchFiltersProps {
  locations: LocationItem[];
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export default function SearchFilters({ locations, filters, onFiltersChange }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

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

  useEffect(() => {
    if (filters.region && filters.district) {
      setWards(getWardsByDistrict(locations, filters.region, filters.district));
    } else {
      setWards([]);
    }
  }, [filters.region, filters.district, locations]);

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

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof PropertyFilters] !== undefined);

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {/* Location Filter */}
        <div className="flex-shrink-0">
          <select
            value={filters.region || ''}
            onChange={(e) => updateFilter('region', e.target.value || undefined)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
          >
            <option value="">Location</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {filters.region && (
          <div className="flex-shrink-0">
            <select
              value={filters.district || ''}
              onChange={(e) => updateFilter('district', e.target.value || undefined)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
            >
              <option value="">District</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        )}

        {filters.region && filters.district && wards.length > 0 && (
          <div className="flex-shrink-0">
            <select
              value={filters.ward || ''}
              onChange={(e) => updateFilter('ward', e.target.value || undefined)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
            >
              <option value="">Ward/Street</option>
              {wards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          </div>
        )}

        {/* Property Type Filter */}
        <div className="flex-shrink-0">
          <select
            value={filters.propertyType || ''}
            onChange={(e) => updateFilter('propertyType', e.target.value || undefined)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors"
          >
            <option value="">Type</option>
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="STUDIO">Studio</option>
            <option value="ROOM">Room</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors flex items-center space-x-2"
          >
            <span>Price</span>
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* More Filters */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>Filters</span>
          </button>
        </div>

        {hasActiveFilters && (
          <div className="flex-shrink-0">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range (TZS)</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bedrooms</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => updateFilter('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bathrooms</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => updateFilter('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Furnished */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Furnished</label>
              <select
                value={filters.furnished === undefined ? '' : filters.furnished.toString()}
                onChange={(e) => updateFilter('furnished', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="">Any</option>
                <option value="true">Furnished</option>
                <option value="false">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Additional row for date and duration filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Move In Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Move In Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select move-in date"
                  value={filters.moveInDate ? new Date(filters.moveInDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  }) : ''}
                  readOnly
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'date';
                    input.min = new Date().toISOString().split('T')[0];
                    input.value = filters.moveInDate || '';
                    input.onchange = (e) => updateFilter('moveInDate', (e.target as HTMLInputElement).value || undefined);
                    input.click();
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                />
                <svg 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lease Duration</label>
              <select
                value={filters.duration || ''}
                onChange={(e) => updateFilter('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="">Any duration</option>
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">1 year</option>
                <option value="24">2+ years</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}