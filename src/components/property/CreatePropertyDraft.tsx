'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotification } from '@/hooks/useNotification';
import { useCreatePropertyDraft } from '@/hooks/useProperty';
import { NotificationModal } from '@/components/ui/NotificationModal';
import LocationSelector from '@/components/location/LocationSelector';
import { PropertyType } from '@/API';

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ROOM', label: 'Room' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' },
] as const;

interface PropertyDraftFormData {
  title: string;
  propertyType: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  monthlyRent: string;
  currency: string;
  available: boolean;
}

interface CreatePropertyDraftProps {
  onSuccess?: (propertyId: string) => void;
  onCancel?: () => void;
}

export const CreatePropertyDraft: React.FC<CreatePropertyDraftProps> = ({
  onSuccess,
  onCancel
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { notification, showSuccess, showError, closeNotification } = useNotification();
  const { createDraft, isCreating } = useCreatePropertyDraft();

  const [formData, setFormData] = useState<PropertyDraftFormData>({
    title: '',
    propertyType: 'APARTMENT',
    region: '',
    district: '',
    ward: '',
    street: '',
    monthlyRent: '',
    currency: 'TZS',
    available: true,
  });

  const handleInputChange = (field: keyof PropertyDraftFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      showError('Validation Error', 'Title is required');
      return false;
    }
    if (!formData.propertyType) {
      showError('Validation Error', 'Property type is required');
      return false;
    }
    if (!formData.region.trim()) {
      showError('Validation Error', 'Region is required');
      return false;
    }
    if (!formData.district.trim()) {
      showError('Validation Error', 'District is required');
      return false;
    }
    const rent = parseFloat(formData.monthlyRent);
    if (!formData.monthlyRent || isNaN(rent) || rent <= 0) {
      showError('Validation Error', 'Valid monthly rent is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      showError('Authentication Error', 'Please log in to create a property draft');
      return;
    }

    const input = {
      title: formData.title.trim(),
      propertyType: formData.propertyType as PropertyType,
      region: formData.region.trim(),
      district: formData.district.trim(),
      ward: formData.ward?.trim() || undefined,
      street: formData.street?.trim() || undefined,
      monthlyRent: parseFloat(formData.monthlyRent),
      currency: formData.currency,
      available: formData.available,
    };

    const result = await createDraft(input);

    if (result.success) {
      showSuccess('Success!', 'Property draft created successfully');

      // If we have the new property id, call onSuccess then navigate to the properties list page
      if (result.propertyId) {
        if (onSuccess) {
          try { onSuccess(result.propertyId); } catch (e) { /* ignore */ }
        }
        router.push('/landlord/properties');
        return;
      }

    } else {
      showError('Creation Failed', result.message);
    }
  };

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Property Draft
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create a basic property draft with essential information. You can enrich it later with more details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Modern 2BR Apartment in Kinondoni"
              required
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Type *
            </label>
            <select
              id="propertyType"
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              required
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <LocationSelector
              value={{
                region: formData.region,
                district: formData.district,
                ward: formData.ward || '',
                street: formData.street || '',
              }}
              onChange={(location) => {
                setFormData(prev => ({
                  ...prev,
                  region: location.region,
                  district: location.district,
                  ward: location.ward || '',
                  street: location.street || '',
                }));
              }}
              required={true}
              className="space-y-4"
            />
          </div>

          {/* Monthly Rent and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Rent (TZS) *
              </label>
              <input
                type="number"
                id="monthlyRent"
                value={formData.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 500000"
                min="0"
                step="1000"
                required
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="TZS">TZS (Tanzanian Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
          </div>

          {/* Available checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => handleInputChange('available', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Available for rent
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Draft...
                </>
              ) : (
                'Create Property Draft'
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">What happens next?</p>
              <p>Your property draft will be saved and you can later add more details like description, photos, specifications, and pricing information to complete the listing.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};