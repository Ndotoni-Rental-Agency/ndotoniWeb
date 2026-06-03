'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

interface FormData {
  referrerName: string;
  referrerPhone: string;
  landlordName: string;
  landlordPhone: string;
  landlordWhatsApp: string;
  landlordEmail: string;
  landlordArea: string;
  notes: string;
}

interface FormErrors {
  referrerName?: string;
  referrerPhone?: string;
  landlordName?: string;
  landlordPhone?: string;
  landlordArea?: string;
  landlordEmail?: string;
}

const INITIAL_FORM: FormData = {
  referrerName: '',
  referrerPhone: '',
  landlordName: '',
  landlordPhone: '',
  landlordWhatsApp: '',
  landlordEmail: '',
  landlordArea: '',
  notes: '',
};

function isValidPhone(value: string) {
  return /^[+\d][\d\s\-]{6,}$/.test(value.trim());
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ReferForm() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.referrerName.trim()) errs.referrerName = t('referPage.form.errorRequired');
    if (!form.referrerPhone.trim()) errs.referrerPhone = t('referPage.form.errorRequired');
    else if (!isValidPhone(form.referrerPhone)) errs.referrerPhone = t('referPage.form.errorPhone');
    if (!form.landlordName.trim()) errs.landlordName = t('referPage.form.errorRequired');
    if (!form.landlordPhone.trim()) errs.landlordPhone = t('referPage.form.errorRequired');
    else if (!isValidPhone(form.landlordPhone)) errs.landlordPhone = t('referPage.form.errorPhone');
    if (!form.landlordArea.trim()) errs.landlordArea = t('referPage.form.errorRequired');
    if (form.landlordEmail && !isValidEmail(form.landlordEmail))
      errs.landlordEmail = t('referPage.form.errorEmail');
    return errs;
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setErrors({});
    setIsSuccess(false);
  }

  return (
    <section id="referral-form" className="bg-cream-50 dark:bg-gray-900">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-12 sm:mb-14">
            <span className="eyebrow">{t('referPage.form.eyebrow')}</span>
            <h2 className="section-heading">
              {t('referPage.form.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('referPage.form.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-md mx-auto">
              {t('referPage.form.subheading')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {isSuccess ? (
              <SuccessState onReset={handleReset} />
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white dark:bg-gray-900 rounded-3xl border border-stone-100 dark:border-gray-800 shadow-editorial overflow-hidden"
              >
                {/* Section A */}
                <FormSection
                  label={t('referPage.form.sectionA')}
                  description={t('referPage.form.sectionADesc')}
                  step="A"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label={t('referPage.form.referrerName')}
                      error={errors.referrerName}
                      required
                    >
                      <InputWithIcon
                        icon={User}
                        type="text"
                        value={form.referrerName}
                        onChange={(v) => handleChange('referrerName', v)}
                        placeholder={t('referPage.form.referrerNamePlaceholder')}
                        hasError={!!errors.referrerName}
                      />
                    </FormField>

                    <FormField
                      label={t('referPage.form.referrerPhone')}
                      error={errors.referrerPhone}
                      required
                    >
                      <InputWithIcon
                        icon={Phone}
                        type="tel"
                        value={form.referrerPhone}
                        onChange={(v) => handleChange('referrerPhone', v)}
                        placeholder={t('referPage.form.referrerPhonePlaceholder')}
                        hasError={!!errors.referrerPhone}
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* Divider */}
                <div className="h-px bg-stone-100 dark:bg-gray-800" />

                {/* Section B */}
                <FormSection
                  label={t('referPage.form.sectionB')}
                  description={t('referPage.form.sectionBDesc')}
                  step="B"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label={t('referPage.form.landlordName')}
                        error={errors.landlordName}
                        required
                      >
                        <InputWithIcon
                          icon={User}
                          type="text"
                          value={form.landlordName}
                          onChange={(v) => handleChange('landlordName', v)}
                          placeholder={t('referPage.form.landlordNamePlaceholder')}
                          hasError={!!errors.landlordName}
                        />
                      </FormField>

                      <FormField
                        label={t('referPage.form.landlordPhone')}
                        error={errors.landlordPhone}
                        required
                      >
                        <InputWithIcon
                          icon={Phone}
                          type="tel"
                          value={form.landlordPhone}
                          onChange={(v) => handleChange('landlordPhone', v)}
                          placeholder={t('referPage.form.landlordPhonePlaceholder')}
                          hasError={!!errors.landlordPhone}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label={t('referPage.form.landlordWhatsApp')}>
                        <InputWithIcon
                          icon={Phone}
                          type="tel"
                          value={form.landlordWhatsApp}
                          onChange={(v) => handleChange('landlordWhatsApp', v)}
                          placeholder={t('referPage.form.landlordWhatsAppPlaceholder')}
                          hasError={false}
                        />
                      </FormField>

                      <FormField
                        label={t('referPage.form.landlordEmail')}
                        error={errors.landlordEmail}
                      >
                        <InputWithIcon
                          icon={Mail}
                          type="email"
                          value={form.landlordEmail}
                          onChange={(v) => handleChange('landlordEmail', v)}
                          placeholder={t('referPage.form.landlordEmailPlaceholder')}
                          hasError={!!errors.landlordEmail}
                        />
                      </FormField>
                    </div>

                    <FormField
                      label={t('referPage.form.landlordArea')}
                      error={errors.landlordArea}
                      required
                    >
                      <InputWithIcon
                        icon={MapPin}
                        type="text"
                        value={form.landlordArea}
                        onChange={(v) => handleChange('landlordArea', v)}
                        placeholder={t('referPage.form.landlordAreaPlaceholder')}
                        hasError={!!errors.landlordArea}
                      />
                    </FormField>

                    <FormField label={t('referPage.form.notes')}>
                      <div className="relative">
                        <div className="pointer-events-none absolute top-3 left-3.5">
                          <MessageSquare size={16} className="text-ink-300 dark:text-gray-600" />
                        </div>
                        <textarea
                          rows={3}
                          value={form.notes}
                          onChange={(e) => handleChange('notes', e.target.value)}
                          placeholder={t('referPage.form.notesPlaceholder')}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-ink-900 dark:text-white placeholder:text-ink-300 dark:placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                        />
                      </div>
                      <p className="mt-1 text-xs text-ink-400 dark:text-gray-500">
                        {t('referPage.form.notesHint')}
                      </p>
                    </FormField>
                  </div>
                </FormSection>

                {/* Submit */}
                <div className="px-6 sm:px-8 pb-8 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-full font-semibold text-sm transition-all hover:scale-[1.01] shadow-green-sm hover:shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t('referPage.form.submitting')}
                      </>
                    ) : (
                      <>
                        {t('referPage.form.submit')}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({
  label,
  description,
  step,
  children,
}: {
  label: string;
  description: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-6">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <div>
          <h3 className="font-semibold text-ink-900 dark:text-white text-sm">{label}</h3>
          <p className="text-xs text-ink-400 dark:text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FormField({
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
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500/20 inline-flex items-center justify-center flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-red-500 block" />
          </span>
          {error}
        </p>
      )}
    </div>
  );
}

function InputWithIcon({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  icon: React.ElementType;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hasError: boolean;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
        <Icon size={16} className="text-ink-300 dark:text-gray-600" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-ink-900 dark:text-white placeholder:text-ink-300 dark:placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all',
          hasError
            ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
            : 'border-stone-200 dark:border-gray-700 focus:ring-brand-500',
        )}
      />
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-stone-100 dark:border-gray-800 shadow-editorial p-10 text-center space-y-5">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-200 dark:border-brand-700 mx-auto">
        <CheckCircle size={32} className="text-brand-600 dark:text-brand-400" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-white tracking-tight">
          {t('referPage.form.successTitle')}
        </h3>
        <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
          {t('referPage.form.successMessage')}
        </p>
      </div>

      {/* Reward reminder */}
      <div className="inline-flex items-center gap-3 px-5 py-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/40 rounded-2xl">
        <span className="text-xl">🎉</span>
        <div className="text-left">
          <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
            TZS 2,000 incoming
          </p>
          <p className="text-xs text-brand-600/70 dark:text-brand-500/70">
            When landlord lists
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 text-ink-900 dark:text-white rounded-full font-semibold text-sm transition-all hover:bg-stone-50 dark:hover:bg-gray-700 shadow-soft"
      >
        {t('referPage.form.successAnother')}
      </button>
    </div>
  );
}
