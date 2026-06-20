'use client';

import React from 'react';
import { PropertyDraftFormData, FormErrors } from './types';
import MediaSelector from '@/components/media/MediaSelector';

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
  isCreatingShortTerm: boolean;
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
  isCreatingShortTerm,
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Photos & videos
        </label>
        <MediaSelector
          selectedMedia={selectedMedia}
          onMediaChange={(allMedia, images, videos) => {
            setSelectedMedia(allMedia);
            setSelectedImages(images || []);
            setSelectedVideos(videos || []);
          }}
          maxSelection={10}
        />
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
          <div>
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
          <div>
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
          <div>
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
      <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-800 dark:text-blue-200">
        💡 You can add more details, photos, videos, and amenities later using the
        <span className="font-medium"> Edit Property</span> option.
      </div>

      {/* Publish / Save actions */}
      <div className="space-y-3">
        {/* Save Draft - only for authenticated users */}
        {user && (
          <button
            type="button"
            disabled={isCreating || isCreatingShortTerm}
            onClick={() => handleSubmit(false)}
            className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isCreating || isCreatingShortTerm) ? 'Saving...' : 'Save draft'}
          </button>
        )}

        {/* Publish button */}
        <div className="relative group">
          <button
            type="button"
            disabled={isCreating || isCreatingShortTerm || selectedImages.length === 0}
            onClick={() => handleSubmit(true)}
            className="w-full py-3 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {(isCreating || isCreatingShortTerm) ? 'Publishing...' : 'Publish property'}
          </button>

          {/* Tooltip when no images */}
          {selectedImages.length === 0 && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <div className="relative">
                At least one image is required to publish
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
              </div>
            </div>
          )}
        </div>

        {selectedImages.length === 0 && (
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            {!user && proceedAsGuest
              ? 'Add at least one image to publish your property'
              : 'Publishing requires at least one image or video'}
          </p>
        )}
      </div>
    </div>
  );
}
