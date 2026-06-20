'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { useCreatePropertyDraft } from '@/hooks/useProperty';
import { useCreateShortTermProperty } from '@/hooks/useCreateShortTermProperty';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { PropertyType, ShortTermPropertyType } from '@/API';
import { RentalType, isFeatureEnabled } from '@/config/features';
import { AccountPromptModal } from './AccountPromptModal';
import { GuestSuccessModal } from './GuestSuccessModal';
import { validatePhoneNumber, validateEmail, validateContactCompleteness } from '@/lib/validation/guest-contact';
import dynamic from 'next/dynamic';

import {
  StepIndicator,
  StepPropertyType,
  StepLocation,
  StepPricingDetails,
  StepPhotosPublish,
  useAIGeneration,
} from './create';
import type { PropertyDraftFormData, FormErrors } from './create';

const LazyAuthModal = dynamic(() => import('@/components/auth/LazyAuthModal'), { ssr: false });

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

  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [proceedAsGuest, setProceedAsGuest] = useState(false);
  const [showGuestSuccess, setShowGuestSuccess] = useState(false);
  const [guestPropertyId, setGuestPropertyId] = useState('');
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

  useEffect(() => {
    if (!user && !proceedAsGuest) setShowAccountPrompt(true);
  }, [user, proceedAsGuest]);

  const [formData, setFormData] = useState<PropertyDraftFormData>({
    title: '', propertyType: 'HOUSE', region: '', district: '', ward: '', street: '',
    monthlyRent: 0, nightlyRate: 0, cleaningFee: 0, currency: 'TZS',
    bedrooms: 1, bathrooms: 1, maxGuests: 2, minimumStay: 1, instantBookEnabled: false,
    guestPhoneNumber: '', guestWhatsappNumber: '', guestEmail: '',
  });

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const handleInputChange = useCallback(<K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const onAIFieldChange = useCallback((field: string, value: any) => {
    handleInputChange(field as keyof PropertyDraftFormData, value);
  }, [handleInputChange]);

  const { isGeneratingTitle, handleGenerateTitle, isGeneratingPrice, handleSuggestPrice, priceSuggestion, applyPriceSuggestion } =
    useAIGeneration(formData, isShortTerm, onAIFieldChange);

  const handleBlur = (field: keyof PropertyDraftFormData) => {
    if (!user && proceedAsGuest) {
      const newErrors: FormErrors = { ...errors };
      if (field === 'guestPhoneNumber' && formData.guestPhoneNumber) {
        const v = validatePhoneNumber(formData.guestPhoneNumber);
        if (!v.isValid) newErrors.guestPhoneNumber = v.error; else delete newErrors.guestPhoneNumber;
      }
      if (field === 'guestWhatsappNumber' && formData.guestWhatsappNumber) {
        const v = validatePhoneNumber(formData.guestWhatsappNumber);
        if (!v.isValid) newErrors.guestWhatsappNumber = v.error; else delete newErrors.guestWhatsappNumber;
      }
      if (field === 'guestEmail' && formData.guestEmail) {
        const v = validateEmail(formData.guestEmail);
        if (!v.isValid) newErrors.guestEmail = v.error; else delete newErrors.guestEmail;
      }
      setErrors(newErrors);
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    switch (stepNumber) {
      case 1: if (!formData.propertyType) newErrors.propertyType = 'Select a property type'; break;
      case 2: if (!formData.region) newErrors.region = 'Region is required'; if (!formData.district) newErrors.district = 'District is required'; break;
      case 3:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (isShortTerm) { if (!formData.nightlyRate || formData.nightlyRate <= 0) newErrors.nightlyRate = 'Nightly rate is required'; }
        else { if (!formData.monthlyRent || formData.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent is required'; }
        break;
      case 4:
        if (!user && proceedAsGuest) {
          if (formData.guestPhoneNumber) { const v = validatePhoneNumber(formData.guestPhoneNumber); if (!v.isValid) newErrors.guestPhoneNumber = v.error; }
          if (formData.guestWhatsappNumber) { const v = validatePhoneNumber(formData.guestWhatsappNumber); if (!v.isValid) newErrors.guestWhatsappNumber = v.error; }
          if (formData.guestEmail) { const v = validateEmail(formData.guestEmail); if (!v.isValid) newErrors.guestEmail = v.error; }
          const c = validateContactCompleteness(formData.guestPhoneNumber, formData.guestWhatsappNumber, formData.guestEmail);
          if (!c.isValid) { if (!formData.guestPhoneNumber) newErrors.guestPhoneNumber = c.error; else if (!formData.guestWhatsappNumber && !formData.guestEmail) newErrors.guestWhatsappNumber = c.error; }
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(step) && step < 4) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => { if (step > 1) { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const handleSubmit = async (publish: boolean) => {
    if (!validateStep(4)) return;
    if (!user && !proceedAsGuest) { setShowAccountPrompt(true); return; }
    if (publish && selectedMedia.length === 0) { showError('Media required', 'Add at least one image or video to publish'); return; }

    const guestFields = (!user && proceedAsGuest) ? { guestPhoneNumber: formData.guestPhoneNumber || undefined, guestWhatsappNumber: formData.guestWhatsappNumber || undefined, guestEmail: formData.guestEmail || undefined } : {};

    if (isShortTerm) {
      const result = await createShortTermDraft({ title: formData.title.trim(), propertyType: formData.propertyType as ShortTermPropertyType, region: formData.region, district: formData.district, nightlyRate: formData.nightlyRate || 0, currency: formData.currency, cleaningFee: formData.cleaningFee, maxGuests: formData.maxGuests, bedrooms: formData.bedrooms, bathrooms: formData.bathrooms, minimumStay: formData.minimumStay, latitude: coords.lat, longitude: coords.lng, images: selectedImages, videos: selectedVideos, ...guestFields });
      if (result.success) { if (result.isGuestUser) { setGuestPropertyId(result.propertyId || ''); setShowGuestSuccess(true); } else { showSuccess(result.status === 'AVAILABLE' ? 'Published 🎉' : 'Draft saved', result.status === 'AVAILABLE' ? 'Your short-term property is now live!' : 'Your short-term property draft has been created. Add images to publish it.'); router.push(redirectTo); } } else { showError('Failed', result.message); }
      return;
    }

    const result = await createDraft({ title: formData.title.trim(), propertyType: formData.propertyType as PropertyType, region: formData.region, district: formData.district, ward: formData.ward, street: formData.street, monthlyRent: formData.monthlyRent, currency: formData.currency, available: publish, bedrooms: formData.bedrooms || 1, bathrooms: formData.bathrooms || 1, images: selectedImages, videos: selectedVideos, latitude: coords.lat, longitude: coords.lng, ...guestFields });
    if (result.success) { if (result.isGuestUser) { setGuestPropertyId(result.propertyId || ''); setShowGuestSuccess(true); } else { showSuccess(publish ? 'Published 🎉' : 'Draft saved', publish ? 'Your property is now live' : 'You can finish it later using Edit Property'); router.push(redirectTo); } } else { showError('Failed', result.message); }
  };

  return (
    <>
      <NotificationModal {...notification} onClose={closeNotification} />
      <AccountPromptModal isOpen={showAccountPrompt} onClose={() => { setShowAccountPrompt(false); router.push('/'); }} onCreateAccount={() => { setShowAccountPrompt(false); setShowAuthModal(true); }} onContinueAsGuest={() => { setShowAccountPrompt(false); setProceedAsGuest(true); }} />
      <GuestSuccessModal isOpen={showGuestSuccess} propertyId={guestPropertyId} onCreateAccount={() => { setShowGuestSuccess(false); setShowAuthModal(true); }} onGoHome={() => { setShowGuestSuccess(false); router.push('/'); }} />
      {showAuthModal && <LazyAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialView="signup" onAuthSuccess={() => setShowAuthModal(false)} />}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">List a property</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Complete each step to list your property. You can save as draft anytime.</p>
        </header>

        <StepIndicator currentStep={step} />

        <div className="min-h-[320px]">
          {step === 1 && <StepPropertyType formData={formData} handleInputChange={handleInputChange} isShortTerm={isShortTerm} shortTermEnabled={shortTermEnabled} rentalType={rentalType} setRentalType={setRentalType} errors={errors} />}
          {step === 2 && <StepLocation formData={formData} setFormData={setFormData} errors={errors} coords={coords} setCoords={setCoords} />}
          {step === 3 && <StepPricingDetails formData={formData} handleInputChange={handleInputChange} isShortTerm={isShortTerm} errors={errors} isGeneratingTitle={isGeneratingTitle} handleGenerateTitle={handleGenerateTitle} isGeneratingPrice={isGeneratingPrice} handleSuggestPrice={handleSuggestPrice} priceSuggestion={priceSuggestion} applyPriceSuggestion={applyPriceSuggestion} />}
          {step === 4 && <StepPhotosPublish formData={formData} handleInputChange={handleInputChange} handleBlur={handleBlur} errors={errors} user={user} proceedAsGuest={proceedAsGuest} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} setSelectedImages={setSelectedImages} setSelectedVideos={setSelectedVideos} selectedImages={selectedImages} whatsappSameAsPhone={whatsappSameAsPhone} setWhatsappSameAsPhone={setWhatsappSameAsPhone} isCreating={isCreating} isCreatingShortTerm={isCreatingShortTerm} handleSubmit={handleSubmit} />}
        </div>

        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back
              </button>
            ) : <div />}
            <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors">
              Next<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back
            </button>
          </div>
        )}
      </div>
    </>
  );
};
