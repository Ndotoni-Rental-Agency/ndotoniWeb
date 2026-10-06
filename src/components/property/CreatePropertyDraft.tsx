'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { useCreatePropertyDraft } from '@/hooks/useProperty';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { PropertyType } from '@/API';
import { AccountPromptModal } from './AccountPromptModal';
import { GuestSuccessModal } from './GuestSuccessModal';
import { validatePhoneNumber, validateEmail, validateContactCompleteness } from '@/lib/validation/guest-contact';
import dynamic from 'next/dynamic';
import {
  useListingDraftPersistence,
  readListingDraft,
} from '@/hooks/useListingDraftPersistence';

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

  const [step, setStep] = useState(1);

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
    monthlyRent: 0, currency: 'TZS',
    bedrooms: 1, bathrooms: 1,
    guestPhoneNumber: '', guestWhatsappNumber: '', guestEmail: '',
  });

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  // Mirror of the latest computed errors so we can act on them synchronously
  // (scroll/shake) right after validateStep, before setState has flushed.
  const errorsRef = useRef<FormErrors>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  // ---- Autosave / restore ----------------------------------------------
  // A dropped connection or a backgrounded tab mid-upload shouldn't cost a
  // landlord their work. We quietly persist the wizard and offer it back.
  const ownerKey = user?.email ? `user:${user.email}` : 'guest';
  const [publishedOk, setPublishedOk] = useState(false);
  const [restorableAt, setRestorableAt] = useState<number | null>(null);
  // The step whose validation most recently failed, so the indicator can flag it.
  const [errorStep, setErrorStep] = useState<number | null>(null);

  // Detect a saved draft once we know the identity, so we can offer a restore.
  useEffect(() => {
    const saved = readListingDraft<PropertyDraftFormData>(ownerKey);
    setRestorableAt(saved ? saved.savedAt : null);
  }, [ownerKey]);

  const restoreDraft = useCallback(() => {
    const saved = readListingDraft<PropertyDraftFormData>(ownerKey);
    if (!saved) return;
    setFormData(saved.formData);
    setSelectedMedia(saved.selectedMedia ?? []);
    setSelectedImages(saved.selectedImages ?? []);
    setSelectedVideos(saved.selectedVideos ?? []);
    setCoords(saved.coords ?? { lat: 0, lng: 0 });
    setStep(saved.step && saved.step >= 1 && saved.step <= 4 ? saved.step : 1);
    setRestorableAt(null);
  }, [ownerKey]);

  // Only persist once there's something worth keeping, so an untouched visit
  // doesn't leave a stray "unfinished listing" banner for next time.
  const hasMeaningfulInput =
    Boolean(formData.title.trim()) ||
    Boolean(formData.region) ||
    Boolean(formData.district) ||
    Boolean(formData.ward?.trim()) ||
    Boolean(formData.street?.trim()) ||
    formData.monthlyRent > 0 ||
    selectedMedia.length > 0 ||
    step > 1;

  const { lastSavedAt, clear: clearDraft } = useListingDraftPersistence<PropertyDraftFormData>({
    ownerKey,
    enabled: !publishedOk && hasMeaningfulInput,
    snapshot: {
      step,
      formData,
      selectedMedia,
      selectedImages,
      selectedVideos,
      coords,
    },
  });

  const handleInputChange = useCallback(<K extends keyof PropertyDraftFormData>(field: K, value: PropertyDraftFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const onAIFieldChange = useCallback((field: string, value: any) => {
    handleInputChange(field as keyof PropertyDraftFormData, value);
  }, [handleInputChange]);

  const { isGeneratingTitle, handleGenerateTitle, titleError, isGeneratingPrice, handleSuggestPrice, priceError, priceSuggestion, applyPriceSuggestion } =
    useAIGeneration(formData, onAIFieldChange);

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

  // The ordered field list per step lets us scroll to (and focus) the first
  // thing that needs attention when validation fails.
  const STEP_FIELD_ORDER: Record<number, (keyof PropertyDraftFormData)[]> = {
    1: ['propertyType'],
    2: ['region', 'district', 'ward', 'street'],
    3: ['title', 'monthlyRent'],
    4: ['guestPhoneNumber', 'guestWhatsappNumber', 'guestEmail'],
  };

  const focusFirstError = useCallback((stepNumber: number, errs: FormErrors) => {
    const order = STEP_FIELD_ORDER[stepNumber] || [];
    const firstBad = order.find((field) => errs[field]);
    if (!firstBad) return;
    requestAnimationFrame(() => {
      // Prefer the exact field; fall back to the step's first data-field block
      // (e.g. the location selector groups region/district/ward/street).
      const el =
        document.querySelector<HTMLElement>(`[data-field="${firstBad}"]`) ||
        document.querySelector<HTMLElement>(`[data-field="${order[0]}"]`);
      if (!el) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      el.classList.remove('animate-shake');
      // reflow so the shake replays even if the class lingered
      void el.offsetWidth;
      if (!reduce) el.classList.add('animate-shake');
      el.querySelector<HTMLElement>('input, select, textarea, button')?.focus({ preventScroll: true });
    });
  }, []);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    switch (stepNumber) {
      case 1: if (!formData.propertyType) newErrors.propertyType = 'Select a property type'; break;
      case 2:
        if (!formData.region) newErrors.region = 'Region is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.ward?.trim()) newErrors.ward = 'Ward is required';
        if (!formData.street?.trim()) newErrors.street = 'Street is required';
        break;
      case 3:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.monthlyRent || formData.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent is required';
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
    errorsRef.current = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setErrorStep(null);
      if (step < 4) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    } else {
      setErrorStep(step);
      focusFirstError(step, errorsRef.current);
    }
  };
  const prevStep = () => { if (step > 1) { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const handleSubmit = async (publish: boolean) => {
    if (!validateStep(4)) { setErrorStep(4); focusFirstError(4, errorsRef.current); return; }
    setErrorStep(null);
    if (!user && !proceedAsGuest) { setShowAccountPrompt(true); return; }
    if (publish && selectedMedia.length === 0) { showError('Media required', 'Add at least one image or video to publish'); return; }

    const guestFields = (!user && proceedAsGuest) ? { guestPhoneNumber: formData.guestPhoneNumber || undefined, guestWhatsappNumber: formData.guestWhatsappNumber || undefined, guestEmail: formData.guestEmail || undefined } : {};

    const result = await createDraft({ title: formData.title.trim(), propertyType: formData.propertyType as PropertyType, region: formData.region, district: formData.district, ward: formData.ward, street: formData.street, monthlyRent: formData.monthlyRent, currency: formData.currency, available: publish, bedrooms: formData.bedrooms || 1, bathrooms: formData.bathrooms || 1, images: selectedImages, videos: selectedVideos, latitude: coords.lat, longitude: coords.lng, ...guestFields });
    if (result.success) {
      // The listing made it to the backend — stop autosaving and drop the
      // local draft so a future visit starts clean.
      setPublishedOk(true);
      clearDraft();
      if (result.isGuestUser) { setGuestPropertyId(result.propertyId || ''); setShowGuestSuccess(true); } else { showSuccess(publish ? 'Published 🎉' : 'Draft saved', publish ? 'Your property is now live' : 'You can finish it later using Edit Property'); router.push(redirectTo); } } else { showError('Failed', result.message); }
  };

  return (
    <>
      <NotificationModal {...notification} onClose={closeNotification} />
      <AccountPromptModal isOpen={showAccountPrompt} onClose={() => { setShowAccountPrompt(false); router.push('/'); }} onCreateAccount={() => { setShowAccountPrompt(false); setShowAuthModal(true); }} onContinueAsGuest={() => { setShowAccountPrompt(false); setProceedAsGuest(true); }} />
      <GuestSuccessModal isOpen={showGuestSuccess} propertyId={guestPropertyId} onCreateAccount={() => { setShowGuestSuccess(false); setShowAuthModal(true); }} onGoHome={() => { setShowGuestSuccess(false); router.push('/'); }} />
      {showAuthModal && <LazyAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialView="signup" onAuthSuccess={() => setShowAuthModal(false)} />}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <header>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">List a property</h1>
            {lastSavedAt && !publishedOk && (
              <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                <svg className="h-3.5 w-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Progress saved
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Complete each step to list your property. Your progress is saved automatically on this device.</p>
        </header>

        {/* Offer to restore a previously abandoned draft. */}
        {restorableAt && (
          <div className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20 sm:flex-row sm:items-center sm:justify-between animate-panel-in">
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">You have an unfinished listing</p>
                <p className="text-xs text-brand-700 dark:text-brand-300">Pick up where you left off, or start fresh.</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => { clearDraft(); setRestorableAt(null); }}
                className="rounded-lg px-3 py-2 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-900/40 transition-colors"
              >
                Start fresh
              </button>
              <button
                type="button"
                onClick={restoreDraft}
                className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        <StepIndicator currentStep={step} errorStep={errorStep} />

        {/* key on step so each panel re-enters with a soft transition */}
        <div key={step} className="min-h-[320px] animate-panel-in">
          {step === 1 && <StepPropertyType formData={formData} handleInputChange={handleInputChange} errors={errors} />}
          {step === 2 && <StepLocation formData={formData} setFormData={setFormData} errors={errors} coords={coords} setCoords={setCoords} />}
          {step === 3 && <StepPricingDetails formData={formData} handleInputChange={handleInputChange} errors={errors} isGeneratingTitle={isGeneratingTitle} handleGenerateTitle={handleGenerateTitle} titleError={titleError} isGeneratingPrice={isGeneratingPrice} handleSuggestPrice={handleSuggestPrice} priceError={priceError} priceSuggestion={priceSuggestion} applyPriceSuggestion={applyPriceSuggestion} />}
          {step === 4 && <StepPhotosPublish formData={formData} handleInputChange={handleInputChange} handleBlur={handleBlur} errors={errors} user={user} proceedAsGuest={proceedAsGuest} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} setSelectedImages={setSelectedImages} setSelectedVideos={setSelectedVideos} selectedImages={selectedImages} whatsappSameAsPhone={whatsappSameAsPhone} setWhatsappSameAsPhone={setWhatsappSameAsPhone} isCreating={isCreating} handleSubmit={handleSubmit} />}
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
