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
  CreditCard,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MAX_REFERRALS_PER_USER,
  REFERRAL_COUNT_STORAGE_KEY,
} from '@/data/refer';
import { cn } from '@/lib/utils/common';

type Step = 1 | 2 | 'success' | 'limit';

interface ReferrerData {
  name: string;
  phone: string;
  nidaNumber: string;
  idFile: File | null;
}

interface LandlordData {
  name: string;
  phone: string;
  area: string;
  notes: string;
}

function isValidPhone(value: string) {
  return /^[+\d][\d\s\-]{6,}$/.test(value.trim());
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

export function ReferSubmitJourney() {
  const { t } = useLanguage();
  const landlordSectionRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [referrer, setReferrer] = useState<ReferrerData>({
    name: '',
    phone: '',
    nidaNumber: '',
    idFile: null,
  });
  const [landlord, setLandlord] = useState<LandlordData>({
    name: '',
    phone: '',
    area: '',
    notes: '',
  });
  const [referrerErrors, setReferrerErrors] = useState<Record<string, string | undefined>>({});
  const [landlordErrors, setLandlordErrors] = useState<Record<string, string | undefined>>({});
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

  function validateReferrer() {
    const errs: Record<string, string> = {};
    if (!referrer.name.trim()) errs.name = t('referPage.journey.errorRequired');
    if (!referrer.phone.trim()) errs.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(referrer.phone)) errs.phone = t('referPage.journey.errorPhone');
    if (!referrer.nidaNumber.trim()) errs.nidaNumber = t('referPage.journey.errorRequired');
    return errs;
  }

  function validateLandlord() {
    const errs: Record<string, string> = {};
    if (!landlord.name.trim()) errs.name = t('referPage.journey.errorRequired');
    if (!landlord.phone.trim()) errs.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(landlord.phone)) errs.phone = t('referPage.journey.errorPhone');
    if (!landlord.area.trim()) errs.area = t('referPage.journey.errorRequired');
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
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="font-display text-2xl font-bold text-ink-900">
          {t('referPage.journey.limitTitle')}
        </h2>
        <p className="text-sm text-ink-500">
          {t('referPage.journey.limitMessage')}
        </p>
        <Link href="/refer" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline underline-offset-2">
          {t('referPage.journey.backToRefer')}
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    const left = Math.max(0, MAX_REFERRALS_PER_USER - getSubmissionCount());
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <CheckCircle size={48} className="text-brand-600 mx-auto" />
        <h2 className="font-display text-2xl font-bold text-ink-900">
          {t('referPage.journey.successTitle')}
        </h2>
        <p className="text-sm text-ink-500">
          {t('referPage.journey.successMessage')}
        </p>
        {left > 0 ? (
          <button
            type="button"
            onClick={() => {
              const count = getSubmissionCount();
              if (count >= MAX_REFERRALS_PER_USER) { setStep('limit'); return; }
              setRemaining(MAX_REFERRALS_PER_USER - count);
              setLandlord({ name: '', phone: '', area: '', notes: '' });
              setLandlordErrors({});
              setStep(2);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all"
          >
            {t('referPage.journey.successAnother')} <ArrowRight size={16} />
          </button>
        ) : (
          <p className="text-xs text-ink-400">{t('referPage.journey.limitMessage')}</p>
        )}
        <Link href="/refer" className="block text-sm text-brand-600 font-medium hover:underline underline-offset-2">
          {t('referPage.journey.backToRefer')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              step >= n ? 'bg-brand-600 text-white' : 'bg-stone-100 text-ink-400')}>
              {(step === 2 && n === 1) ? <CheckCircle size={14} /> : n}
            </div>
            <span className={cn('text-xs font-medium hidden sm:block', step >= n ? 'text-ink-900' : 'text-ink-400')}>
              {n === 1 ? t('referPage.journey.step1Label') : t('referPage.journey.step2Label')}
            </span>
            {n === 1 && <div className={cn('w-10 h-px', step >= 2 ? 'bg-brand-500' : 'bg-stone-200')} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <p className="text-xs text-center text-ink-400 mb-6">
          {t('referPage.journey.remainingLabel')} <span className="font-bold text-ink-700">{remaining}</span>
        </p>
      )}

      {/* Step 1: Your info */}
      <div className={cn('rounded-2xl border bg-white p-6 sm:p-8 shadow-soft transition-all',
        step === 2 && 'opacity-50 pointer-events-none scale-[0.98]')}>
        <h2 className="font-semibold text-ink-900 mb-1">{t('referPage.journey.step1Heading')}</h2>
        <p className="text-sm text-ink-500 mb-5">{t('referPage.journey.step1Sub')}</p>

        <div className="space-y-4">
          <Field label={t('referPage.journey.yourName')} error={referrerErrors.name} required>
            <IconInput icon={User} value={referrer.name} onChange={(v) => { setReferrer(p => ({...p, name: v})); setReferrerErrors(e => ({...e, name: undefined})); }}
              placeholder={t('referPage.journey.yourNamePlaceholder')} hasError={!!referrerErrors.name} disabled={step === 2} />
          </Field>

          <Field label={t('referPage.journey.yourPhone') + ' (M-Pesa)'} error={referrerErrors.phone} required>
            <IconInput icon={Phone} type="tel" value={referrer.phone} onChange={(v) => { setReferrer(p => ({...p, phone: v})); setReferrerErrors(e => ({...e, phone: undefined})); }}
              placeholder={t('referPage.journey.yourPhonePlaceholder')} hasError={!!referrerErrors.phone} disabled={step === 2} />
          </Field>

          <Field label="NIDA Number" error={referrerErrors.nidaNumber} required>
            <IconInput icon={CreditCard} value={referrer.nidaNumber} onChange={(v) => { setReferrer(p => ({...p, nidaNumber: v})); setReferrerErrors(e => ({...e, nidaNumber: undefined})); }}
              placeholder="e.g. 19920101-12345-00001-01" hasError={!!referrerErrors.nidaNumber} disabled={step === 2} />
          </Field>

          {/* ID photo upload (optional) */}
          <Field label={t('referPage.journey.idUpload') + ' (optional)'}>
            <label className={cn('flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
              referrer.idFile ? 'border-brand-300 bg-brand-50/50' : 'border-stone-200 hover:border-brand-200',
              step === 2 && 'pointer-events-none opacity-60')}>
              <input type="file" accept="image/*,.pdf" className="sr-only" disabled={step === 2}
                onChange={(e) => setReferrer(p => ({...p, idFile: e.target.files?.[0] ?? null}))} />
              {referrer.idFile ? (
                <><FileCheck size={16} className="text-brand-600" /><span className="text-xs text-ink-700 truncate max-w-[200px]">{referrer.idFile.name}</span></>
              ) : (
                <><Upload size={16} className="text-ink-400" /><span className="text-xs text-ink-500">Photo speeds up verification</span></>
              )}
            </label>
          </Field>
        </div>

        {step === 1 && (
          <button type="button" onClick={handleContinueToLandlord}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all shadow-green-sm">
            {t('referPage.journey.continueToLandlord')} <ArrowRight size={16} />
          </button>
        )}

        {step === 2 && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-brand-600 font-medium">
            <CheckCircle size={14} /> {t('referPage.journey.step1Complete')}
          </p>
        )}
      </div>

      {/* Step 2: Landlord info */}
      {step === 2 && (
        <div ref={landlordSectionRef}>
          <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border-2 border-brand-200 bg-white p-6 sm:p-8 shadow-editorial">
            <h2 className="font-semibold text-ink-900 mb-1">{t('referPage.journey.step2Heading')}</h2>
            <p className="text-sm text-ink-500 mb-5">{t('referPage.journey.step2Sub')}</p>

            <div className="space-y-4">
              <Field label={t('referPage.journey.landlordName')} error={landlordErrors.name} required>
                <IconInput icon={User} value={landlord.name} onChange={(v) => { setLandlord(p => ({...p, name: v})); setLandlordErrors(e => ({...e, name: undefined})); }}
                  placeholder={t('referPage.journey.landlordNamePlaceholder')} hasError={!!landlordErrors.name} />
              </Field>

              <Field label={t('referPage.journey.landlordPhone')} error={landlordErrors.phone} required>
                <IconInput icon={Phone} type="tel" value={landlord.phone} onChange={(v) => { setLandlord(p => ({...p, phone: v})); setLandlordErrors(e => ({...e, phone: undefined})); }}
                  placeholder={t('referPage.journey.landlordPhonePlaceholder')} hasError={!!landlordErrors.phone} />
              </Field>

              <Field label={t('referPage.journey.landlordArea')} error={landlordErrors.area} required>
                <IconInput icon={MapPin} value={landlord.area} onChange={(v) => { setLandlord(p => ({...p, area: v})); setLandlordErrors(e => ({...e, area: undefined})); }}
                  placeholder={t('referPage.journey.landlordAreaPlaceholder')} hasError={!!landlordErrors.area} />
              </Field>

              <Field label={t('referPage.journey.landlordNotes')}>
                <div className="relative">
                  <MessageSquare size={16} className="absolute top-3 left-3.5 text-ink-300 pointer-events-none" />
                  <textarea rows={2} value={landlord.notes} onChange={(e) => setLandlord(p => ({...p, notes: e.target.value}))}
                    placeholder={t('referPage.journey.landlordNotesPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                </div>
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-stone-200 rounded-full font-semibold text-sm text-ink-700 hover:bg-stone-50 transition-colors">
                <ArrowLeft size={16} /> {t('referPage.journey.back')}
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-full font-semibold text-sm transition-all shadow-green-sm">
                {isSubmitting ? (<><Loader2 size={16} className="animate-spin" /> {t('referPage.journey.submitting')}</>) : (<>{t('referPage.journey.submit')} <ArrowRight size={16} /></>)}
              </button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center mt-8">
        <Link href="/refer" className="text-sm text-ink-400 hover:text-ink-600 transition-colors">
          {t('referPage.journey.backToRefer')}
        </Link>
      </p>
    </div>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-ink-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function IconInput({ icon: Icon, type = 'text', value, onChange, placeholder, hasError, disabled }: {
  icon: React.ElementType; type?: string; value: string; onChange: (v: string) => void; placeholder: string; hasError: boolean; disabled?: boolean;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        className={cn('w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60',
          hasError ? 'border-red-300 focus:ring-red-500' : 'border-stone-200 focus:ring-brand-500')} />
    </div>
  );
}
