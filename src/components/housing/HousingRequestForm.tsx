'use client';

import { useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { createHousingRequest } from '@/graphql/mutations';
import { useRegisterInlineHousingRequestCTA } from '@/contexts/HousingRequestInlineContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { inputVariants } from '@/components/ui/Input';
import { cn } from '@/lib/utils/common';
import { CheckCircle2, Send, X } from 'lucide-react';

interface HousingRequestFormProps {
  onClose?: () => void;
  className?: string;
  titleId?: string;
}

const fieldClass = cn(
  inputVariants({ variant: 'default', size: 'md' }),
  'rounded-xl text-sm placeholder:text-xs'
);

const modalInputClass = 'placeholder:text-xs';

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-ink-700 dark:text-gray-300 mb-1.5"
    >
      {children}
      {required && <span className="text-brand-600 dark:text-brand-400 ml-0.5">*</span>}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-gray-400 mb-3">
      {children}
    </p>
  );
}

export function HousingRequestForm({ onClose, className = '', titleId }: HousingRequestFormProps) {
  const { t } = useLanguage();

  // Inline embeds (e.g. search no-results) hide the floating FAB; modal/banner uses onClose.
  useRegisterInlineHousingRequestCTA(!onClose);

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Dar es Salaam');
  const [district, setDistrict] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = phone.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError('');

    try {
      await GraphQLClient.executePublic(createHousingRequest, {
        phone: phone.replace(/\D/g, ''),
        contactName: name || undefined,
        region: region || undefined,
        district: district || undefined,
        maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        moveInDate: moveInDate || undefined,
        currency: 'TZS',
        description,
        source: 'WEB',
      });
      setSubmitted(true);
    } catch (err: any) {
      const errors = err?.errors || [];
      const isSerializationOnly = errors.length > 0 && errors.every(
        (e: any) => e?.message?.includes("Can't serialize") || e?.message?.includes('serialize value')
      );
      if (isSerializationOnly || err?.data?.createHousingRequest) {
        setSubmitted(true);
      } else {
        console.error('Housing request submission error:', err);
        setError(t('housingRequest.submitError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(
          'bg-white dark:bg-gray-800 rounded-2xl shadow-editorial overflow-hidden',
          className
        )}
      >
        <div className="px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30">
            <CheckCircle2 className="h-7 w-7 text-brand-600 dark:text-brand-400" strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">
            {t('housingRequest.successTitle')}
          </h3>
          <p className="text-sm text-ink-500 dark:text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
            {t('housingRequest.successMessage')}
          </p>
          {onClose && (
            <Button type="button" onClick={onClose} variant="primary" size="md" fullWidth>
              {t('housingRequest.close')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-editorial overflow-hidden flex flex-col max-h-[min(90vh,720px)]',
        className
      )}
    >
      {/* Header */}
      <div className="relative shrink-0 px-6 pt-6 pb-4 bg-gradient-to-b from-brand-50/80 to-white dark:from-brand-950/20 dark:to-gray-800 border-b border-stone-100 dark:border-gray-700/80">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:text-ink-900 hover:bg-stone-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={t('housingRequest.close')}
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
        <h3
          id={titleId}
          className="font-display text-xl font-semibold text-ink-900 dark:text-white pr-10 leading-snug"
        >
          {t('housingRequest.title')}
        </h3>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-gray-400 leading-relaxed pr-8">
          {t('housingRequest.subtitle')}
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <section>
          <SectionTitle>{t('housingRequest.contactSection')}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="hr-phone" required>
                {t('housingRequest.phone')}
              </FieldLabel>
              <Input
                id="hr-phone"
                type="tel"
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                className={modalInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="hr-name">{t('housingRequest.yourName')}</FieldLabel>
              <Input
                id="hr-name"
                type="text"
                placeholder={t('housingRequest.fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={modalInputClass}
              />
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>{t('housingRequest.homeTypeSection')}</SectionTitle>
          <div>
            <FieldLabel htmlFor="hr-description" required>
              {t('housingRequest.description')}
            </FieldLabel>
            <textarea
              id="hr-description"
              placeholder={t('housingRequest.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={cn(fieldClass, 'resize-none min-h-[104px] py-2.5')}
            />
            <p className="mt-1.5 text-xs text-ink-500 dark:text-gray-500">
              {t('housingRequest.descriptionHint')}
            </p>
          </div>
        </section>

        <section>
          <button
            type="button"
            onClick={() => setShowExtraDetails((v) => !v)}
            className="text-sm font-medium text-emerald-800 dark:text-emerald-400"
            aria-expanded={showExtraDetails}
          >
            {showExtraDetails
              ? t('housingRequest.hideDetails')
              : t('housingRequest.moreDetails')}
          </button>

          {showExtraDetails && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <FieldLabel htmlFor="hr-district">{t('housingRequest.area')}</FieldLabel>
                <Input
                  id="hr-district"
                  type="text"
                  placeholder={t('housingRequest.areaPlaceholder')}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={modalInputClass}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <FieldLabel htmlFor="hr-budget">{t('housingRequest.budget')}</FieldLabel>
                <Input
                  id="hr-budget"
                  type="number"
                  placeholder="300,000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  min="0"
                  className={modalInputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="hr-bedrooms">{t('housingRequest.bedrooms')}</FieldLabel>
                <Input
                  id="hr-bedrooms"
                  type="number"
                  placeholder="1"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  min="1"
                  max="20"
                  className={modalInputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="hr-movein">{t('housingRequest.moveInDate')}</FieldLabel>
                <Input
                  id="hr-movein"
                  type="text"
                  placeholder={t('housingRequest.moveInPlaceholder')}
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className={modalInputClass}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-6 py-4 border-t border-stone-100 dark:border-gray-700/80 bg-cream-50/50 dark:bg-gray-800/80">
        {error && (
          <div
            role="alert"
            className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={submitting}
          disabled={!canSubmit}
          leftIcon={!submitting ? <Send className="h-3.5 w-3.5" strokeWidth={2} /> : undefined}
          className="rounded-xl"
        >
          {submitting ? t('housingRequest.submitting') : t('housingRequest.submit')}
        </Button>

        <p className="mt-2.5 text-center text-[11px] text-ink-500 dark:text-gray-500">
          <span className="text-brand-600 dark:text-brand-400">*</span>{' '}
          {t('housingRequest.requiredNote')}
        </p>
      </div>
    </form>
  );
}
