'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { useCreatePropertyDraft } from '@/hooks/useProperty';
import { useCreateShortTermProperty } from '@/hooks/useCreateShortTermProperty';
import { NotificationModal } from '@/components/ui/NotificationModal';
import LocationSelector from '@/components/location/LocationSelector';
import MediaSelector from '@/components/media/MediaSelector';
import { Counter, NumberInput } from '@/components/shared/forms';
import { PropertyType, ShortTermPropertyType } from '@/API';
import LocationMapPicker from '../location/LocationMapPicker';
import { RentalType, isFeatureEnabled } from '@/config/features';
import { RentalTypeToggle } from '@/components/home/RentalTypeToggle';
import { AccountPromptModal } from './AccountPromptModal';
import { GuestSuccessModal } from './GuestSuccessModal';
import { validatePhoneNumber, validateEmail, validateContactCompleteness } from '@/lib/validation/guest-contact';
import dynamic from 'next/dynamic';

const LazyAuthModal = dynamic(() => import('@/components/auth/LazyAuthModal'), {
  ssr: false,
});

/* ---------- Constants ---------- */

const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'House', emoji: '🏠' },
  { value: 'APARTMENT', label: 'Apartment', emoji: '🏢' },
  { value: 'STUDIO', label: 'Studio', emoji: '🛏️' },
  { value: 'ROOM', label: 'Room', emoji: '🚪' },
  { value: 'COMMERCIAL', label: 'Commercial', emoji: '🏬' },
] as const;

const SHORT_TERM_PROPERTY_TYPES = [
  { value: 'HOTEL', label: 'Hotel', emoji: '🏨' },
  { value: 'VILLA', label: 'Villa', emoji: '🏡' },
  { value: 'APARTMENT', label: 'Apartment', emoji: '🏢' },
  { value: 'GUESTHOUSE', label: 'Guest House', emoji: '🛖' },
  { value: 'RESORT', label: 'Resort', emoji: '🌴' },
  { value: 'HOSTEL', label: 'Hostel', emoji: '🛌' },
] as const;

