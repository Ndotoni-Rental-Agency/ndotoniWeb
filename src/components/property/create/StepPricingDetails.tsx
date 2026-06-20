'use client';

import React from 'react';
import { PropertyDraftFormData, FormErrors, PriceSuggestion } from './types';
import { Counter, NumberInput } from '@/components/shared/forms';

interface StepPricingDetailsProps {
  formData: PropertyDraftFormData;
  handleInputChange: <K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => void;
  isShortTerm: boolean;
  errors: FormErrors;
  isGeneratingTitle: boolean;
  handleGenerateTitle: () => void;
  isGeneratingPrice: boolean;
  handleSuggestPrice: () => void;
  priceSuggestion: PriceSuggestion | null;
  applyPriceSuggestion: () => void;
}

export function StepPricingDetails({
  formData,
  handleInputChange,
  isShortTerm,
  errors,
  isGeneratingTitle,
  handleGenerateTitle,
  isGeneratingPrice,
  handleSuggestPrice,
  priceSuggestion,
  applyPriceSuggestion,
}: StepPricingDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Pricing & details
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set your price and describe the space.
        </p>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateTitle}
            disabled={isGeneratingTitle || !formData.district}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingTitle ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Generating...
              </>
            ) : (
              <>✨ Generate title</>
            )}
          </button>
        </div>
        <input
          placeholder="2 cozy bedrooms near city center"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 focus:border-brand-500 dark:focus:border-emerald-900 transition-colors ${
            errors.title
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Pricing based on rental type */}
      {isShortTerm ? (
        <div className="space-y-4">
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
        </div>
      ) : (
        <div>
          <NumberInput
            label="Monthly rent"
            required
            value={formData.monthlyRent}
            onChange={(val) => handleInputChange('monthlyRent', val)}
            placeholder="1,200,000"
          />
          {errors.monthlyRent && (
            <p className="text-sm text-red-500 mt-1">{errors.monthlyRent}</p>
          )}
        </div>
      )}

      {/* AI Price Suggestion */}
      <div>
        <button
          type="button"
          onClick={handleSuggestPrice}
          disabled={isGeneratingPrice || !formData.district}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingPrice ? (
            <>
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Analyzing market...
            </>
          ) : (
            <>💡 Suggest price</>
          )}
        </button>
        {priceSuggestion && (
          <div className="mt-2 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                  Suggested: TZS {priceSuggestion.suggestedPrice.toLocaleString()}/{isShortTerm ? 'night' : 'month'}
                </p>
                <p className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">
                  Range: TZS {priceSuggestion.range.min.toLocaleString()} – {priceSuggestion.range.max.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{priceSuggestion.reasoning}</p>
              </div>
              <button
                type="button"
                onClick={applyPriceSuggestion}
                className="ml-3 px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rooms & capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {isShortTerm ? 'Guest capacity & rooms' : 'Bedrooms & bathrooms'}
        </label>
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
      </div>
    </div>
  );
}
