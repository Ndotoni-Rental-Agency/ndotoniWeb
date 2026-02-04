'use client';

import { Button } from '@/components/ui/Button';
import { ProfileFormData } from '@/types/profile';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmergencyContactSectionProps {
  formData: ProfileFormData;
  isEditing: boolean;
  isUpdating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export default function EmergencyContactSection({ 
  formData, 
  isEditing, 
  isUpdating,
  onInputChange, 
  onSave, 
  onCancel,
  onEdit
}: EmergencyContactSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('profile.emergencyContact')}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('profile.emergencyContactName')}
          </label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={onInputChange}
            placeholder={t('profile.fullNamePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('profile.emergencyContactPhone')}
          </label>
          <input
            type="tel"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={onInputChange}
            placeholder="+255 123 456 789"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEditing}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {t('profile.emergencyContactPrivacy')}
      </p>
      {isEditing && (
        <div className="mt-4 flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={onSave}
            disabled={isUpdating}
          >
            {isUpdating ? t('profile.saving') : t('profile.saveEmergencyContact')}
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