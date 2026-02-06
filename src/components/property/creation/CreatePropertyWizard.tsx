'use client';

import { useEffect, useRef, useState } from 'react';

// Hooks and constants
import { useCreatePropertyForm, FormData } from '@/hooks/useCreatePropertyForm';
import { useLanguage } from '@/contexts/LanguageContext';
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
  subtitle = 'Share your space with guests and start earning on ndotoni',
  onSubmit,
  submitButtonText = 'Publish listing',
  loadingText = 'Creating...',
  className = '',
  initialData,
  mode = 'create'
}: PropertyWizardProps) {
  const { t } = useLanguage();
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
        // Description is optional - removed validation
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
        break;

      case 3: // Specifications
        if (!formData.specifications?.bedrooms || formData.specifications.bedrooms < 1) {
          errors.push('Number of bedrooms is required');
        }
        if (!formData.specifications?.bathrooms || formData.specifications.bathrooms < 1) {
          errors.push('Number of bathrooms is required');
        }
        // Square meters is optional - removed validation
        break;

      case 4: // Pricing
        if (!formData.pricing?.monthlyRent || formData.pricing.monthlyRent <= 0) {
          errors.push('Monthly rent is required');
        }
        // Security deposit is optional - removed validation
        break;

      case 5: // Availability
        // Available from date is optional - removed validation
        // Lease terms are optional - removed validation
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
    <div className={`w-full max-w-6xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 ${className}`}>
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 px-2">
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
          {subtitle}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        {/* Mobile summary */}
        <div className="sm:hidden mb-3 text-center px-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors">
            {t('landlord.createProperty.stepOf', `Step ${currentStep} of ${CREATE_PROPERTY_STEPS.length}`).replace('{current}', currentStep.toString()).replace('{total}', CREATE_PROPERTY_STEPS.length.toString())}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors">
            {CREATE_PROPERTY_STEPS[currentStep - 1].name}
          </p>
        </div>

        {/* Scrollable Steps */}
        <div className="relative">
          <div
            className="
              flex items-center
              gap-2 sm:gap-3
              overflow-x-auto lg:overflow-x-visible
              whitespace-nowrap
              px-2 sm:px-4 lg:px-0
              pb-2 sm:pb-3
              -mx-2 sm:-mx-4 lg:mx-0
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
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      currentStep > step.id
                        ? isStepValid 
                          ? 'bg-gray-900 dark:bg-emerald-900 text-white'
                          : 'bg-orange-500 text-white'
                        : currentStep === step.id
                        ? 'bg-gray-900 dark:bg-emerald-900 text-white ring-2 sm:ring-4 ring-gray-900/20 dark:ring-emerald-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      isStepValid ? (
                        <svg
                          className="w-3 h-3 sm:w-5 sm:h-5"
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
                          className="w-3 h-3 sm:w-5 sm:h-5"
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
                    className={`mt-1 sm:mt-2 text-[10px] sm:text-xs text-center max-w-[70px] sm:max-w-[90px] leading-tight transition-colors ${
                      currentStep >= step.id
                        ? 'text-gray-900 dark:text-emerald-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>

                {/* Connector */}
                {index < CREATE_PROPERTY_STEPS.length - 1 && (
                  <div
                    className={`w-6 sm:w-10 h-1 mx-1 sm:mx-2 rounded-full flex-shrink-0 transition-colors ${
                      currentStep > step.id
                        ? isStepValid 
                          ? 'bg-gray-900 dark:bg-emerald-900'
                          : 'bg-orange-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Desktop description */}
        <div className="hidden sm:block text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400 transition-colors">
            {CREATE_PROPERTY_STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 sm:mb-6 transition-colors">
        <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors">
            {CREATE_PROPERTY_STEPS[currentStep - 1].name}
          </h2>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div 
              ref={errorRef}
              className="mb-3 sm:mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    {t('landlord.createProperty.fixErrors')}
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

          <div className="max-w-full sm:max-w-3xl">{renderStepContent()}</div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-4 md:px-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-full disabled:opacity-40 text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {t('landlord.createProperty.back')}
          </button>

          {currentStep < CREATE_PROPERTY_STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-3 bg-gray-900 dark:bg-emerald-900 hover:bg-gray-800 dark:hover:bg-emerald-800 text-white rounded-full transition-colors text-sm sm:text-base font-medium"
            >
              {t('landlord.createProperty.continue')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-3 bg-gray-900 dark:bg-emerald-900 hover:bg-gray-800 dark:hover:bg-emerald-800 text-white rounded-full disabled:opacity-50 transition-colors text-sm sm:text-base font-medium"
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
