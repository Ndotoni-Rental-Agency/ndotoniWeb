'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Upload,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MAX_REFERRALS_PER_USER,
  REFERRAL_COUNT_STORAGE_KEY,
  REFERRAL_ID_TYPES,
  type ReferralIdType,
} from '@/data/refer';
import { cn } from '@/lib/utils/common';

type Step = 1 | 2 | 'success' | 'limit';

interface ReferrerData {
  name: string;
  phone: string;
  idType: ReferralIdType | '';
  idFile: File | null;
}

interface LandlordData {
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  area: string;
  notes: string;
}

interface ReferrerErrors {
  name?: string;
  phone?: string;
  idType?: string;
  idFile?: string;
}

interface LandlordErrors {
  name?: string;
  phone?: string;
  area?: string;
  email?: string;
}

function isValidPhone(value: string) {
  return /^[+\d][\d\s\-]{6,}$/.test(value.trim());
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getSubmissionCount(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(REFERRAL_COUNT_STORAGE_KEY);
  const n = parseInt(raw ?? '0', 10);
  return Number.isNaN(n) ? 0 : n;
}

function incrementSubmissionCount() {
  const next = getSubmissionCount() + 1;
  localStorage.setItem(REFERRAL_COUNT_STORAGE_KEY, String(next));
  return next;
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2].map((n) => (
        <div key={n} className="flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step >= n
                ? 'bg-brand-600 text-white'
                : 'bg-stone-100 dark:bg-gray-800 text-ink-400 dark:text-gray-500',
            )}
          >
            {step > n ? <CheckCircle size={16} /> : n}
          </div>
          <span
            className={cn(
              'text-xs font-medium hidden sm:block',
              step >= n ? 'text-ink-900 dark:text-white' : 'text-ink-400 dark:text-gray-500',
            )}
          >
            {n === 1
              ? t('referPage.journey.step1Label')
              : t('referPage.journey.step2Label')}
          </span>
          {n === 1 && (
            <div
              className={cn(
                'w-8 sm:w-12 h-px',
                step >= 2 ? 'bg-brand-500' : 'bg-stone-200 dark:bg-gray-700',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ReferSubmitJourney() {
  const { t } = useLanguage();
  const landlordSectionRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [referrer, setReferrer] = useState<ReferrerData>({
    name: '',
    phone: '',
    idType: '',
    idFile: null,
  });
  const [landlord, setLandlord] = useState<LandlordData>({
    name: '',
    phone: '',
    whatsApp: '',
    email: '',
    area: '',
    notes: '',
  });
  const [referrerErrors, setReferrerErrors] = useState<ReferrerErrors>({});
  const [landlordErrors, setLandlordErrors] = useState<LandlordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remaining, setRemaining] = useState(MAX_REFERRALS_PER_USER);

  useEffect(() => {
    const count = getSubmissionCount();
    if (count >= MAX_REFERRALS_PER_USER) {
      setStep('limit');
    } else {
      setRemaining(MAX_REFERRALS_PER_USER - count);
    }
  }, []);

  function validateReferrer(): ReferrerErrors {
    const errs: ReferrerErrors = {};
    if (!referrer.name.trim()) errs.name = t('referPage.journey.errorRequired');
    if (!referrer.phone.trim()) errs.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(referrer.phone)) errs.phone = t('referPage.journey.errorPhone');
    if (!referrer.idType) errs.idType = t('referPage.journey.errorIdType');
    if (!referrer.idFile) errs.idFile = t('referPage.journey.errorIdFile');
    return errs;
  }

  function validateLandlord(): LandlordErrors {
    const errs: LandlordErrors = {};
    if (!landlord.name.trim()) errs.name = t('referPage.journey.errorRequired');
    if (!landlord.phone.trim()) errs.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(landlord.phone)) errs.phone = t('referPage.journey.errorPhone');
    if (!landlord.area.trim()) errs.area = t('referPage.journey.errorRequired');
    if (landlord.email && !isValidEmail(landlord.email))
      errs.email = t('referPage.journey.errorEmail');
    return errs;
  }

  function handleContinueToLandlord() {
    const errs = validateReferrer();
    if (Object.keys(errs).length > 0) {
      setReferrerErrors(errs);
      return;
    }
    setReferrerErrors({});
    setStep(2);
    setTimeout(() => {
      landlordSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateLandlord();
    if (Object.keys(errs).length > 0) {
      setLandlordErrors(errs);
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    incrementSubmissionCount();
    setIsSubmitting(false);
    setStep('success');
  }

  if (step === 'limit') {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-5">
        <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
          {t('referPage.journey.limitTitle')}
        </h2>
        <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed">
          {t('referPage.journey.limitMessage')}
        </p>
        <Link
          href="/refer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline underline-offset-2"
        >
          {t('referPage.journey.backToRefer')}
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    const left = Math.max(0, MAX_REFERRALS_PER_USER - getSubmissionCount());
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-200 dark:border-brand-700 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
            {t('referPage.journey.successTitle')}
          </h2>
          <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed">
            {t('referPage.journey.successMessage')}
          </p>
        </div>
        {left > 0 ? (
          <button
            type="button"
            onClick={() => {
              const count = getSubmissionCount();
              if (count >= MAX_REFERRALS_PER_USER) {
                setStep('limit');
                return;
              }
              setRemaining(MAX_REFERRALS_PER_USER - count);
              setLandlord({ name: '', phone: '', whatsApp: '', email: '', area: '', notes: '' });
              setLandlordErrors({});
              setStep(2);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-700 rounded-full font-semibold text-sm hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('referPage.journey.successAnother')}
          </button>
        ) : (
          <p className="text-xs text-ink-400 dark:text-gray-500">{t('referPage.journey.limitMessage')}</p>
        )}
        <Link
          href="/refer"
          className="block text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline underline-offset-2"
        >
          {t('referPage.journey.backToRefer')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <StepIndicator step={step} />

      {step === 1 && (
        <p className="text-xs text-center text-ink-400 dark:text-gray-500 mb-6">
          {t('referPage.journey.remainingLabel')}{' '}
          <span className="font-semibold text-ink-600 dark:text-gray-300">{remaining}</span>
        </p>
      )}

      {/* Step 1 — Your info */}
      <div
        className={cn(
          'rounded-2xl border bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-soft transition-opacity',
          step === 2 && 'opacity-60 pointer-events-none',
        )}
      >
        <h2 className="font-semibold text-ink-900 dark:text-white text-base mb-1">
          {t('referPage.journey.step1Heading')}
        </h2>
        <p className="text-sm text-ink-500 dark:text-gray-400 mb-6">
          {t('referPage.journey.step1Sub')}
        </p>

        <div className="space-y-4">
          <Field label={t('referPage.journey.yourName')} error={referrerErrors.name} required>
            <InputIcon
              icon={User}
              value={referrer.name}
              onChange={(v) => {
                setReferrer((p) => ({ ...p, name: v }));
                if (referrerErrors.name) setReferrerErrors((e) => ({ ...e, name: undefined }));
              }}
              placeholder={t('referPage.journey.yourNamePlaceholder')}
              hasError={!!referrerErrors.name}
              disabled={step === 2}
            />
          </Field>

          <Field label={t('referPage.journey.yourPhone')} error={referrerErrors.phone} required>
            <InputIcon
              icon={Phone}
              type="tel"
              value={referrer.phone}
              onChange={(v) => {
                setReferrer((p) => ({ ...p, phone: v }));
                if (referrerErrors.phone) setReferrerErrors((e) => ({ ...e, phone: undefined }));
              }}
              placeholder={t('referPage.journey.yourPhonePlaceholder')}
              hasError={!!referrerErrors.phone}
              disabled={step === 2}
            />
          </Field>

          <Field label={t('referPage.journey.idType')} error={referrerErrors.idType} required>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {REFERRAL_ID_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  disabled={step === 2}
                  onClick={() => {
                    setReferrer((p) => ({ ...p, idType: type }));
                    if (referrerErrors.idType)
                      setReferrerErrors((e) => ({ ...e, idType: undefined }));
                  }}
                  className={cn(
                    'px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-center',
                    referrer.idType === type
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                      : 'border-stone-200 dark:border-gray-700 text-ink-600 dark:text-gray-400 hover:border-brand-200',
                    referrerErrors.idType && 'border-red-300 dark:border-red-700',
                  )}
                >
                  {t(`referPage.journey.idType_${type}`)}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t('referPage.journey.idUpload')} error={referrerErrors.idFile} required>
            <label
              className={cn(
                'flex flex-col items-center justify-center gap-2 w-full py-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                referrer.idFile
                  ? 'border-brand-300 bg-brand-50/50 dark:bg-brand-900/10'
                  : 'border-stone-200 dark:border-gray-700 hover:border-brand-300 hover:bg-stone-50 dark:hover:bg-gray-800/50',
                referrerErrors.idFile && 'border-red-300 dark:border-red-700',
                step === 2 && 'pointer-events-none opacity-70',
              )}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                disabled={step === 2}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setReferrer((p) => ({ ...p, idFile: file }));
                  if (referrerErrors.idFile)
                    setReferrerErrors((err) => ({ ...err, idFile: undefined }));
                }}
              />
              {referrer.idFile ? (
                <>
                  <FileCheck size={24} className="text-brand-600 dark:text-brand-400" />
                  <span className="text-sm font-medium text-ink-900 dark:text-white px-4 text-center break-all">
                    {referrer.idFile.name}
                  </span>
                  <span className="text-xs text-brand-600 dark:text-brand-400">
                    {t('referPage.journey.idChange')}
                  </span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-ink-400 dark:text-gray-500" />
                  <span className="text-sm text-ink-500 dark:text-gray-400 text-center px-4">
                    {t('referPage.journey.idUploadHint')}
                  </span>
                </>
              )}
            </label>
          </Field>
        </div>

        {step === 1 && (
          <button
            type="button"
            onClick={handleContinueToLandlord}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all hover:scale-[1.01] shadow-green-sm"
          >
            {t('referPage.journey.continueToLandlord')}
            <ArrowRight size={16} />
          </button>
        )}

        {step === 2 && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium">
            <CheckCircle size={14} />
            {t('referPage.journey.step1Complete')}
          </p>
        )}
      </div>

      {/* Step 2 — Landlord */}
      {step === 2 && (
        <div ref={landlordSectionRef}>
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-brand-200 dark:border-brand-800/60 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-editorial ring-1 ring-brand-100 dark:ring-brand-900/30"
        >
          <h2 className="font-semibold text-ink-900 dark:text-white text-base mb-1">
            {t('referPage.journey.step2Heading')}
          </h2>
          <p className="text-sm text-ink-500 dark:text-gray-400 mb-6">
            {t('referPage.journey.step2Sub')}
          </p>

          <div className="space-y-4">
            <Field label={t('referPage.journey.landlordName')} error={landlordErrors.name} required>
              <InputIcon
                icon={User}
                value={landlord.name}
                onChange={(v) => {
                  setLandlord((p) => ({ ...p, name: v }));
                  if (landlordErrors.name) setLandlordErrors((e) => ({ ...e, name: undefined }));
                }}
                placeholder={t('referPage.journey.landlordNamePlaceholder')}
                hasError={!!landlordErrors.name}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('referPage.journey.landlordPhone')} error={landlordErrors.phone} required>
                <InputIcon
                  icon={Phone}
                  type="tel"
                  value={landlord.phone}
                  onChange={(v) => {
                    setLandlord((p) => ({ ...p, phone: v }));
                    if (landlordErrors.phone) setLandlordErrors((e) => ({ ...e, phone: undefined }));
                  }}
                  placeholder={t('referPage.journey.landlordPhonePlaceholder')}
                  hasError={!!landlordErrors.phone}
                />
              </Field>
              <Field label={t('referPage.journey.landlordWhatsApp')}>
                <InputIcon
                  icon={Phone}
                  type="tel"
                  value={landlord.whatsApp}
                  onChange={(v) => setLandlord((p) => ({ ...p, whatsApp: v }))}
                  placeholder={t('referPage.journey.landlordWhatsAppPlaceholder')}
                  hasError={false}
                />
              </Field>
            </div>

            <Field label={t('referPage.journey.landlordEmail')} error={landlordErrors.email}>
              <InputIcon
                icon={Mail}
                type="email"
                value={landlord.email}
                onChange={(v) => {
                  setLandlord((p) => ({ ...p, email: v }));
                  if (landlordErrors.email) setLandlordErrors((e) => ({ ...e, email: undefined }));
                }}
                placeholder={t('referPage.journey.landlordEmailPlaceholder')}
                hasError={!!landlordErrors.email}
              />
            </Field>

            <Field label={t('referPage.journey.landlordArea')} error={landlordErrors.area} required>
              <InputIcon
                icon={MapPin}
                value={landlord.area}
                onChange={(v) => {
                  setLandlord((p) => ({ ...p, area: v }));
                  if (landlordErrors.area) setLandlordErrors((e) => ({ ...e, area: undefined }));
                }}
                placeholder={t('referPage.journey.landlordAreaPlaceholder')}
                hasError={!!landlordErrors.area}
              />
            </Field>

            <Field label={t('referPage.journey.landlordNotes')}>
              <div className="relative">
                <MessageSquare
                  size={16}
                  className="absolute top-3 left-3.5 text-ink-300 dark:text-gray-600 pointer-events-none"
                />
                <textarea
                  rows={3}
                  value={landlord.notes}
                  onChange={(e) => setLandlord((p) => ({ ...p, notes: e.target.value }))}
                  placeholder={t('referPage.journey.landlordNotesPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-ink-900 dark:text-white placeholder:text-ink-300 dark:placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </Field>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-stone-200 dark:border-gray-700 rounded-full font-semibold text-sm text-ink-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={16} />
              {t('referPage.journey.back')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-full font-semibold text-sm transition-all shadow-green-sm disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('referPage.journey.submitting')}
                </>
              ) : (
                <>
                  {t('referPage.journey.submit')}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      )}

      <p className="text-center mt-8">
        <Link
          href="/refer"
          className="text-sm text-ink-400 dark:text-gray-500 hover:text-ink-600 dark:hover:text-gray-300 transition-colors"
        >
          {t('referPage.journey.backToRefer')}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-ink-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function InputIcon({
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  hasError,
  disabled,
}: {
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hasError: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 dark:text-gray-600 pointer-events-none"
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-ink-900 dark:text-white placeholder:text-ink-300 dark:placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60',
          hasError
            ? 'border-red-300 focus:ring-red-500'
            : 'border-stone-200 dark:border-gray-700 focus:ring-brand-500',
        )}
      />
    </div>
  );
}
