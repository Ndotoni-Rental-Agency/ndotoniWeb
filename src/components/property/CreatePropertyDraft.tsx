'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { useCreatePropertyDraft } from '@/hooks/useProperty';
import { useCreateShortTermProperty } from '@/hooks/useCreateShortTermProperty';
import { NotificationModal } from '@/components/ui/NotificationModal';
import LocationSelector from '@/components/location/LocationSelector';
import MediaSelector from '@/components/media/MediaSelector';
import { Counter, NumberInput } from '@/components/shared/forms';
import { PropertyType, ShortTermPropertyType } from '@/API';
import LocationMapPicker from '../location/LocationMapPicker';
import { RentalType, isFeatureEnabled } from '@/config/features';
import { RentalTypeToggle } from '@/components/home/RentalTypeToggle';

const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ROOM', label: 'Room' },
  { value: 'COMMERCIAL', label: 'Commercial' },
] as const;

const SHORT_TERM_PROPERTY_TYPES = [
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'GUESTHOUSE', label: 'Guest House' },
  { value: 'RESORT', label: 'Resort' },
  { value: 'HOSTEL', label: 'Hostel' },
] as const;

interface PropertyDraftFormData {
  title: string;
  propertyType: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  monthlyRent: number;
  nightlyRate?: number;
  cleaningFee?: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  minimumStay?: number;
  instantBookEnabled?: boolean;
}

type FormErrors = Partial<Record<keyof PropertyDraftFormData, string>>;

