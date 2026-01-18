'use client';

import { useState, useEffect, useCallback } from 'react';
import { useHierarchicalLocation } from '@/hooks/useHierarchicalLocation';
import LocationPreview from './LocationPreview';

interface LocationSelectorProps {
  value: {
    region: string;
    district: string;
    ward?: string;
    street?: string;
  };
  onChange: (location: {
    region: string;
    district: string;
    ward?: string;
    street?: string;
  }) => void;
  required?: boolean;
  className?: string;
}

export default function LocationSelector({ 
  value, 
  onChange, 
  required = false,
  className = '' 
}: LocationSelectorProps) {
  const [showCustomStreet, setShowCustomStreet] = useState(false);
  
  // Use hierarchical location hook
  const {
    regions,
    districts,
    wards,
    streets,
    selected,
    selectRegion,
    selectDistrict,
    selectWard,
    loadingRegions,
    loadingStreets,
    error
  } = useHierarchicalLocation();

  // Sync selected locations with form value
  useEffect(() => {
    if (value.region && !selected.region) {
      const region = regions.find(r => r.name === value.region);
      if (region) selectRegion(region);
    }
  }, [value.region, regions, selected.region]);

  useEffect(() => {
    if (value.district && selected.region && !selected.district) {
      const district = districts.find(d => d.name === value.district);
      if (district) selectDistrict(district);
    }
  }, [value.district, districts, selected.district, selected.region]);

  useEffect(() => {
    if (value.ward && selected.district && !selected.ward) {
      const ward = wards.find(w => w.name === value.ward);
      if (ward) selectWard(ward);
    }
  }, [value.ward, wards, selected.ward, selected.district]);

  // Check if there are streets available
  useEffect(() => {
    if (selected.ward && streets.length === 0 && !loadingStreets) {
      setShowCustomStreet(true);
    } else if (streets.length > 0) {
      setShowCustomStreet(false);
    }
  }, [selected.ward, streets.length, loadingStreets]);

  const handleRegionChange = useCallback((regionName: string) => {
    const region = regions.find(r => r.name === regionName);
    if (region) {
      selectRegion(region);
    } else {
      selectRegion(null);
    }
    onChange({
      region: regionName,
      district: '',
      ward: '',
      street: ''
    });
  }, [onChange, regions, selectRegion]);

  const handleDistrictChange = useCallback((districtName: string) => {
    const district = districts.find(d => d.name === districtName);
    if (district) {
      selectDistrict(district);
    } else {
      selectDistrict(null);
    }
    onChange({
      ...value,
      district: districtName,
      ward: '',
      street: ''
    });
  }, [onChange, value, districts, selectDistrict]);

  const handleWardChange = useCallback((wardName: string) => {
    const ward = wards.find(w => w.name === wardName);
    if (ward) {
      selectWard(ward);
    } else {
      selectWard(null);
    }
    onChange({
      ...value,
      ward: wardName,
      street: ''
    });
    setShowCustomStreet(false);
  }, [onChange, value, wards, selectWard]);

  const handleStreetChange = useCallback((street: string) => {
    onChange({
      ...value,
      street
    });
  }, [onChange, value]);

  const handleStreetDropdownChange = useCallback((street: string) => {
    if (street === 'custom') {
      setShowCustomStreet(true);
      onChange({
        ...value,
        street: ''
      });
    } else {
      setShowCustomStreet(false);
      onChange({
        ...value,
        street
      });
    }
  }, [onChange, value]);

  if (loadingRegions) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 transition-colors"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded transition-colors"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 transition-colors"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded transition-colors"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Region {required && '*'}
          </label>
          <select
            value={value.region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            required={required}
          >
            <option value="">Select Region</option>
            {regions.map(region => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            District {required && '*'}
          </label>
          <select
            value={value.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!value.region || districts.length === 0}
            required={required}
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Ward
          </label>
          <select
            value={value.ward || ''}
            onChange={(e) => handleWardChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!value.district || wards.length === 0}
          >
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward.id} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Street Address
          </label>
          {value.ward && streets.length > 0 && !showCustomStreet ? (
            <div className="space-y-2">
              <select
                value={value.street || ''}
                onChange={(e) => handleStreetDropdownChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <option value="">Select Street</option>
                {streets.map(street => (
                  <option key={street.id} value={street.name}>
                    {street.name}
                  </option>
                ))}
                <option value="custom">Other (Enter custom street)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={value.street || ''}
                onChange={(e) => handleStreetChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="e.g., Haile Selassie Road"
              />
              {value.ward && streets.length > 0 && showCustomStreet && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomStreet(false);
                    onChange({ ...value, street: '' });
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
                >
                  Choose from available streets instead
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Location Preview */}
      {(value.region && value.district) && (
        <LocationPreview
          region={value.region}
          district={value.district}
          ward={value.ward}
          street={value.street}
        />
      )}
    </div>
  );
}