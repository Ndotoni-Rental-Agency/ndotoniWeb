'use client';

import { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Upload,
  FileCheck,
  CreditCard,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MAX_REFERRALS_PER_USER, REFERRAL_COUNT_STORAGE_KEY } from '@/data/refer';
import { cn } from '@/lib/utils/common';
import { GraphQLClient } from '@/lib/graphql-client';
import { submitReferral } from '@/graphql/mutations';

type Step = 1 | 2 | 'success' | 'limit';

const DEFAULT_NIDA = '00000000000000000000';

interface LandlordRow {
  id: string;
  name: string;
  phone: string;
  area: string;
  notes: string;
  errors: { name?: string; phone?: string; area?: string };
  status: 'idle' | 'success' | 'error';
  submitError?: string;
}

let rowIdCounter = 0;
function emptyRow(): LandlordRow {
  rowIdCounter += 1;
  return { id: `row-${rowIdCounter}`, name: '', phone: '', area: '', notes: '', errors: {}, status: 'idle' };
}

export function ReferFormModal({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [referrer, setReferrer] = useState({ name: '', phone: '', nidaNumber: '', idFile: null as File | null });
  const [showNida, setShowNida] = useState(false);
  const [referrerErrors, setReferrerErrors] = useState<Record<string, string | undefined>>({});
  const [rows, setRows] = useState<LandlordRow[]>([emptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remaining, setRemaining] = useState(MAX_REFERRALS_PER_USER);
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setReferrer((p) => ({
      ...p,
      name: p.name || [user.firstName, user.lastName].filter(Boolean).join(' '),
      phone: p.phone || user.phoneNumber || '',
    }));
  }, [isAuthenticated, user]);

  function isValidPhone(v: string) { return /^[+\d][\d\s\-]{6,}$/.test(v.trim()); }

  function getRemainingSlots() {
    const count = parseInt(localStorage.getItem(REFERRAL_COUNT_STORAGE_KEY) ?? '0', 10) || 0;
    return MAX_REFERRALS_PER_USER - count;
  }

  function validateReferrer() {
    const e: Record<string, string> = {};
    if (!referrer.name.trim()) e.name = t('referPage.journey.errorRequired');
    if (!referrer.phone.trim()) e.phone = t('referPage.journey.errorRequired');
    else if (!isValidPhone(referrer.phone)) e.phone = t('referPage.journey.errorPhone');
    return e;
  }

  function validateRows(list: LandlordRow[]): LandlordRow[] {
    return list.map((r) => {
      if (r.status === 'success') return r;
      const errors: LandlordRow['errors'] = {};
      if (!r.name.trim()) errors.name = t('referPage.journey.errorRequired');
      if (!r.phone.trim()) errors.phone = t('referPage.journey.errorRequired');
      else if (!isValidPhone(r.phone)) errors.phone = t('referPage.journey.errorPhone');
      if (!r.area.trim()) errors.area = t('referPage.journey.errorRequired');
      return { ...r, errors };
    });
  }

  function updateRow(id: string, patch: Partial<LandlordRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, errors: { ...r.errors, ...Object.fromEntries(Object.keys(patch).map((k) => [k, undefined])) } } : r)));
  }

  function addRow() {
    setRows((prev) => (prev.length >= remaining ? prev : [...prev, emptyRow()]));
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function handleContinue() {
    const errs = validateReferrer();
    if (Object.keys(errs).length) { setReferrerErrors(errs); return; }
    setReferrerErrors({});
    const slots = getRemainingSlots();
    if (slots <= 0) { setStep('limit'); return; }
    setRemaining(slots);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validated = validateRows(rows);
    const hasErrors = validated.some((r) => r.status !== 'success' && Object.values(r.errors).some(Boolean));
    if (hasErrors) { setRows(validated); return; }

    setIsSubmitting(true);
    const working = [...validated];
    let newlySucceeded = 0;

    for (let i = 0; i < working.length; i++) {
      if (working[i].status === 'success') continue;
      const r = working[i];
      try {
        await GraphQLClient.executePublic(submitReferral, {
          referrerName: referrer.name,
          referrerPhone: referrer.phone,
          referrerNida: referrer.nidaNumber.trim() || DEFAULT_NIDA,
          landlordName: r.name,
          landlordPhone: r.phone,
          landlordArea: r.area,
          landlordNotes: r.notes || undefined,
        });
        working[i] = { ...r, status: 'success', submitError: undefined };
        newlySucceeded += 1;
      } catch (err: any) {
        const errors = err?.errors || [];
        const isSerializationOnly = errors.length > 0 && errors.every(
          (e: any) => e?.message?.includes("Can't serialize") || e?.message?.includes('serialize value')
        );
        if (isSerializationOnly || err?.data?.submitReferral) {
          working[i] = { ...r, status: 'success', submitError: undefined };
          newlySucceeded += 1;
        } else {
          console.error('Referral submission error:', err);
          working[i] = { ...r, status: 'error', submitError: language === 'sw' ? 'Imeshindwa kutuma. Jaribu tena.' : 'Failed to submit. Please try again.' };
        }
      }
      setRows([...working]);
    }

    setIsSubmitting(false);

    if (newlySucceeded > 0) {
      const count = parseInt(localStorage.getItem(REFERRAL_COUNT_STORAGE_KEY) ?? '0', 10) || 0;
      localStorage.setItem(REFERRAL_COUNT_STORAGE_KEY, String(count + newlySucceeded));
    }

    if (working.every((r) => r.status === 'success')) {
      setSubmittedCount(working.length);
      setStep('success');
    }
  }

  function resetForAnother() {
    const slots = getRemainingSlots();
    if (slots <= 0) { setStep('limit'); return; }
    setRemaining(slots);
    setRows([emptyRow()]);
    setSubmittedCount(0);
    setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={cn('relative bg-white rounded-2xl shadow-hero w-full max-h-[85vh] overflow-y-auto', step === 2 ? 'max-w-3xl' : 'max-w-lg')}>
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
              <p className="font-display text-xl font-bold text-ink-900">
                {submittedCount > 1
                  ? (language === 'sw' ? `Watambuzi ${submittedCount} wametumwa!` : `${submittedCount} referrals sent!`)
                  : t('referPage.journey.successTitle')}
              </p>
              <p className="text-sm text-ink-500">{t('referPage.journey.successMessage')}</p>
              <button onClick={resetForAnother}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all">
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
              {showNida ? (
                <Field label="NIDA Number (optional)" error={referrerErrors.nidaNumber}>
                  <IconInput icon={CreditCard} value={referrer.nidaNumber} onChange={(v) => { setReferrer(p => ({...p, nidaNumber: v})); setReferrerErrors(e => ({...e, nidaNumber: undefined})); }}
                    placeholder="e.g. 19920101-12345-00001-01" hasError={!!referrerErrors.nidaNumber} />
                </Field>
              ) : (
                <button type="button" onClick={() => setShowNida(true)}
                  className="text-xs font-semibold text-brand-600 hover:underline">
                  + Enter NIDA Number (optional)
                </button>
              )}
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
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all">
                {t('referPage.journey.continueToLandlord')} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2 — bulk landlord table */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-500">
                  {language === 'sw'
                    ? `Umeongeza wamiliki ${rows.length} kati ya ${remaining} unaoweza kutuma`
                    : `${rows.length} of ${remaining} landlords added`}
                </p>
                {rows.some((r) => r.submitError) && (
                  <p className="text-xs text-red-500 font-medium">
                    {language === 'sw' ? 'Baadhi hazikutumwa' : 'Some rows failed'}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[640px] border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide">
                      <th className="w-6 px-2 pb-1">#</th>
                      <th className="px-2 pb-1">{t('referPage.journey.tableName')} *</th>
                      <th className="px-2 pb-1">{t('referPage.journey.tablePhone')} *</th>
                      <th className="px-2 pb-1">{t('referPage.journey.tableArea')} *</th>
                      <th className="px-2 pb-1">{t('referPage.journey.tableNotes')}</th>
                      <th className="w-8 px-2 pb-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const done = row.status === 'success';
                      return (
                        <tr key={row.id} className={cn('align-top', done && 'opacity-50')}>
                          <td className="px-2 py-1 text-xs text-ink-400 font-semibold pt-2.5">{idx + 1}</td>
                          <td className="px-2 py-1">
                            <TableInput value={row.name} disabled={done} hasError={!!row.errors.name}
                              placeholder={t('referPage.journey.landlordNamePlaceholder')}
                              onChange={(v) => updateRow(row.id, { name: v })} />
                            {row.errors.name && <p className="text-[10px] text-red-500 mt-0.5">{row.errors.name}</p>}
                          </td>
                          <td className="px-2 py-1">
                            <TableInput type="tel" value={row.phone} disabled={done} hasError={!!row.errors.phone}
                              placeholder={t('referPage.journey.landlordPhonePlaceholder')}
                              onChange={(v) => updateRow(row.id, { phone: v })} />
                            {row.errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{row.errors.phone}</p>}
                          </td>
                          <td className="px-2 py-1">
                            <TableInput value={row.area} disabled={done} hasError={!!row.errors.area}
                              placeholder={t('referPage.journey.landlordAreaPlaceholder')}
                              onChange={(v) => updateRow(row.id, { area: v })} />
                            {row.errors.area && <p className="text-[10px] text-red-500 mt-0.5">{row.errors.area}</p>}
                          </td>
                          <td className="px-2 py-1">
                            <TableInput value={row.notes} disabled={done} hasError={false}
                              placeholder={t('referPage.journey.landlordNotesPlaceholder')}
                              onChange={(v) => updateRow(row.id, { notes: v })} />
                          </td>
                          <td className="px-2 py-1 pt-2.5 text-center">
                            {done ? (
                              <CheckCircle size={16} className="text-brand-500 inline-block" />
                            ) : rows.length > 1 ? (
                              <button type="button" onClick={() => removeRow(row.id)}
                                className="text-ink-300 hover:text-red-500 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            ) : null}
                            {row.submitError && (
                              <p className="text-[10px] text-red-500 mt-0.5 max-w-[100px]">{row.submitError}</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button type="button" onClick={addRow} disabled={rows.length >= remaining}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline">
                <Plus size={14} /> {t('referPage.journey.addAnotherLandlord')}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                {language === 'sw'
                  ? 'Kwa kutuma, unakubali '
                  : 'By submitting, you agree to our '}
                <a href="/terms" target="_blank" className="underline hover:text-gray-600">
                  {language === 'sw' ? 'vigezo na masharti' : 'referral terms'}
                </a>
              </p>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-stone-200 rounded-full font-semibold text-sm text-ink-700 hover:bg-stone-50 transition-colors">
                  <ArrowLeft size={14} />
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white rounded-full font-semibold text-sm transition-all">
                  {isSubmitting
                    ? (<><Loader2 size={16} className="animate-spin" /> {t('referPage.journey.submitting')}</>)
                    : (<>{t('referPage.journey.submitAll')} ({rows.length}) <ArrowRight size={16} /></>)}
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

function TableInput({ type = 'text', value, onChange, placeholder, hasError, disabled }: {
  type?: string; value: string; onChange: (v: string) => void; placeholder: string; hasError: boolean; disabled?: boolean;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className={cn('w-full px-3 py-2 rounded-lg border bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-60',
        hasError ? 'border-red-300 focus:ring-red-500' : 'border-stone-200 focus:ring-brand-500')} />
  );
}
