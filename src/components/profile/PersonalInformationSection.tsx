'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { BirthdayPicker } from '@/components/shared/forms/BirthdayPicker';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Button } from '@/components/ui/Button';
import { ProfileFormData } from '@/types/profile';
import { UserProfile } from '@/API';

interface PersonalInformationSectionProps {
  formData: ProfileFormData;
  user: UserProfile | null;
  isEditing: boolean;
  isUpdating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onPhoneChange: (field: string, value: string | undefined) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PersonalInformationSection({ 
  formData, 
  user, 
  isEditing, 
  isUpdating,
  onInputChange, 
  onSelectChange,
  onPhoneChange,
  onSave,
  onCancel
}: PersonalInformationSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.firstName')}
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.lastName')}
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.email')}
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Email cannot be changed
          </p>
        </div>
        <div className="md:col-span-2">
          <PhoneInput
            label={t('auth.phone')}
            value={formData.phoneNumber}
            onChange={(value) => onPhoneChange('phoneNumber', value)}
            placeholder="Enter phone number"
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <PhoneInput
            label={
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp Number
              </div>
            }
            value={formData.whatsappNumber}
            onChange={(value) => onPhoneChange('whatsappNumber', value)}
            placeholder="Enter WhatsApp number"
            helperText="This will be used for WhatsApp contact on your properties"
            disabled={!isEditing}
          />
        </div>
        
        {/* Date of Birth */}
        <div className="md:col-span-2">
          {isEditing ? (
            <BirthdayPicker
              value={formData.dateOfBirth}
              onChange={(value: string) => onSelectChange('dateOfBirth', value)}
              label="Date of Birth"
              required={false}
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not set'}
              </div>
            </div>
          )}
        </div>
        
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={(e) => onSelectChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEditing}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        
        {/* Occupation */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={onInputChange}
            placeholder="e.g. Software Engineer, Teacher, Student"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEditing}
          />
        </div>
        
        {/* National ID */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            National ID
          </label>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={onInputChange}
                placeholder="Enter new National ID Number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optional - helps with rental applications. Entering a new ID will replace the existing one.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {formData.nationalIdLast4 ? `****${formData.nationalIdLast4}` : 'Not set'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Only last 4 digits shown for security
              </p>
            </div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="mt-6 flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={onSave}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Personal Info'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}