'use client';

import React from 'react';
import { PropertyDraftFormData, FormErrors } from './types';
import { PROPERTY_TYPES, SHORT_TERM_PROPERTY_TYPES } from './constants';
import { RentalType } from '@/config/features';
import { RentalTypeToggle } from '@/components/home/RentalTypeToggle';

interface StepPropertyTypeProps {
  formData: PropertyDraftFormData;
  handleInputChange: <K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => void;
  isShortTerm: boolean;
  shortTermEnabled: boolean;
  rentalType: RentalType;
  setRentalType: (type: RentalType) => void;
  errors: FormErrors;
}

export function StepPropertyType({
  formData,
  handleInputChange,
  isShortTerm,
  shortTermEnabled,
  rentalType,
  setRentalType,
  errors,
}: StepPropertyTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          What type of property are you listing?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose the rental type and property category.
        </p>
      </div>

      {/* Rental type toggle */}
      {shortTermEnabled && (
        <div className="flex flex-col items-center space-y-3 py-4 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select rental type
          </label>
          <RentalTypeToggle value={rentalType} onChange={setRentalType} />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {isShortTerm
              ? 'Short-term rentals (hotels, vacation rentals, nightly bookings)'
              : 'Long-term rentals (monthly leases, apartments, houses)'}
          </p>
        </div>
      )}

      {/* Property type pills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Property type
        </label>
        <div className="flex gap-2 flex-wrap">
          {(isShortTerm ? SHORT_TERM_PROPERTY_TYPES : PROPERTY_TYPES).map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleInputChange('propertyType', type.value)}
              className={`px-4 py-2 rounded-full border font-medium transition-colors ${
                formData.propertyType === type.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-brand-400'
              }`}
            >
              {type.emoji} {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