const STEPS = [
  { id: 1, label: 'Type & Rental' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Pricing & Details' },
  { id: 4, label: 'Photos & Publish' },
];

/* ---------- Types ---------- */

interface PropertyDraftFormData {
  title: string;
  propertyType: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  monthlyRent: number;
  nightlyRate?: number;
  cleaningFee?: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  minimumStay?: number;
  instantBookEnabled?: boolean;
  guestPhoneNumber?: string;
  guestWhatsappNumber?: string;
  guestEmail?: string;
}

type FormErrors = Partial<Record<keyof PropertyDraftFormData, string>>;

/* ---------- Step Progress Indicator ---------- */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center w-full">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                s.id === currentStep
                  ? 'bg-brand-600 text-white ring-2 ring-brand-200'
                  : s.id < currentStep
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {s.id < currentStep ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.id
              )}
            </span>
            <span
              className={`mt-1 text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                s.id === currentStep
                  ? 'text-brand-600 dark:text-brand-400'
                  : s.id < currentStep
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {s.label}
            </span>
          </div>
          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-14 h-0.5 mx-1 sm:mx-2 rounded mb-5 ${
                s.id < currentStep ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Main Component ---------- */

export const CreatePropertyDraft: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const redirectTo = searchParams.get('from') === 'host' ? '/host' : '/host/properties';
  const { notification, showSuccess, showError, closeNotification } = useNotification();
  const { createDraft, isCreating } = useCreatePropertyDraft();
  const { createDraft: createShortTermDraft, isCreating: isCreatingShortTerm } = useCreateShortTermProperty();
  const shortTermEnabled = isFeatureEnabled('shortTermStays');

  const [step, setStep] = useState(1);
  const [rentalType, setRentalType] = useState<RentalType>(RentalType.LONG_TERM);
  const isShortTerm = shortTermEnabled && rentalType === RentalType.SHORT_TERM;

  // Account prompt modal state
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [proceedAsGuest, setProceedAsGuest] = useState(false);

  // Guest success modal state
  const [showGuestSuccess, setShowGuestSuccess] = useState(false);
  const [guestPropertyId, setGuestPropertyId] = useState('');

  // WhatsApp same as phone checkbox
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!user && !proceedAsGuest) {
      setShowAccountPrompt(true);
    }
  }, [user, proceedAsGuest]);

  const [formData, setFormData] = useState<PropertyDraftFormData>({
    title: '',
    propertyType: 'HOUSE',
    region: '',
    district: '',
    ward: '',
    street: '',
    monthlyRent: 0,
    nightlyRate: 0,
    cleaningFee: 0,
    currency: 'TZS',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    minimumStay: 1,
    instantBookEnabled: false,
    guestPhoneNumber: '',
    guestWhatsappNumber: '',
    guestEmail: '',
  });

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  /* ---------- Helpers ---------- */

  const handleInputChange = <K extends keyof PropertyDraftFormData>(
    field: K,
    value: PropertyDraftFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBlur = (field: keyof PropertyDraftFormData) => {
    if (!user && proceedAsGuest) {
      const newErrors: FormErrors = { ...errors };

      if (field === 'guestPhoneNumber' && formData.guestPhoneNumber) {
        const validation = validatePhoneNumber(formData.guestPhoneNumber);
        if (!validation.isValid) {
          newErrors.guestPhoneNumber = validation.error;
        } else {
          delete newErrors.guestPhoneNumber;
        }
      }

      if (field === 'guestWhatsappNumber' && formData.guestWhatsappNumber) {
        const validation = validatePhoneNumber(formData.guestWhatsappNumber);
        if (!validation.isValid) {
          newErrors.guestWhatsappNumber = validation.error;
        } else {
          delete newErrors.guestWhatsappNumber;
        }
      }

      if (field === 'guestEmail' && formData.guestEmail) {
        const validation = validateEmail(formData.guestEmail);
        if (!validation.isValid) {
          newErrors.guestEmail = validation.error;
        } else {
          delete newErrors.guestEmail;
        }
      }

      setErrors(newErrors);
    }
  };

  /* ---------- Per-step validation ---------- */

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.propertyType) newErrors.propertyType = 'Select a property type';
        break;

      case 2:
        if (!formData.region) newErrors.region = 'Region is required';
        if (!formData.district) newErrors.district = 'District is required';
        break;

      case 3:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (isShortTerm) {
          if (!formData.nightlyRate || formData.nightlyRate <= 0)
            newErrors.nightlyRate = 'Nightly rate is required';
        } else {
          if (!formData.monthlyRent || formData.monthlyRent <= 0)
            newErrors.monthlyRent = 'Monthly rent is required';
        }
        break;

      case 4:
        // Validate guest contact fields if user is not authenticated
        if (!user && proceedAsGuest) {
          if (formData.guestPhoneNumber) {
            const phoneValidation = validatePhoneNumber(formData.guestPhoneNumber);
            if (!phoneValidation.isValid) {
              newErrors.guestPhoneNumber = phoneValidation.error;
            }
          }
          if (formData.guestWhatsappNumber) {
            const whatsappValidation = validatePhoneNumber(formData.guestWhatsappNumber);
            if (!whatsappValidation.isValid) {
              newErrors.guestWhatsappNumber = whatsappValidation.error;
            }
          }
          if (formData.guestEmail) {
            const emailValidation = validateEmail(formData.guestEmail);
            if (!emailValidation.isValid) {
              newErrors.guestEmail = emailValidation.error;
            }
          }
          const completenessValidation = validateContactCompleteness(
            formData.guestPhoneNumber,
            formData.guestWhatsappNumber,
            formData.guestEmail
          );
          if (!completenessValidation.isValid) {
            if (!formData.guestPhoneNumber) {
              newErrors.guestPhoneNumber = completenessValidation.error;
            } else if (!formData.guestWhatsappNumber && !formData.guestEmail) {
              newErrors.guestWhatsappNumber = completenessValidation.error;
            }
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step) && step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async (publish: boolean) => {
    if (!validateStep(4)) return;

    // Check authentication before proceeding
    if (!user && !proceedAsGuest) {
      setShowAccountPrompt(true);
      return;
    }

    if (publish && selectedMedia.length === 0) {
      showError('Media required', 'Add at least one image or video to publish');
      return;
    }

    // Handle short-term property creation
    if (isShortTerm) {
      const result = await createShortTermDraft({
        title: formData.title.trim(),
        propertyType: formData.propertyType as ShortTermPropertyType,
        region: formData.region,
        district: formData.district,
        nightlyRate: formData.nightlyRate || 0,
        currency: formData.currency,
        cleaningFee: formData.cleaningFee,
        maxGuests: formData.maxGuests,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        minimumStay: formData.minimumStay,
        latitude: coords.lat,
        longitude: coords.lng,
        images: selectedImages,
        videos: selectedVideos,
        ...((!user && proceedAsGuest) && {
          guestPhoneNumber: formData.guestPhoneNumber || undefined,
          guestWhatsappNumber: formData.guestWhatsappNumber || undefined,
          guestEmail: formData.guestEmail || undefined,
        }),
      });

      if (result.success) {
        if (result.isGuestUser) {
          setGuestPropertyId(result.propertyId || '');
          setShowGuestSuccess(true);
        } else {
          const wasPublished = result.status === 'AVAILABLE';
          showSuccess(
            wasPublished ? 'Published 🎉' : 'Draft saved',
            wasPublished
              ? 'Your short-term property is now live!'
              : 'Your short-term property draft has been created. Add images to publish it.'
          );
          router.push(redirectTo);
        }
      } else {
        showError('Failed', result.message);
      }
      return;
    }

    // Handle long-term property creation
    const result = await createDraft({
      title: formData.title.trim(),
      propertyType: formData.propertyType as PropertyType,
      region: formData.region,
      district: formData.district,
      ward: formData.ward,
      street: formData.street,
      monthlyRent: formData.monthlyRent,
      currency: formData.currency,
      available: publish,
      bedrooms: formData.bedrooms || 1,
      bathrooms: formData.bathrooms || 1,
      images: selectedImages,
      videos: selectedVideos,
      latitude: coords.lat,
      longitude: coords.lng,
      ...((!user && proceedAsGuest) && {
        guestPhoneNumber: formData.guestPhoneNumber || undefined,
        guestWhatsappNumber: formData.guestWhatsappNumber || undefined,
        guestEmail: formData.guestEmail || undefined,
      }),
    });

    if (result.success) {
      if (result.isGuestUser) {
        setGuestPropertyId(result.propertyId || '');
        setShowGuestSuccess(true);
      } else {
        showSuccess(
          publish ? 'Published 🎉' : 'Draft saved',
          publish
            ? 'Your property is now live'
            : 'You can finish it later using Edit Property'
        );
        router.push(redirectTo);
      }
    } else {
      showError('Failed', result.message);
    }
  };

  /* ---------- Step Content Renderers ---------- */

  const renderStep1 = () => (
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Where is your property located?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Help tenants find your property by providing an accurate location.
        </p>
      </div>

      <LocationSelector
        value={{
          region: formData.region,
          district: formData.district,
          ward: formData.ward || '',
          street: formData.street || '',
        }}
        onChange={(loc) => setFormData((prev) => ({ ...prev, ...loc }))}
        required
      />

      {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
      {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}

      {formData.region && formData.district && (
        <LocationMapPicker
          location={formData}
          onChange={(c) => setCoords(c)}
        />
      )}
    </div>
  );

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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

  /* ---------- Render ---------- */

  return (
    <>
      <NotificationModal {...notification} onClose={closeNotification} />

      {/* Account Prompt Modal */}
      <AccountPromptModal
        isOpen={showAccountPrompt}
        onClose={() => {
          setShowAccountPrompt(false);
          router.push('/');
        }}
        onCreateAccount={() => {
          setShowAccountPrompt(false);
          setShowAuthModal(true);
        }}
        onContinueAsGuest={() => {
          setShowAccountPrompt(false);
          setProceedAsGuest(true);
        }}
      />

      {/* Guest Success Modal */}
      <GuestSuccessModal
        isOpen={showGuestSuccess}
        propertyId={guestPropertyId}
        onCreateAccount={() => {
          setShowGuestSuccess(false);
          setShowAuthModal(true);
        }}
        onGoHome={() => {
          setShowGuestSuccess(false);
          router.push('/');
        }}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <LazyAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialView="signup"
          onAuthSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            List a property
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete each step to list your property. You can save as draft anytime.
          </p>
        </header>

        {/* Step progress indicator */}
        <StepIndicator currentStep={step} />

        {/* Step content */}
        <div className="min-h-[320px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation buttons (shown for steps 1-3, step 4 has its own actions) */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Back button for step 4 */}
        {step === 4 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        )}
      </div>
    </>
  );
};
