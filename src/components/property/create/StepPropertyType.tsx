'use client';

import React from 'react';
import { PropertyDraftFormData, FormErrors } from './types';
import { PROPERTY_TYPES } from './constants';

interface StepPropertyTypeProps {
  formData: PropertyDraftFormData;
  handleInputChange: <K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => void;
  errors: FormErrors;
}

export function StepPropertyType({
  formData,
  handleInputChange,
  errors,
}: StepPropertyTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          What type of property are you listing?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose the property category.
        </p>
      </div>

      {/* Property type pills */}
      <div data-field="propertyType">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Property type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              aria-pressed={formData.propertyType === type.value}
              onClick={() => handleInputChange('propertyType', type.value)}
              className={`min-h-24 px-4 py-5 rounded-2xl border font-medium transition-colors text-left ${
                formData.propertyType === type.value
                  ? 'bg-brand-50 text-brand-900 border-brand-700 ring-1 ring-brand-700 dark:bg-brand-900 dark:text-white'
                  : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-brand-400'
              }`}
            >
              <type.icon className="w-6 h-6 block mb-3 text-brand-700 dark:text-brand-300" /> {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
