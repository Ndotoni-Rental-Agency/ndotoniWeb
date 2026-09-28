'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { GraphQLClient } from '@/lib/graphql-client';
import { PhoneInput } from '@/components/ui/PhoneInput';
import MediaSelector from '@/components/media/MediaSelector';
import {
  StepIndicator,
  StepPropertyType,
  StepLocation,
  StepPricingDetails,
  useAIGeneration,
} from '@/components/property/create';
import { PROPERTY_TYPES } from '@/components/property/create/constants';
import type { PropertyDraftFormData, FormErrors } from '@/components/property/create';

// Admin-only mutation — lists a long-term rental on behalf of an owner with no account.
const adminCreateManagedRental = /* GraphQL */ `
  mutation AdminCreateManagedRental($input: AdminCreateManagedRentalInput!) {
    adminCreateManagedRental(input: $input) {
      propertyId
      status
      ownerUserId
      ownerCreated
    }
  }
`;

const STEPS = [
  { id: 1, label: 'Owner' },
  { id: 2, label: 'Type' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Price' },
  { id: 5, label: 'Photos' },
  { id: 6, label: 'Review' },
] as const;
const LAST_STEP = STEPS.length;

interface OwnerForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  payoutMpesaPhone: string;
  payoutMpesaName: string;
}

interface Media {
  all: string[];
  images: string[];
  videos: string[];
}

interface Draft {
  step: number;
  owner: OwnerForm;
  formData: PropertyDraftFormData;
  coords: { lat: number; lng: number };
  media: Media;
}

const EMPTY_DRAFT: Draft = {
  step: 1,
  owner: { firstName: '', lastName: '', phoneNumber: '', whatsappNumber: '', email: '', payoutMpesaPhone: '', payoutMpesaName: '' },
  formData: {
    title: '', propertyType: 'HOUSE', region: '', district: '', ward: '', street: '',
    monthlyRent: 0, currency: 'TZS', bedrooms: 1, bathrooms: 1,
  },
  coords: { lat: 0, lng: 0 },
  media: { all: [], images: [], videos: [] },
};

// Field visits drop connections and tabs get closed; keep the half-filled form on this device.
const DRAFT_KEY = 'ndotoni.admin.managedRentalDraft';

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_DRAFT, ...JSON.parse(raw) } : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

function saveDraft(draft: Draft | null) {
  try {
    if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* private mode or storage full: the form still works, it just isn't remembered */
  }
}

const inputClass =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

