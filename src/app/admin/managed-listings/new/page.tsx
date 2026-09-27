'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { GraphQLClient } from '@/lib/graphql-client';
import { PhoneInput } from '@/components/ui/PhoneInput';
import MediaSelector from '@/components/media/MediaSelector';
import {
  StepPropertyType,
  StepLocation,
  StepPricingDetails,
  useAIGeneration,
} from '@/components/property/create';
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

interface OwnerForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  payoutMpesaPhone: string;
  payoutMpesaName: string;
}

interface CreatedListing {
  propertyId: string;
  ownerName: string;
  ownerCreated: boolean;
}

const EMPTY_OWNER: OwnerForm = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  whatsappNumber: '',
  email: '',
  payoutMpesaPhone: '',
  payoutMpesaName: '',
};

const EMPTY_PROPERTY: PropertyDraftFormData = {
  title: '',
  propertyType: 'HOUSE',
  region: '',
  district: '',
  ward: '',
  street: '',
  monthlyRent: 0,
  currency: 'TZS',
  bedrooms: 1,
  bathrooms: 1,
};

const inputClass =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const sectionClass = 'bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5';

export default function AdminManagedRentalPage() {
  const [owner, setOwner] = useState<OwnerForm>(EMPTY_OWNER);
  const [formData, setFormData] = useState<PropertyDraftFormData>(EMPTY_PROPERTY);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedListing | null>(null);

  const handleInputChange = useCallback(<K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const onAIFieldChange = useCallback((field: string, value: any) => {
    handleInputChange(field as keyof PropertyDraftFormData, value);
  }, [handleInputChange]);

  const { isGeneratingTitle, handleGenerateTitle, isGeneratingPrice, handleSuggestPrice, priceSuggestion, applyPriceSuggestion } =
    useAIGeneration(formData, onAIFieldChange);

  function updateOwner(field: keyof OwnerForm, value: string) {
    setOwner(prev => ({ ...prev, [field]: value }));
  }

  const phoneOk = isValidPhoneNumber(owner.phoneNumber || '');
  const optionalPhoneOk = (value: string) => !value || isValidPhoneNumber(value);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.propertyType) newErrors.propertyType = 'Select a property type';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.monthlyRent || formData.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent is required';
    setErrors(newErrors);

    if (!owner.firstName.trim()) return fail("The owner's first name is required.");
    if (!phoneOk) return fail("Enter a valid phone number for the owner.");
    if (!optionalPhoneOk(owner.whatsappNumber)) return fail('The WhatsApp number is not valid.');
    if (!optionalPhoneOk(owner.payoutMpesaPhone)) return fail('The M-Pesa number is not valid.');
    if (Object.keys(newErrors).length > 0) return fail('Fill in the highlighted property fields.');
    if (selectedMedia.length === 0) return fail('Add at least one photo or video.');
    return true;
  }

  function fail(message: string): false {
    setError(message);
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
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
            ward: formData.ward || undefined,
            street: formData.street || undefined,
            monthlyRent: formData.monthlyRent,
            currency: formData.currency,
            available: true,
            bedrooms: formData.bedrooms || 1,
            bathrooms: formData.bathrooms || 1,
            images: selectedImages,
            videos: selectedVideos,
            latitude: coords.lat,
            longitude: coords.lng,
          },
        },
      });

      const result = data.adminCreateManagedRental;
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

  function reset() {
    setOwner(EMPTY_OWNER);
    setFormData(EMPTY_PROPERTY);
    setCoords({ lat: 0, lng: 0 });
    setSelectedMedia([]);
    setSelectedImages([]);
    setSelectedVideos([]);
    setErrors({});
    setError(null);
    setCreated(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (created) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <CheckCircleIcon className="h-14 w-14 text-brand-600 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Property listed</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
          {created.ownerCreated
            ? `We created an account for ${created.ownerName}. Inquiries and updates will reach them on WhatsApp.`
            : `${created.ownerName} already had an account with this number, so the property was added to it.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href={`/property/${created.propertyId}`}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            View listing
          </Link>
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            List another property
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">List a rental for an owner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
          For owners without an account. We create one for them behind the scenes, keyed to their phone number,
          and they manage it through WhatsApp. The listing goes live as verified, and you&apos;re recorded as the admin who listed it.
        </p>
      </header>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Owner details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>First name <span className="text-red-500">*</span></span>
            <input className={inputClass} value={owner.firstName} onChange={e => updateOwner('firstName', e.target.value)} required />
          </label>
          <label className="block">
            <span className={labelClass}>Last name</span>
            <input className={inputClass} value={owner.lastName} onChange={e => updateOwner('lastName', e.target.value)} />
          </label>
        </div>
        <div className="max-w-md">
          <PhoneInput
            label={<>Phone number <span className="text-red-500">*</span></>}
            value={owner.phoneNumber}
            onChange={v => updateOwner('phoneNumber', v || '')}
            helperText="If the owner already has an account with this number, the property is added to it."
            error={owner.phoneNumber && !phoneOk ? 'Enter a valid phone number' : undefined}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhoneInput
            label="WhatsApp number (if different)"
            value={owner.whatsappNumber}
            onChange={v => updateOwner('whatsappNumber', v || '')}
          />
          <label className="block">
            <span className={labelClass}>Email (optional)</span>
            <input type="email" className={inputClass} value={owner.email} onChange={e => updateOwner('email', e.target.value)} />
          </label>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">M-Pesa payout (optional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PhoneInput
              label="M-Pesa number"
              value={owner.payoutMpesaPhone}
              onChange={v => updateOwner('payoutMpesaPhone', v || '')}
            />
            <label className="block">
              <span className={labelClass}>Name on M-Pesa</span>
              <input className={inputClass} value={owner.payoutMpesaName} onChange={e => updateOwner('payoutMpesaName', e.target.value)} />
            </label>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property</h2>
        <StepPropertyType formData={formData} handleInputChange={handleInputChange} errors={errors} />
        <StepLocation formData={formData} setFormData={setFormData} errors={errors} coords={coords} setCoords={setCoords} />
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
        <div>
          <span className={labelClass}>Photos & videos <span className="text-red-500">*</span></span>
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
      </section>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Listing...' : 'List property'}
        </button>
      </div>
    </form>
  );
}
