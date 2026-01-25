'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { useCreatePropertyDraft } from '@/hooks/useProperty';
import { NotificationModal } from '@/components/ui/NotificationModal';
import LocationSelector from '@/components/location/LocationSelector';
import MediaSelector from '@/components/media/MediaSelector';
import { Counter, NumberInput } from '@/components/shared/forms';
import { PropertyType } from '@/API';

const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ROOM', label: 'Room' },
  { value: 'COMMERCIAL', label: 'Commercial' },
] as const;

interface PropertyDraftFormData {
  title: string;
  propertyType: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  monthlyRent: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
}

type FormErrors = Partial<Record<keyof PropertyDraftFormData, string>>;

export const CreatePropertyDraft: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { notification, showSuccess, showError, closeNotification } =
    useNotification();
  const { createDraft, isCreating } = useCreatePropertyDraft();

  const [formData, setFormData] = useState<PropertyDraftFormData>({
    title: '',
    propertyType: 'HOUSE',
    region: '',
    district: '',
    ward: '',
    street: '',
    monthlyRent: 0,
    currency: 'TZS',
    bedrooms: 1,
    bathrooms: 1,
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const [wantsToAddMedia, setWantsToAddMedia] = useState(false); // NEW

  /* ---------- Helpers ---------- */
  const handleInputChange = <K extends keyof PropertyDraftFormData>(
    field: K,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.monthlyRent || formData.monthlyRent <= 0)
      newErrors.monthlyRent = 'Monthly rent is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validateForm()) return;

    if (!user) {
      showError('Authentication Error', 'Please log in to continue');
      return;
    }

    if (publish && selectedImages.length === 0) {
      showError('Image required', 'Add at least one image to publish');
      return;
    }

    const result = await createDraft({
      title: formData.title.trim(),
      propertyType: formData.propertyType as PropertyType,
      region: formData.region,
      district: formData.district,
      ward: formData.ward,
      street: formData.street,
      monthlyRent: formData.monthlyRent,
      currency: formData.currency,
      available: publish,
      bedrooms: formData.bedrooms || 1,
      bathrooms: formData.bathrooms || 1,
      images: selectedImages
    });

    if (result.success) {
      showSuccess(
        publish ? 'Published 🎉' : 'Draft saved',
        publish
          ? 'Your property is now live'
          : 'You can finish it later using Edit Property'
      );
      router.push('/landlord/properties');
    } else {
      showError('Failed', result.message);
    }
  };

  return (
    <>
      <NotificationModal {...notification} onClose={closeNotification} />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            List a property
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Draft in seconds. You can add images and publish later.
          </p>
        </header>

        {/* TITLE */}
        <div>
          <input
            placeholder="2 cozy bedrooms near city center"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white ${
              errors.title
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* PROPERTY TYPE */}
        <div className="flex gap-2 flex-wrap">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleInputChange('propertyType', type.value)}
              className={`px-4 py-1.5 rounded-full border font-medium ${
                formData.propertyType === type.value
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* LOCATION */}
        <LocationSelector
          value={{
            region: formData.region,
            district: formData.district,
            ward: formData.ward || '',
            street: formData.street || '',
          }}
          onChange={(loc) => setFormData((prev) => ({ ...prev, ...loc }))}
          required
        />
        {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
        {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}

        {/* MONTHLY RENT */}
        <NumberInput
          label="Monthly rent"
          required
          value={formData.monthlyRent}
          onChange={(val) => handleInputChange('monthlyRent', val)}
          placeholder="1,200,000"
        />
        {errors.monthlyRent && (
          <p className="text-sm text-red-500">{errors.monthlyRent}</p>
        )}

        {/* EXTRA DETAILS */}
        <button
          type="button"
          onClick={() => setShowExtraDetails((v) => !v)}
          className="text-sm font-medium text-red-600 dark:text-red-400"
        >
          {showExtraDetails ? '− Hide' : '+ bedrooms and bathrooms (optional)'}
        </button>

        {showExtraDetails && (
          <div className="grid grid-cols-2 gap-4">
            <Counter
              label="Bedrooms"
              value={formData.bedrooms || 1}
              min={0}
              onChange={(val) => handleInputChange('bedrooms', val)}
            />
            <Counter
              label="Bathrooms"
              value={formData.bathrooms || 1}
              min={0}
              onChange={(val) => handleInputChange('bathrooms', val)}
            />
          </div>
        )}

        {/* MEDIA */}
        <div>
            <button
              type="button"
              onClick={() => setWantsToAddMedia((v) => !v)}
              className="text-sm font-medium text-red-600 dark:text-red-400"
            >
              {wantsToAddMedia ? '− Add Photos later' : '+ Add photos (optional)'}
            </button>
          </div>
        {wantsToAddMedia && (
          <MediaSelector
            selectedMedia={selectedImages}
            onMediaChange={setSelectedImages}
            maxSelection={10}
          />
        )}

        {/* NOTE */}
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900 p-4 text-sm text-blue-800 dark:text-blue-200">
  💡       You can add more details, photos, and amenities later using the
       <span className="font-medium"> Edit Property</span> option.
        </div>

        {/* ACTIONS */}
        <div className="space-y-2">
          <button
            disabled={isCreating}
            onClick={() => handleSubmit(false)}
            className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Save draft
          </button>

          {/* Publish only shows if user wants to add media and has at least 1 image */}
          {wantsToAddMedia && selectedImages.length > 0 && (
            <button
              disabled={isCreating}
              onClick={() => handleSubmit(true)}
              className="w-full py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700"
            >
              Publish now
            </button>
          )}

          {wantsToAddMedia && selectedImages.length === 0 && (
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Publishing requires at least one image
            </p>
          )}
        </div>
      </div>
    </>
  );
};