const titleCase = (s?: string) =>
  (s || '').replace(/[-_]+/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export function ManagedRentalWizard() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [restored, setRestored] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ propertyId: string; ownerName: string; ownerCreated: boolean } | null>(null);

  const { step, owner, formData, coords, media } = draft;

  useEffect(() => {
    const saved = loadDraft();
    setDraft(saved);
    setRestored(saved !== EMPTY_DRAFT && (!!saved.owner.firstName || !!saved.formData.title));
  }, []);

  useEffect(() => {
    if (!created) saveDraft(draft);
  }, [draft, created]);

  const patch = useCallback((p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p })), []);

  const setFormData = useCallback<React.Dispatch<React.SetStateAction<PropertyDraftFormData>>>((action) => {
    setDraft((d) => ({ ...d, formData: typeof action === 'function' ? action(d.formData) : action }));
  }, []);

  const setCoords = useCallback<React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>>((action) => {
    setDraft((d) => ({ ...d, coords: typeof action === 'function' ? action(d.coords) : action }));
  }, []);

  const handleInputChange = useCallback(<K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, [setFormData]);

  const onAIFieldChange = useCallback((field: string, value: any) => {
    handleInputChange(field as keyof PropertyDraftFormData, value);
  }, [handleInputChange]);

  const { isGeneratingTitle, handleGenerateTitle, isGeneratingPrice, handleSuggestPrice, priceSuggestion, applyPriceSuggestion } =
    useAIGeneration(formData, onAIFieldChange);

  function updateOwner(field: keyof OwnerForm, value: string) {
    patch({ owner: { ...owner, [field]: value } });
  }

  const phoneOk = isValidPhoneNumber(owner.phoneNumber || '');
  const optionalPhoneOk = (value: string) => !value || isValidPhoneNumber(value);

  /** Checks one step; returns an error message to show, or null when it's complete. */
  function checkStep(n: number): string | null {
    const newErrors: FormErrors = {};
    if (n === 1) {
      if (!owner.firstName.trim()) return "Add the owner's first name.";
      if (!phoneOk) return "Enter a valid phone number for the owner.";
      if (!optionalPhoneOk(owner.whatsappNumber)) return 'The WhatsApp number is not valid.';
      if (!optionalPhoneOk(owner.payoutMpesaPhone)) return 'The M-Pesa number is not valid.';
    }
    if (n === 2 && !formData.propertyType) newErrors.propertyType = 'Select a property type';
    if (n === 3) {
      if (!formData.region) newErrors.region = 'Region is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.ward?.trim()) newErrors.ward = 'Ward is required';
      if (!formData.street?.trim()) newErrors.street = 'Street is required';
    }
    if (n === 4) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.monthlyRent || formData.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent is required';
    }
    if (n === 5 && media.all.length === 0) return 'Add at least one photo or video.';
    setErrors(newErrors);
    return Object.keys(newErrors).length > 0 ? 'Fill in the highlighted fields.' : null;
  }

  function goTo(n: number) {
    setError(null);
    patch({ step: n });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    const problem = checkStep(step);
    if (problem) return setError(problem);
    goTo(step + 1);
  }

  async function submit() {
    for (let n = 1; n < LAST_STEP; n++) {
      const problem = checkStep(n);
      if (problem) {
        goTo(n);
        setError(problem);
        return;
      }
    }
    setError(null);
    setLoading(true);
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        adminCreateManagedRental: { propertyId: string; ownerCreated: boolean };
      }>(adminCreateManagedRental, {
        input: {
          owner: {
            firstName: owner.firstName.trim(),
            lastName: owner.lastName.trim() || undefined,
            phoneNumber: owner.phoneNumber,
            whatsappNumber: owner.whatsappNumber || undefined,
            email: owner.email.trim() || undefined,
            ...(owner.payoutMpesaPhone && {
              payoutMethod: 'MPESA',
              payoutMpesaPhone: owner.payoutMpesaPhone,
              payoutMpesaName: owner.payoutMpesaName.trim() || undefined,
            }),
          },
          property: {
            title: formData.title.trim(),
            propertyType: formData.propertyType,
            region: formData.region,
            district: formData.district,
            ward: formData.ward?.trim(),
            street: formData.street?.trim(),
            monthlyRent: formData.monthlyRent,
            currency: formData.currency,
            available: true,
            bedrooms: formData.bedrooms || 1,
            bathrooms: formData.bathrooms || 1,
            images: media.images,
            videos: media.videos,
            latitude: coords.lat,
            longitude: coords.lng,
          },
        },
      });

      const result = data.adminCreateManagedRental;
      saveDraft(null);
      setCreated({
        propertyId: result.propertyId,
        ownerName: `${owner.firstName} ${owner.lastName}`.trim(),
        ownerCreated: result.ownerCreated,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error creating managed rental:', err);
      setError(err?.errors?.[0]?.message || err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function startOver() {
    saveDraft(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setError(null);
    setCreated(null);
    setRestored(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (created) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <CheckCircleIcon className="h-14 w-14 text-brand-600 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Rental listed</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed max-w-md mx-auto">
          {created.ownerCreated
            ? `We created an account for ${created.ownerName}. Inquiries and updates will reach them on WhatsApp.`
            : `${created.ownerName} already had an account with this number, so the rental was added to it.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href={`/host/properties/${created.propertyId}/edit`}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            Add more details
          </Link>
          <Link
            href={`/property/${created.propertyId}`}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            View listing
          </Link>
          <button
            type="button"
            onClick={startOver}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            List another
          </button>
        </div>
        <Link href="/admin/managed-listings" className="inline-block mt-6 text-sm text-gray-500 dark:text-gray-400 hover:underline">
          Back to managed listings
        </Link>
      </div>
    );
  }

  const typeLabel = PROPERTY_TYPES.find((t) => t.value === formData.propertyType)?.label || formData.propertyType;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/managed-listings"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Managed listings
        </Link>
        {(restored || step > 1) && (
          <button type="button" onClick={startOver} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
            Start over
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-8 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">List a rental for an owner</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            For owners without an account. We create one for them from their phone number, and they manage it on WhatsApp.
            {restored && ' Picking up where you left off.'}
          </p>
        </header>

        <div className="overflow-x-auto -mx-2 px-2">
          <StepIndicator currentStep={step} steps={STEPS} />
        </div>

        <div className="min-h-[320px]">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Who owns the property?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  If they already have an account with this number, the rental is added to it.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelClass}>First name <span className="text-red-500">*</span></span>
                  <input className={inputClass} value={owner.firstName} onChange={(e) => updateOwner('firstName', e.target.value)} autoFocus />
                </label>
                <label className="block">
                  <span className={labelClass}>Last name</span>
                  <input className={inputClass} value={owner.lastName} onChange={(e) => updateOwner('lastName', e.target.value)} />
                </label>
              </div>
              <PhoneInput
                label={<>Phone number <span className="text-red-500">*</span></>}
                value={owner.phoneNumber}
                onChange={(v) => updateOwner('phoneNumber', v || '')}
                error={owner.phoneNumber && !phoneOk ? 'Enter a valid phone number' : undefined}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PhoneInput label="WhatsApp number (if different)" value={owner.whatsappNumber} onChange={(v) => updateOwner('whatsappNumber', v || '')} />
                <label className="block">
                  <span className={labelClass}>Email (optional)</span>
                  <input type="email" className={inputClass} value={owner.email} onChange={(e) => updateOwner('email', e.target.value)} />
                </label>
              </div>
              <details className="rounded-xl border border-gray-200 dark:border-gray-700 p-4" open={!!owner.payoutMpesaPhone}>
                <summary className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">M-Pesa payout (optional)</summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <PhoneInput label="M-Pesa number" value={owner.payoutMpesaPhone} onChange={(v) => updateOwner('payoutMpesaPhone', v || '')} />
                  <label className="block">
                    <span className={labelClass}>Name on M-Pesa</span>
                    <input className={inputClass} value={owner.payoutMpesaName} onChange={(e) => updateOwner('payoutMpesaName', e.target.value)} />
                  </label>
                </div>
              </details>
            </div>
          )}

          {step === 2 && <StepPropertyType formData={formData} handleInputChange={handleInputChange} errors={errors} />}
          {step === 3 && <StepLocation formData={formData} setFormData={setFormData} errors={errors} coords={coords} setCoords={setCoords} />}
          {step === 4 && (
            <StepPricingDetails
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              isGeneratingTitle={isGeneratingTitle}
              handleGenerateTitle={handleGenerateTitle}
              isGeneratingPrice={isGeneratingPrice}
              handleSuggestPrice={handleSuggestPrice}
              priceSuggestion={priceSuggestion}
              applyPriceSuggestion={applyPriceSuggestion}
            />
          )}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Photos and videos</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">At least one. You can add more later.</p>
              </div>
              <MediaSelector
                selectedMedia={media.all}
                onMediaChange={(all, images, videos) => patch({ media: { all, images: images || [], videos: videos || [] } })}
                maxSelection={10}
              />
            </div>
          )}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Check and list</h2>
              <ReviewRow label="Owner" onEdit={() => goTo(1)}>
                {`${owner.firstName} ${owner.lastName}`.trim()} · {owner.phoneNumber}
                {owner.payoutMpesaPhone && <span className="block text-gray-500">M-Pesa payout: {owner.payoutMpesaPhone}</span>}
              </ReviewRow>
              <ReviewRow label="Type" onEdit={() => goTo(2)}>{typeLabel}</ReviewRow>
              <ReviewRow label="Location" onEdit={() => goTo(3)}>
                {[formData.street, formData.ward, formData.district, formData.region].filter(Boolean).map(titleCase).join(', ')}
              </ReviewRow>
              <ReviewRow label="Listing" onEdit={() => goTo(4)}>
                <span className="font-medium">{formData.title}</span>
                <span className="block text-gray-500">
                  {formData.currency} {formData.monthlyRent.toLocaleString()} / month · {formData.bedrooms || 1} bed · {formData.bathrooms || 1} bath
                </span>
              </ReviewRow>
              <ReviewRow label="Media" onEdit={() => goTo(5)}>
                <div className="flex gap-2 overflow-x-auto">
                  {media.images.slice(0, 6).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                  ))}
                  {media.all.length > 6 && <span className="self-center text-gray-500">+{media.all.length - 6}</span>}
                </div>
              </ReviewRow>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                The rental goes live as verified, and you&apos;re recorded as the admin who listed it.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          ) : <div />}
          {step < LAST_STEP ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Listing…' : 'List rental'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="min-w-0 text-sm text-gray-900 dark:text-white">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {children}
      </div>
      <button type="button" onClick={onEdit} className="text-sm text-brand-600 hover:underline flex-shrink-0">
        Edit
      </button>
    </div>
  );
}
