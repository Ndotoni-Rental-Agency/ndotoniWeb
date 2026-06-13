import { Counter, NumberInput } from '@/components/shared/forms';
import { PropertyDraftFormData, FormErrors } from './types';

interface StepPricingDetailsProps {
  formData: PropertyDraftFormData;
  errors: FormErrors;
  isShortTerm: boolean;
  onInputChange: <K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => void;
}

export function StepPricingDetails({ formData, errors, isShortTerm, onInputChange }: StepPricingDetailsProps) {
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="2 cozy bedrooms near city center"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 focus:border-brand-500 dark:focus:border-emerald-900 transition-colors ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Pricing */}
      {isShortTerm ? (
        <div className="space-y-4">
          <NumberInput
            label="Nightly rate"
            required
            value={formData.nightlyRate || 0}
            onChange={(val) => onInputChange('nightlyRate', val)}
            placeholder="150,000"
          />
          {errors.nightlyRate && <p className="text-sm text-red-500">{errors.nightlyRate}</p>}
          <NumberInput
            label="Cleaning fee (optional)"
            value={formData.cleaningFee || 0}
            onChange={(val) => onInputChange('cleaningFee', val)}
            placeholder="50,000"
          />
        </div>
      ) : (
        <div>
          <NumberInput
            label="Monthly rent"
            required
            value={formData.monthlyRent}
            onChange={(val) => onInputChange('monthlyRent', val)}
            placeholder="1,200,000"
          />
          {errors.monthlyRent && <p className="text-sm text-red-500 mt-1">{errors.monthlyRent}</p>}
        </div>
      )}

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
              onChange={(val) => onInputChange('maxGuests', val)}
            />
          )}
          <Counter
            label="Bedrooms"
            value={formData.bedrooms || 1}
            min={0}
            onChange={(val) => onInputChange('bedrooms', val)}
          />
          <Counter
            label="Bathrooms"
            value={formData.bathrooms || 1}
            min={0}
            onChange={(val) => onInputChange('bathrooms', val)}
          />
          {isShortTerm && (
            <Counter
              label="Min stay (nights)"
              value={formData.minimumStay || 1}
              min={1}
              onChange={(val) => onInputChange('minimumStay', val)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
