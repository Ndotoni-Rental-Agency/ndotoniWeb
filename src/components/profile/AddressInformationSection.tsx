'use client';

import LocationSelector from '@/components/location/LocationSelector';
import { Button } from '@/components/ui/Button';
import { ProfileFormData, LocationChangeData } from '@/types/profile';
import { toTitleCase } from '@/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddressInformationSectionProps {
  formData: ProfileFormData;
  isEditing: boolean;
  isUpdating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (location: LocationChangeData) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export default function AddressInformationSection({ 
  formData, 
  isEditing, 
  isUpdating,
  onInputChange, 
  onLocationChange,
  onSave,
  onCancel,
  onEdit
}: AddressInformationSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('profile.addressInformation')}
        </h3>
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
          >
            {t('profile.edit')}
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          {/* Location Selector */}
          <LocationSelector
            value={{
              region: formData.region || '',
              district: formData.district || '',
              ward: formData.ward || '',
              street: formData.street || ''
            }}
            onChange={onLocationChange}
            required={false}
          />
          
          {/* Additional Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.additionalAddressDetails')}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onInputChange}
              placeholder={t('profile.additionalAddressPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.region')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {toTitleCase(formData.region) || t('profile.notSet')}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.district')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {toTitleCase(formData.district) || t('profile.notSet')}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.ward')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {toTitleCase(formData.ward) || t('profile.notSet')}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.street')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {toTitleCase(formData.street) || t('profile.notSet')}
              </div>
            </div>
          </div>
          
          {formData.address && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.additionalAddressDetails')}
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {formData.address}
              </div>
            </div>
          )}
        </div>
      )}
      
      {isEditing && (
        <div className="mt-6 flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={onSave}
            disabled={isUpdating}
          >
            {isUpdating ? t('profile.saving') : t('profile.saveAddressInfo')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
            disabled={isUpdating}
          >
            {t('common.cancel')}
          </Button>
        </div>
      )}
    </div>
  );
}