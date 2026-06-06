'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Upload,
  FileCheck,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MAX_REFERRALS_PER_USER, REFERRAL_COUNT_STORAGE_KEY } from '@/data/refer';
import { cn } from '@/lib/utils/common';

type Step = 1 | 2 | 'success' | 'limit';

export function ReferFormModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const landlordRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [referrer, setReferrer] = useState({ name: '', phone: '', nidaNumber: '', idFile: null as File | null });
  const [landlord, setLandlord] = useState({ name: '', phone: '', area: '', notes: '' });
  const [referrerErrors, setReferrerErrors] = useState<Record<string, string | undefined>>({});
  const [landlordErrors, setLandlordErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remaining, setRemaining] = useState(MAX_REFERRALS_PER_USER);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function isValidPhone(v: string) { return /^[+\d][\d\s\-]{6,}$/.test(v.trim()); }

  function validateReferrer() {
    const e: Record<string, string> = {};
    if (!referrer.name.trim()) e.name = t('referPage.journey.errorRequired');
    if (!referrer.phone.trim()) e.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(referrer.phone)) e.phone = t('referPage.journey.errorPhone');
    if (!referrer.nidaNumber.trim()) e.nidaNumber = t('referPage.journey.errorRequired');
    return e;
  }

  function validateLandlord() {
    const e: Record<string, string> = {};
    if (!landlord.name.trim()) e.name = t('referPage.journey.errorRequired');
    if (!landlord.phone.trim()) e.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(landlord.phone)) e.phone = t('referPage.journey.errorPhone');
    if (!landlord.area.trim()) e.area = t('referPage.journey.errorRequired');
    return e;
  }

  function handleContinue() {
    const errs = validateReferrer();
    if (Object.keys(errs).length) { setReferrerErrors(errs); return; }
    setReferrerErrors({});
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateLandlord();
    if (Object.keys(errs).length) { setLandlordErrors(errs); return; }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const count = parseInt(localStorage.getItem(REFERRAL_COUNT_STORAGE_KEY) ?? '0', 10) || 0;
    localStorage.setItem(REFERRAL_COUNT_STORAGE_KEY, String(count + 1));
    setIsSubmitting(false);
    setStep('success');
  }

  function resetForAnother() {
    const count = parseInt(localStorage.getItem(REFERRAL_COUNT_STORAGE_KEY) ?? '0', 10) || 0;
    if (count >= MAX_REFERRALS_PER_USER) { setStep('limit'); return; }
    setRemaining(MAX_REFERRALS_PER_USER - count);
    setLandlord({ name: '', phone: '', area: '', notes: '' });
    setLandlordErrors({});
    setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-hero w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <p className="font-semibold text-ink-900 text-sm">
              {step === 1 ? t('referPage.journey.step1Heading') : step === 2 ? t('referPage.journey.step2Heading') : ''}
            </p>
            {(step === 1 || step === 2) && (
              <p className="text-xs text-ink-400">{step === 1 ? '1/2' : '2/2'}</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors">
            <X size={18} className="text-ink-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Limit */}
          {step === 'limit' && (
            <div className="text-center py-8 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="font-semibold text-ink-900">{t('referPage.journey.limitTitle')}</p>
              <p className="text-sm text-ink-500">{t('referPage.journey.limitMessage')}</p>
              <button onClick={onClose} className="text-sm text-brand-600 font-semibold hover:underline">OK</button>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle size={40} className="text-brand-600 mx-auto" />
              <p className="font-display text-xl font-bold text-ink-900">{t('referPage.journey.successTitle')}</p>
              <p className="text-sm text-ink-500">{t('referPage.journey.successMessage')}</p>
              <button onClick={resetForAnother}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all">
                {t('referPage.journey.successAnother')} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">

              <Field label={t('referPage.journey.yourName')} error={referrerErrors.name} required>
                <IconInput icon={User} value={referrer.name} onChange={(v) => { setReferrer(p => ({...p, name: v})); setReferrerErrors(e => ({...e, name: undefined})); }}
                  placeholder={t('referPage.journey.yourNamePlaceholder')} hasError={!!referrerErrors.name} />
              </Field>
              <Field label={t('referPage.journey.yourPhone') + ' (M-Pesa)'} error={referrerErrors.phone} required>
                <IconInput icon={Phone} type="tel" value={referrer.phone} onChange={(v) => { setReferrer(p => ({...p, phone: v})); setReferrerErrors(e => ({...e, phone: undefined})); }}
                  placeholder={t('referPage.journey.yourPhonePlaceholder')} hasError={!!referrerErrors.phone} />
              </Field>
              <Field label="NIDA Number" error={referrerErrors.nidaNumber} required>
                <IconInput icon={CreditCard} value={referrer.nidaNumber} onChange={(v) => { setReferrer(p => ({...p, nidaNumber: v})); setReferrerErrors(e => ({...e, nidaNumber: undefined})); }}
                  placeholder="e.g. 19920101-12345-00001-01" hasError={!!referrerErrors.nidaNumber} />
              </Field>
              <Field label={t('referPage.journey.idUpload') + ' (optional)'}>
                <label className={cn('flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                  referrer.idFile ? 'border-brand-300 bg-brand-50/50' : 'border-stone-200 hover:border-brand-200')}>
                  <input type="file" accept="image/*,.pdf" className="sr-only"
                    onChange={(e) => setReferrer(p => ({...p, idFile: e.target.files?.[0] ?? null}))} />
                  {referrer.idFile ? (
                    <><FileCheck size={14} className="text-brand-600" /><span className="text-xs text-ink-700 truncate max-w-[180px]">{referrer.idFile.name}</span></>
                  ) : (
                    <><Upload size={14} className="text-ink-400" /><span className="text-xs text-ink-500">Photo speeds up verification</span></>
                  )}
                </label>
              </Field>

              <button type="button" onClick={handleContinue}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all">
                {t('referPage.journey.continueToLandlord')} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4" ref={landlordRef}>
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

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-stone-200 rounded-full font-semibold text-sm text-ink-700 hover:bg-stone-50 transition-colors">
                  <ArrowLeft size={14} />
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-full font-semibold text-sm transition-all">
                  {isSubmitting ? (<><Loader2 size={16} className="animate-spin" /> {t('referPage.journey.submitting')}</>) : (<>{t('referPage.journey.submit')} <ArrowRight size={16} /></>)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
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
