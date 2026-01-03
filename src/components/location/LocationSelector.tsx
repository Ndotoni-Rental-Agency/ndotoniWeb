'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLocations, flattenLocations, getUniqueRegions, getDistrictsByRegion, getWardsByDistrict, getStreetsByWard, LocationItem } from '@/lib/locations';
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
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [streets, setStreets] = useState<string[]>([]);
  const [showCustomStreet, setShowCustomStreet] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      setRegions(getUniqueRegions(locations));
    }
  }, [locations]);

  useEffect(() => {
    if (value.region && locations.length > 0) {
      const availableDistricts = getDistrictsByRegion(locations, value.region);
      setDistricts(availableDistricts);
      
      // Reset district if it's not available in the new region
      if (value.district && !availableDistricts.includes(value.district)) {
        onChange({
          ...value,
          district: '',
          ward: '',
          street: ''
        });
      }
    } else {
      setDistricts([]);
    }
  }, [value.region, locations]);

  useEffect(() => {
    if (value.region && value.district && locations.length > 0) {
      const availableWards = getWardsByDistrict(locations, value.region, value.district);
      setWards(availableWards);
      
      // Reset ward if it's not available in the new district
      if (value.ward && !availableWards.includes(value.ward)) {
        onChange({
          ...value,
          ward: '',
          street: ''
        });
      }
    } else {
      setWards([]);
    }
  }, [value.region, value.district, locations]);

  useEffect(() => {
    if (value.region && value.district && value.ward && locations.length > 0) {
      const availableStreets = getStreetsByWard(locations, value.region, value.district, value.ward);
      setStreets(availableStreets);
      
      // If there are no predefined streets, show custom input
      if (availableStreets.length === 0) {
        setShowCustomStreet(true);
      } else {
        setShowCustomStreet(false);
        // Reset street if it's not available in the new ward
        if (value.street && !availableStreets.includes(value.street)) {
          onChange({
            ...value,
            street: ''
          });
        }
      }
    } else {
      setStreets([]);
      setShowCustomStreet(false);
    }
  }, [value.region, value.district, value.ward, locations]);

  const loadLocations = async () => {
    try {
      const locationsData = await fetchLocations();
      const flattenedLocations = flattenLocations(locationsData);
      setLocations(flattenedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback to mock data if API fails
      const mockLocations: LocationItem[] = [
        { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Masaki', street: 'Haile Selassie Road' },
        { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Masaki', street: 'Toure Drive' },
        { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Masaki', street: 'Msimbazi Street' },
        { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mikocheni', street: 'Mikocheni B' },
        { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mikocheni', street: 'Mikocheni A' },
        { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Oyster Bay', street: 'Oyster Bay Road' },
        { region: 'Dar es Salaam', district: 'Ilala', ward: 'Upanga West', street: 'Upanga Road' },
        { region: 'Dar es Salaam', district: 'Ilala', ward: 'Upanga East', street: 'Jamhuri Street' },
        { region: 'Dar es Salaam', district: 'Temeke', ward: 'Chang\'ombe' },
        { region: 'Arusha', district: 'Arusha City', ward: 'Kaloleni' },
        { region: 'Mwanza', district: 'Nyamagana', ward: 'Pamba' },
      ];

      setLocations(mockLocations);
      setRegions(getUniqueRegions(mockLocations));
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = useCallback((region: string) => {
    onChange({
      region,
      district: '',
      ward: '',
      street: ''
    });
  }, [onChange]);

  const handleDistrictChange = useCallback((district: string) => {
    onChange({
      ...value,
      district,
      ward: '',
      street: ''
    });
  }, [onChange, value]);

  const handleWardChange = useCallback((ward: string) => {
    onChange({
      ...value,
      ward,
      street: ''
    });
    setShowCustomStreet(false);
  }, [onChange, value]);

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

  if (loading) {
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
              <option key={region} value={region}>
                {region}
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
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Ward {required && '*'}
          </label>
          <select
            value={value.ward || ''}
            onChange={(e) => handleWardChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!value.district || wards.length === 0}
            required={required}
          >
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward} value={ward}>
                {ward}
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
                  <option key={street} value={street}>
                    {street}
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