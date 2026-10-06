'use client';

import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { PropertyDraftFormData, FormErrors, PriceSuggestion } from './types';
import { Counter, NumberInput } from '@/components/shared/forms';

interface StepPricingDetailsProps {
  formData: PropertyDraftFormData;
  handleInputChange: <K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => void;
  errors: FormErrors;
  isGeneratingTitle: boolean;
  handleGenerateTitle: () => void;
  titleError: string | null;
  isGeneratingPrice: boolean;
  handleSuggestPrice: () => void;
  priceError: string | null;
  priceSuggestion: PriceSuggestion | null;
  applyPriceSuggestion: () => void;
}

export function StepPricingDetails({
  formData,
  handleInputChange,
  errors,
  isGeneratingTitle,
  handleGenerateTitle,
  titleError,
  isGeneratingPrice,
  handleSuggestPrice,
  priceError,
  priceSuggestion,
  applyPriceSuggestion,
}: StepPricingDetailsProps) {
  // AI needs an area to reason about; make the gate explicit instead of a
  // silently disabled button.
  const aiReady = Boolean(formData.district);
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
      <div data-field="title">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateTitle}
            disabled={isGeneratingTitle || !aiReady}
            title={!aiReady ? 'Choose your area first to use AI' : undefined}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingTitle ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-thinking" />
                Writing a title…
              </>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /> Generate title</>
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
        {titleError && <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{titleError}</p>}
        {!aiReady && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Tip: choose your area on the previous step to let AI suggest a title.
          </p>
        )}
      </div>

      {/* Monthly rent */}
        <div data-field="monthlyRent">
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

      {/* AI Price Suggestion */}
      <div>
        <button
          type="button"
          onClick={handleSuggestPrice}
          disabled={isGeneratingPrice || !aiReady}
          title={!aiReady ? 'Choose your area first to use AI' : undefined}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingPrice ? (
            <>
              <Lightbulb className="w-3.5 h-3.5 animate-thinking" />
              Checking the local market…
            </>
          ) : (
            <><Lightbulb className="w-3.5 h-3.5" /> Suggest a price</>
          )}
        </button>
        {priceError && <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{priceError}</p>}
        {priceSuggestion && (
          <div className="mt-2 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 animate-panel-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                  Suggested: TZS {priceSuggestion.suggestedPrice.toLocaleString()}/month
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
          Bedrooms & bathrooms
        </label>
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
      </div>
    </div>
  );
}
