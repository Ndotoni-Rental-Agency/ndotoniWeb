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
  { value: 'COMMERCIAL', label: 'Commercial' }
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

type FormErrors = Partial<Record<keyof PropertyDraftFormData, string>>;

interface CreatePropertyDraftProps {
  onSuccess?: (propertyId: string) => void;
}

/* ---------- helpers ---------- */
const formatNumber = (value: string) => {
  const digits = value.replace(/[^\d]/g, '');
  return digits ? Number(digits).toLocaleString() : '';
};

const parseNumber = (value: string) => Number(value.replace(/,/g, ''));

export const CreatePropertyDraft: React.FC<CreatePropertyDraftProps> = ({
  onSuccess,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { notification, showSuccess, showError, closeNotification } =
    useNotification();
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

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    field: keyof PropertyDraftFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    const rent = parseNumber(formData.monthlyRent);
    if (!formData.monthlyRent) newErrors.monthlyRent = 'Monthly rent is required';
    else if (isNaN(rent) || rent <= 0) newErrors.monthlyRent = 'Enter a valid amount';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      showError('Authentication Error', 'Please log in to continue');
      return;
    }

    const result = await createDraft({
      title: formData.title.trim(),
      propertyType: formData.propertyType as PropertyType,
      region: formData.region.trim(),
      district: formData.district.trim(),
      ward: formData.ward?.trim() || undefined,
      street: formData.street?.trim() || undefined,
      monthlyRent: parseNumber(formData.monthlyRent),
      currency: formData.currency,
      available: formData.available,
    });

    if (result.success) {
      showSuccess('Saved', 'Draft created successfully');
      if (result.propertyId) {
        onSuccess?.(result.propertyId);
        router.push('/landlord/properties');
      }
    } else {
      showError('Failed', result.message);
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

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            List a property in under 1 minute
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Only the essentials. Add photos and details later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Basic info
            </h3>

            <input
              type="text"
              placeholder="2BR Apartment in Kinondoni"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 dark:bg-gray-700
                ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-red-500'}`}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

            <div className="flex flex-wrap gap-2 pt-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('propertyType', type.value)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition
                    ${formData.propertyType === type.value
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </section>

          {/* LOCATION */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Location
            </h3>

            <LocationSelector
              value={{
                region: formData.region,
                district: formData.district,
                ward: formData.ward || '',
                street: formData.street || '',
              }}
              onChange={(location) =>
                setFormData((prev) => ({ ...prev, ...location }))
              }
              required
            />

            {(errors.region || errors.district) && (
              <p className="text-sm text-red-500">
                {errors.region && `${errors.region}. `}
                {errors.district && `${errors.district}.`}
              </p>
            )}
          </section>

          {/* PRICING */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Monthly Rent
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                inputMode="numeric"
                placeholder="100,000"
                value={formData.monthlyRent}
                onChange={(e) =>
                  handleInputChange('monthlyRent', formatNumber(e.target.value))
                }
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 dark:bg-gray-700
                  ${errors.monthlyRent ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-red-500'}`}
              />

              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="TZS">TZS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            {errors.monthlyRent && <p className="text-sm text-red-500">{errors.monthlyRent}</p>}
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can add photos, description, and more details after saving.
          </p>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
          >
            {isCreating ? 'Saving…' : 'Save draft'}
          </button>
        </form>
      </div>
    </>
  );
};
