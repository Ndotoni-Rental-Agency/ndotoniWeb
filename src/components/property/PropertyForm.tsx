'use client';

import { useState } from 'react';
import { PropertyType, CreatePropertyInput, UpdatePropertyInput } from '@/types/property';
import LocationSelector from '@/components/location/LocationSelector';
import PropertyMediaManager from '@/components/media/PropertyMediaManager';
import { getApproximateCoordinates } from '@/lib/geocoding';

interface PropertyFormProps {
  initialData?: Partial<CreatePropertyInput | UpdatePropertyInput>;
  onSubmit: (data: CreatePropertyInput | UpdatePropertyInput) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export default function PropertyForm({ 
  initialData = {}, 
  onSubmit, 
  submitLabel = 'Save Property',
  loading = false 
}: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    propertyType: (initialData.propertyType as PropertyType) || 'APARTMENT',
    address: {
      region: initialData.address?.region || '',
      district: initialData.address?.district || '',
      ward: initialData.address?.ward || '',
      street: initialData.address?.street || '',
      coordinates: initialData.address?.coordinates || { latitude: 0, longitude: 0 }
    },
    specifications: {
      bedrooms: initialData.specifications?.bedrooms || 1,
      bathrooms: initialData.specifications?.bathrooms || 1,
      squareMeters: initialData.specifications?.squareMeters || 0,
      furnished: initialData.specifications?.furnished || false,
      parkingSpaces: initialData.specifications?.parkingSpaces || 0,
      floors: initialData.specifications?.floors || 1
    },
    pricing: {
      monthlyRent: initialData.pricing?.monthlyRent || 0,
      deposit: initialData.pricing?.deposit || 0,
      currency: initialData.pricing?.currency || 'TZS',
      serviceCharge: initialData.pricing?.serviceCharge || 0,
      utilitiesIncluded: initialData.pricing?.utilitiesIncluded || false
    },
    availability: {
      available: initialData.availability?.available ?? true,
      availableFrom: initialData.availability?.availableFrom || '',
      minimumLeaseTerm: initialData.availability?.minimumLeaseTerm || 12,
      maximumLeaseTerm: initialData.availability?.maximumLeaseTerm || 24
    },
    amenities: initialData.amenities || [],
    media: {
      images: initialData.media?.images || [],
      videos: initialData.media?.videos || [],
      floorPlan: initialData.media?.floorPlan || '',
      virtualTour: initialData.media?.virtualTour || ''
    }
  });

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOUSE', label: 'House' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'COMMERCIAL', label: 'Commercial' },
  ];

  const commonAmenities = [
    'Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden', 'Balcony',
    'Air Conditioning', 'WiFi', 'Generator', 'Water Tank', 'CCTV', 'Elevator'
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const currentSection = prev[section as keyof typeof prev];
      return {
        ...prev,
        [section]: typeof currentSection === 'object' && currentSection !== null
          ? { ...currentSection, [field]: value }
          : { [field]: value }
      };
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="e.g., Modern 2-Bedroom Apartment in Masaki"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Describe your property, its features, and what makes it special..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Type *
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              required
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
        
        <LocationSelector
          value={{
            region: formData.address.region,
            district: formData.address.district,
            ward: formData.address.ward || '',
            street: formData.address.street || ''
          }}
          onChange={(location) => {
            // Auto-populate coordinates based on location
            const coordinates = getApproximateCoordinates({
              region: location.region,
              district: location.district,
              ward: location.ward,
              street: location.street
            });
            
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                region: location.region,
                district: location.district,
                ward: location.ward || '',
                street: location.street || '',
                coordinates
              }
            }));
          }}
          required={true}
        />
      </div>

      {/* Specifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                min="0"
                value={formData.specifications.bedrooms}
                onChange={(e) => handleInputChange('specifications', 'bedrooms', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                min="0"
                value={formData.specifications.bathrooms}
                onChange={(e) => handleInputChange('specifications', 'bathrooms', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Square Meters
              </label>
              <input
                type="number"
                min="0"
                value={formData.specifications.squareMeters}
                onChange={(e) => handleInputChange('specifications', 'squareMeters', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.specifications.furnished}
                onChange={(e) => handleInputChange('specifications', 'furnished', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Furnished</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities?.includes(amenity) || false}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Rent (TZS) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.pricing.monthlyRent}
                onChange={(e) => handleInputChange('pricing', 'monthlyRent', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="e.g., 1200000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Security Deposit (TZS) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.pricing.deposit}
                onChange={(e) => handleInputChange('pricing', 'deposit', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="e.g., 2400000"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.pricing.utilitiesIncluded}
                onChange={(e) => handleInputChange('pricing', 'utilitiesIncluded', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Utilities Included in Rent</span>
            </label>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <PropertyMediaManager
          media={formData.media || {
            images: [],
            videos: [],
            floorPlan: '',
            virtualTour: ''
          }}
          onMediaChange={(media) => {
            setFormData(prev => ({
              ...prev,
              media
            }));
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}