export const CreatePropertyDraft: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { notification, showSuccess, showError, closeNotification } =
    useNotification();
  const { createDraft, isCreating } = useCreatePropertyDraft();
  const { createDraft: createShortTermDraft, isCreating: isCreatingShortTerm } = useCreateShortTermProperty();
  const shortTermEnabled = isFeatureEnabled('shortTermStays');

  const [rentalType, setRentalType] = useState<RentalType>(RentalType.LONG_TERM);
  const isShortTerm = shortTermEnabled && rentalType === RentalType.SHORT_TERM;

  const [formData, setFormData] = useState<PropertyDraftFormData>({
    title: '',
    propertyType: 'HOUSE',
    region: '',
    district: '',
    ward: '',
    street: '',
    monthlyRent: 0,
    nightlyRate: 0,
    cleaningFee: 0,
    currency: 'TZS',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    minimumStay: 1,
    instantBookEnabled: false,
  });

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const [wantsToAddMedia, setWantsToAddMedia] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

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
    
    if (isShortTerm) {
      if (!formData.nightlyRate || formData.nightlyRate <= 0)
        newErrors.nightlyRate = 'Nightly rate is required';
    } else {
      if (!formData.monthlyRent || formData.monthlyRent <= 0)
        newErrors.monthlyRent = 'Monthly rent is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validateForm()) return;

    if (!user) {
      showError('Authentication Error', 'Please log in to continue');
      return;
    }

    if (publish && selectedMedia.length === 0) {
      showError('Media required', 'Add at least one image or video to publish');
      return;
    }

    console.log('🎬 [CreatePropertyDraft] Submitting with media:', {
      selectedMedia,
      selectedImages,
      selectedVideos,
      totalMedia: selectedMedia.length,
      totalImages: selectedImages.length,
      totalVideos: selectedVideos.length,
      rentalType,
      isShortTerm
    });

    // Handle short-term property creation
    if (isShortTerm) {
      // Auto-publish if media is included
      const shouldAutoPublish = selectedMedia.length > 0;
      
      const result = await createShortTermDraft({
        title: formData.title.trim(),
        propertyType: formData.propertyType as ShortTermPropertyType,
        region: formData.region,
        district: formData.district,
        nightlyRate: formData.nightlyRate || 0,
        currency: formData.currency,
        cleaningFee: formData.cleaningFee,
        maxGuests: formData.maxGuests,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        minimumStay: formData.minimumStay,
        latitude: coords.lat,
        longitude: coords.lng,
        images: selectedImages,
        videos: selectedVideos,
      });

      if (result.success) {
        if (shouldAutoPublish) {
          showSuccess(
            'Property created with media! 🎉',
            'Your short-term property has been created with images. You can publish it from the properties page.'
          );
        } else {
          showSuccess(
            'Draft saved',
            'Your short-term property draft has been created. Add images and publish it from the properties page.'
          );
        }
        router.push('/landlord/properties');
      } else {
        showError('Failed', result.message);
      }
      return;
    }

    // Handle long-term property creation (existing flow)
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
      images: selectedImages,
      videos: selectedVideos,
      latitude: coords.lat,
      longitude: coords.lng,
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

        {/* RENTAL TYPE TOGGLE */}
        {shortTermEnabled && (
          <div className="flex flex-col items-center space-y-3 py-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select rental type
            </label>
            <RentalTypeToggle value={rentalType} onChange={setRentalType} />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {isShortTerm 
                ? 'Short-term rentals (hotels, vacation rentals, nightly bookings)'
                : 'Long-term rentals (monthly leases, apartments, houses)'
              }
            </p>
          </div>
        )}

        {/* TITLE */}
        <div>
          <input
            placeholder="2 cozy bedrooms near city center"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors ${
              errors.title
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* PROPERTY TYPE */}
        <div className="flex gap-2 flex-wrap">
          {(isShortTerm ? SHORT_TERM_PROPERTY_TYPES : PROPERTY_TYPES).map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleInputChange('propertyType', type.value)}
              className={`px-4 py-1.5 rounded-full border font-medium ${
                formData.propertyType === type.value
                  ? 'bg-gray-900 dark:bg-emerald-900 text-white border-gray-900 dark:border-emerald-900'
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

        {formData.region && formData.district && (
          <LocationMapPicker
            location={formData}
            onChange={(c) => setCoords(c)}
          />
        )}
        {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
        {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}

        {/* PRICING - Conditional based on rental type */}
        {isShortTerm ? (
          <>
            <NumberInput
              label="Nightly rate"
              required
              value={formData.nightlyRate || 0}
              onChange={(val) => handleInputChange('nightlyRate', val)}
              placeholder="150,000"
            />
            {errors.nightlyRate && (
              <p className="text-sm text-red-500">{errors.nightlyRate}</p>
            )}
            
            <NumberInput
              label="Cleaning fee (optional)"
              value={formData.cleaningFee || 0}
              onChange={(val) => handleInputChange('cleaningFee', val)}
              placeholder="50,000"
            />
          </>
        ) : (
          <>
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
          </>
        )}

        {/* EXTRA DETAILS */}
        <button
          type="button"
          onClick={() => setShowExtraDetails((v) => !v)}
          className="text-sm font-medium text-emerald-800 dark:text-emerald-400"
        >
          {showExtraDetails ? '− Hide' : `+ ${isShortTerm ? 'guest capacity and rooms' : 'bedrooms and bathrooms'} (optional)`}
        </button>

        {showExtraDetails && (
          <div className="grid grid-cols-2 gap-4">
            {isShortTerm && (
              <Counter
                label="Max guests"
                value={formData.maxGuests || 2}
                min={1}
                onChange={(val) => handleInputChange('maxGuests', val)}
              />
            )}
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
            {isShortTerm && (
              <Counter
                label="Min stay (nights)"
                value={formData.minimumStay || 1}
                min={1}
                onChange={(val) => handleInputChange('minimumStay', val)}
              />
            )}
          </div>
        )}

        {/* MEDIA */}
        <div>
            <button
              type="button"
              onClick={() => setWantsToAddMedia((v) => !v)}
              className="text-sm font-medium text-emerald-800 dark:text-emerald-400"
            >
              {wantsToAddMedia ? '− Add media later' : '+ Add photos & videos (optional)'}
            </button>
          </div>
        {wantsToAddMedia && (
          <MediaSelector
            selectedMedia={selectedMedia}
            onMediaChange={(allMedia, images, videos) => {
              setSelectedMedia(allMedia);
              setSelectedImages(images || []);
              setSelectedVideos(videos || []);
            }}
            maxSelection={10}
          />
        )}

        {/* NOTE */}
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900 p-4 text-sm text-blue-800 dark:text-blue-200">
  💡       You can add more details, photos, videos, and amenities later using the
       <span className="font-medium"> Edit Property</span> option.
        </div>

        {/* ACTIONS */}
        <div className="space-y-2">
          <button
            disabled={isCreating || isCreatingShortTerm}
            onClick={() => handleSubmit(false)}
            className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isCreating || isCreatingShortTerm) ? 'Saving...' : 'Save draft'}
          </button>

          {/* Publish only shows if user wants to add media and has at least 1 media item */}
          {wantsToAddMedia && selectedMedia.length > 0 && !isShortTerm && (
            <button
              disabled={isCreating || isCreatingShortTerm}
              onClick={() => handleSubmit(true)}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gray-900 dark:bg-emerald-900 hover:bg-gray-800 dark:hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isCreating || isCreatingShortTerm) ? 'Publishing...' : 'Publish now'}
            </button>
          )}

          {wantsToAddMedia && selectedMedia.length === 0 && (
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Publishing requires at least one image or video
            </p>
          )}
          
          {isShortTerm && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Note: Short-term properties are saved as drafts. You can complete and publish them later.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
