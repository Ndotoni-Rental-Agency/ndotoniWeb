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
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Property type
        </label>
        <div className="flex gap-2 flex-wrap">
          {PROPERTY_TYPES.map((type) => (
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
              <type.icon className="w-4 h-4 inline-block mr-1" /> {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
