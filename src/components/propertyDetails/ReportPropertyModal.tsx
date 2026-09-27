'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';
import { GraphQLClient } from '@/lib/graphql-client';
import { reportProperty } from '@/graphql/mutations';
import { useLanguage } from '@/contexts/LanguageContext';

// Reasons are sent to the backend in English (same strings as ndotoniApp) so admins see
// consistent values; only the label is translated.
const REPORT_REASONS = [
  { key: 'inaccurate', value: 'Inaccurate or misleading listing' },
  { key: 'scam', value: 'Fraudulent or scam listing' },
  { key: 'photos', value: 'Inappropriate photos' },
  { key: 'discrimination', value: 'Discriminatory content' },
  { key: 'safety', value: 'Safety concern' },
  { key: 'other', value: 'Other' },
] as const;

interface ReportPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle?: string;
}

export function ReportPropertyModal({ isOpen, onClose, propertyId, propertyTitle }: ReportPropertyModalProps) {
  const { t } = useLanguage();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setReason(null);
    setDetails('');
    setSubmitted(false);
    setError(null);
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    setError(null);
    try {
      await GraphQLClient.executeAuthenticated(reportProperty, {
        input: {
          propertyId,
          propertyTitle,
          reason,
          details: details.trim() || undefined,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error reporting property:', err);
      setError(t('propertyDetails.reportError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <CheckCircleIcon className="h-12 w-12 text-clay-600 dark:text-clay-400 mb-3" />
          <h3 className="text-lg font-semibold text-ink-900 dark:text-white">
            {t('propertyDetails.reportSuccessTitle')}
          </h3>
          <p className="text-sm text-ink-500 dark:text-gray-400 mt-2">
            {t('propertyDetails.reportSuccessMessage')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-clay-700 hover:bg-clay-800 text-white font-medium py-2.5 transition-colors"
          >
            {t('propertyDetails.reportClose')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('propertyDetails.reportThisProperty')} size="sm">
      <p className="text-sm text-ink-500 dark:text-gray-400 mb-4">{t('propertyDetails.reportIntro')}</p>

      <fieldset>
        <legend className="text-sm font-medium text-ink-900 dark:text-white mb-2">
          {t('propertyDetails.reportReasonLabel')}
        </legend>
        <div className="space-y-2">
          {REPORT_REASONS.map(({ key, value }) => (
            <label
              key={key}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                reason === value
                  ? 'border-clay-600 bg-clay-50 dark:bg-clay-900/20 text-ink-900 dark:text-white'
                  : 'border-stone-200 dark:border-gray-700 text-ink-700 dark:text-gray-300 hover:border-stone-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="report-reason"
                value={value}
                checked={reason === value}
                onChange={() => setReason(value)}
                className="accent-clay-700"
              />
              {t(`propertyDetails.reportReasons.${key}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block mt-4">
        <span className="text-sm font-medium text-ink-900 dark:text-white">
          {t('propertyDetails.reportDetailsLabel')}
        </span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder={t('propertyDetails.reportDetailsPlaceholder')}
          className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-clay-600"
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex-1 rounded-xl border border-stone-200 dark:border-gray-700 py-2.5 text-sm font-medium text-ink-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {t('propertyDetails.reportCancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!reason || submitting}
          className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t('propertyDetails.reportSubmitting') : t('propertyDetails.reportSubmit')}
        </button>
      </div>
    </Modal>
  );
}
