'use client';

import React from 'react';
import { Lightbulb, Camera, CheckCircle2 } from 'lucide-react';
import { PropertyDraftFormData, FormErrors } from './types';
import MediaSelector from '@/components/media/MediaSelector';

// A listing with more photos gets more enquiries; nudge toward a healthy count.
const RECOMMENDED_PHOTOS = 3;

function PhotoCountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  const enough = count >= RECOMMENDED_PHOTOS;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        enough
          ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
      }`}
    >
      {enough && <CheckCircle2 className="h-3.5 w-3.5" />}
      {count} photo{count === 1 ? '' : 's'}
    </span>
  );
}

function PhotoGuidance({ imageCount }: { imageCount: number }) {
  let message: string;
  if (imageCount === 0) {
    message = `Add at least ${RECOMMENDED_PHOTOS} photos — listings with photos get far more enquiries.`;
  } else if (imageCount < RECOMMENDED_PHOTOS) {
    const left = RECOMMENDED_PHOTOS - imageCount;
    message = `${left} more photo${left === 1 ? '' : 's'} to reach a strong listing. Show the rooms, kitchen and outside.`;
  } else {
    message = 'Great set of photos. Add a short video if you can — it stands out.';
  }
  return (
    <div className="mb-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
      <Camera className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
      <span>{message}</span>
    </div>
  );
}

interface StepPhotosPublishProps {
  formData: PropertyDraftFormData;
  handleInputChange: <K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => void;
  handleBlur: (field: keyof PropertyDraftFormData) => void;
  errors: FormErrors;
  user: any;
  proceedAsGuest: boolean;
  selectedMedia: string[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedVideos: React.Dispatch<React.SetStateAction<string[]>>;
  selectedImages: string[];
  whatsappSameAsPhone: boolean;
  setWhatsappSameAsPhone: React.Dispatch<React.SetStateAction<boolean>>;
  isCreating: boolean;
  handleSubmit: (publish: boolean) => void;
}

export function StepPhotosPublish({
  formData,
  handleInputChange,
  handleBlur,
  errors,
  user,
  proceedAsGuest,
  selectedMedia,
  setSelectedMedia,
  setSelectedImages,
  setSelectedVideos,
  selectedImages,
  whatsappSameAsPhone,
  setWhatsappSameAsPhone,
  isCreating,
  handleSubmit,
}: StepPhotosPublishProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Photos & publish
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add photos to make your listing stand out, then publish or save as draft.
        </p>
      </div>

      {/* Media upload */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Photos & videos
          </label>
          <PhotoCountBadge count={selectedImages.length} />
        </div>
        <PhotoGuidance imageCount={selectedImages.length} />
        <MediaSelector
          selectedMedia={selectedMedia}
          onMediaChange={(allMedia, images, videos) => {
            setSelectedMedia(allMedia);
            setSelectedImages(images || []);
            setSelectedVideos(videos || []);
          }}
          maxSelection={10}
        />
        {selectedImages.length > 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Your first photo is the cover tenants see first — put your best one first.
          </p>
        )}
      </div>

      {/* Guest contact fields - only for non-authenticated guest users */}
      {!user && proceedAsGuest && (
        <div className="space-y-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Contact Information
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Your WhatsApp number is required so tenants can reach you.
              </p>
            </div>
          </div>

          {/* Phone number */}
          <div data-field="guestPhoneNumber">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+255 123 456 789"
              value={formData.guestPhoneNumber || ''}
              onChange={(e) => {
                handleInputChange('guestPhoneNumber', e.target.value);
                if (whatsappSameAsPhone) {
                  handleInputChange('guestWhatsappNumber', e.target.value);
                }
              }}
              onBlur={() => handleBlur('guestPhoneNumber')}
              className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 transition-colors ${
                errors.guestPhoneNumber
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.guestPhoneNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.guestPhoneNumber}</p>
            )}
          </div>

          {/* WhatsApp same as phone checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center h-5 relative">
              <input
                type="checkbox"
                id="whatsappSameAsPhone"
                checked={whatsappSameAsPhone}
                onChange={(e) => {
                  setWhatsappSameAsPhone(e.target.checked);
                  if (e.target.checked && formData.guestPhoneNumber) {
                    handleInputChange('guestWhatsappNumber', formData.guestPhoneNumber);
                  } else if (!e.target.checked) {
                    handleInputChange('guestWhatsappNumber', '');
                  }
                }}
                className="peer w-5 h-5 appearance-none bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer checked:bg-emerald-600 checked:border-emerald-600 dark:checked:bg-emerald-500 dark:checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:ring-offset-2 transition-all"
              />
              <svg
                className={`absolute w-5 h-5 text-white pointer-events-none transition-opacity ${whatsappSameAsPhone ? 'opacity-100' : 'opacity-0'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="whatsappSameAsPhone" className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp number is same as phone number</span>
              </div>
            </label>
          </div>

          {/* WhatsApp number */}
          <div data-field="guestWhatsappNumber">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              WhatsApp Number {!whatsappSameAsPhone && <span className="text-xs text-gray-500">(or provide email below)</span>}
            </label>
            <input
              type="tel"
              placeholder="+255 123 456 789"
              value={formData.guestWhatsappNumber || ''}
              onChange={(e) => handleInputChange('guestWhatsappNumber', e.target.value)}
              onBlur={() => handleBlur('guestWhatsappNumber')}
              disabled={whatsappSameAsPhone}
              className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 transition-colors ${
                whatsappSameAsPhone ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
              } ${
                errors.guestWhatsappNumber
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.guestWhatsappNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.guestWhatsappNumber}</p>
            )}
          </div>

          {/* Email */}
          <div data-field="guestEmail">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.guestEmail || ''}
              onChange={(e) => handleInputChange('guestEmail', e.target.value)}
              onBlur={() => handleBlur('guestEmail')}
              className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 transition-colors ${
                errors.guestEmail
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.guestEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.guestEmail}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Provide either WhatsApp number or email (or both)
            </p>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" /> <span>You can add more details, photos, videos, and amenities later using the
        <span className="font-medium"> Edit Property</span> option.</span>
      </div>

      {/* Publish / Save actions */}
      <div className="space-y-3">
        {/* Save Draft - only for authenticated users */}
        {user && (
          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleSubmit(false)}
            className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Saving...' : 'Save draft'}
          </button>
        )}

        {/* Publish button */}
        <button
          type="button"
          disabled={isCreating || selectedImages.length === 0}
          onClick={() => handleSubmit(true)}
          aria-describedby={selectedImages.length === 0 ? 'publish-requirement' : undefined}
          className="w-full py-3 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isCreating ? 'Publishing...' : 'Publish property'}
        </button>

        {/* Always-visible reason — hover tooltips don't exist on touch devices. */}
        {selectedImages.length === 0 && (
          <p
            id="publish-requirement"
            className="flex items-center justify-center gap-1.5 text-xs text-center text-amber-700 dark:text-amber-400"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {user
              ? 'Add at least one photo to publish — or save a draft and finish later.'
              : 'Add at least one photo to publish your property.'}
          </p>
        )}
      </div>
    </div>
  );
}
