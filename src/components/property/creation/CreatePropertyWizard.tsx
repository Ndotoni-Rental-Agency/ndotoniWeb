'use client';

import { useEffect, useRef, useState } from 'react';

// Hooks and constants
import { useCreatePropertyForm, FormData } from '@/hooks/useCreatePropertyForm';
import { CREATE_PROPERTY_STEPS } from '@/constants';

// Step components
import { BasicInfoStep } from './steps/BasicInfoStep';
import { LocationStep } from './steps/LocationStep';
import { SpecificationsStep } from './steps/SpecificationsStep';
import { PricingStep } from './steps/PricingStep';
import { AvailabilityStep } from './steps/AvailabilityStep';
import { MediaStep } from './steps/MediaStep';

// Step component mapping
const STEP_COMPONENTS = {
  1: BasicInfoStep,
  2: LocationStep,
  3: SpecificationsStep,
  4: PricingStep,
  5: AvailabilityStep,
  6: MediaStep
} as const;

interface PropertyWizardProps {
  title?: string;
  subtitle?: string;
  onSubmit: (formData: any) => Promise<void>;
  submitButtonText?: string;
  loadingText?: string;
  className?: string;
  initialData?: Partial<FormData>;
  mode?: 'create' | 'edit';
}

export function PropertyWizard({
  title = 'Create a new listing',
  subtitle = 'Share your space with guests and start earning on nest',
  onSubmit,
  submitButtonText = 'Publish listing',
  loadingText = 'Creating...',
  className = '',
  initialData,
  mode = 'create'
}: PropertyWizardProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    formData,
    setFormData,
    updateSection,
    toggleAmenity
  } = useCreatePropertyForm(initialData);

  /** Auto-scroll active step into view on mobile */
  useEffect(() => {
    const el = stepRefs.current[currentStep];
    el?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }, [currentStep]);

  /** Auto-scroll to errors when validation fails */
  useEffect(() => {
    if (validationErrors.length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [validationErrors]);

  const handleSubmit = async () => {
    // Validate all steps before final submission
    const allErrors: string[] = [];
    for (let step = 1; step <= CREATE_PROPERTY_STEPS.length; step++) {
      const validation = validateStep(step);
      if (!validation.isValid) {
        allErrors.push(...validation.errors.map(error => `Step ${step}: ${error}`));
      }
    }

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      return;
    }

    setValidationErrors([]);
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  // Validation functions for each step
  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (step) {
      case 1: // Basic Info
        if (!formData.title?.trim()) {
          errors.push('Property title is required');
        }
        if (!formData.description?.trim()) {
          errors.push('Property description is required');
        }
        if (!formData.propertyType) {
          errors.push('Property type is required');
        }
        break;

      case 2: // Location
        if (!formData.address?.region?.trim()) {
          errors.push('Region is required');
        }
        if (!formData.address?.district?.trim()) {
          errors.push('District is required');
        }
        if (!formData.address?.ward?.trim()) {
          errors.push('Ward is required');
        }
        if (!formData.address?.street?.trim()) {
          errors.push('Street address is required');
        }
        break;

      case 3: // Specifications
        if (!formData.specifications?.bedrooms || formData.specifications.bedrooms < 1) {
          errors.push('Number of bedrooms is required');
        }
        if (!formData.specifications?.bathrooms || formData.specifications.bathrooms < 1) {
          errors.push('Number of bathrooms is required');
        }
        if (!formData.specifications?.squareMeters || formData.specifications.squareMeters <= 0) {
          errors.push('Square meters is required');
        }
        break;

      case 4: // Pricing
        if (!formData.pricing?.monthlyRent || formData.pricing.monthlyRent <= 0) {
          errors.push('Monthly rent is required');
        }
        if (!formData.pricing?.deposit || formData.pricing.deposit < 0) {
          errors.push('Security deposit is required');
        }
        break;

      case 5: // Availability
        if (!formData.availability?.availableFrom?.trim()) {
          errors.push('Available from date is required');
        }
        if (!formData.availability?.minimumLeaseTerm || formData.availability.minimumLeaseTerm <= 0) {
          errors.push('Minimum lease term is required');
        }
        if (!formData.availability?.maximumLeaseTerm || formData.availability.maximumLeaseTerm <= 0) {
          errors.push('Maximum lease term is required');
        }
        if (formData.availability?.minimumLeaseTerm && formData.availability?.maximumLeaseTerm && 
            formData.availability.minimumLeaseTerm > formData.availability.maximumLeaseTerm) {
          errors.push('Minimum lease term cannot be greater than maximum lease term');
        }
        break;

      case 6: // Media
        if (!formData.media?.images || formData.media.images.length === 0) {
          errors.push('At least one property image is required');
        }
        break;

      default:
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);
    if (currentStep < CREATE_PROPERTY_STEPS.length) {
      setCurrentStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setValidationErrors([]); // Clear errors when going back
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const StepComponent =
    STEP_COMPONENTS[currentStep as keyof typeof STEP_COMPONENTS];

  const renderStepContent = () => {
    const commonProps = {
      formData,
      onUpdate: (data: any) => setFormData(prev => ({ ...prev, ...data })),
      onUpdateSection: updateSection,
      onToggleAmenity: toggleAmenity
    };

    return <StepComponent {...commonProps} />;
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10">
        {/* Mobile summary */}
        <div className="sm:hidden mb-4 text-center">
          <p className="text-sm font-medium text-gray-500">
            Step {currentStep} of {CREATE_PROPERTY_STEPS.length}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {CREATE_PROPERTY_STEPS[currentStep - 1].name}
          </p>
        </div>

        {/* Scrollable Steps */}
        <div className="relative">
          <div
            className="
              flex items-center
              gap-3
              overflow-x-auto lg:overflow-x-visible
              whitespace-nowrap
              px-4 lg:px-0
              pb-3
              -mx-4 lg:mx-0
              scroll-smooth
              overscroll-x-contain
              lg:justify-center
            "
          >
            {CREATE_PROPERTY_STEPS.map((step, index) => {
              const stepValidation = validateStep(step.id);
              const isStepValid = stepValidation.isValid;
              
              return (
              <div
                key={step.id}
                ref={el => { stepRefs.current[step.id] = el; }}
                className="flex items-center flex-shrink-0"
              >
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep > step.id
                        ? isStepValid 
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white'
                        : currentStep === step.id
                        ? 'bg-red-500 text-white ring-4 ring-red-100'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {currentStep > step.id ? (
                      isStepValid ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )
                    ) : (
                      step.id
                    )}
                  </div>

                  <p
                    className={`mt-2 text-xs text-center max-w-[90px] leading-tight ${
                      currentStep >= step.id
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>

                {/* Connector */}
                {index < CREATE_PROPERTY_STEPS.length - 1 && (
                  <div
                    className={`w-10 h-1 mx-2 rounded-full flex-shrink-0 transition-colors ${
                      currentStep > step.id
                        ? isStepValid 
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Desktop description */}
        <div className="hidden sm:block text-center mt-6">
          <p className="text-gray-500">
            {CREATE_PROPERTY_STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border overflow-hidden mb-8">
        <div className="px-4 py-6 sm:px-8 sm:py-10">
          <h2 className="text-xl font-bold mb-6">
            {CREATE_PROPERTY_STEPS[currentStep - 1].name}
          </h2>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div 
              ref={errorRef}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-3xl">{renderStepContent()}</div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 sm:px-8 bg-gray-50 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-5 py-2 border rounded-full disabled:opacity-40"
          >
            Back
          </button>

          {currentStep < CREATE_PROPERTY_STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-red-500 text-white rounded-full"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-red-500 text-white rounded-full disabled:opacity-50"
            >
              {loading ? loadingText : submitButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Backward compatibility
export const CreatePropertyWizard = PropertyWizard;
