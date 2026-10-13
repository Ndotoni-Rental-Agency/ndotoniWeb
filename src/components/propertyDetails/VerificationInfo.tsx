'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  verified: boolean;
};

export default function VerificationInfo({ verified }: Props) {
  const { t } = useLanguage();

  if (!verified) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl bg-brand-50 p-4 dark:bg-brand-900/20">
      <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="font-bold text-brand-900 dark:text-brand-100">{t('propertyDetails.verifiedProperty')}</p>
        <p className="mt-0.5 text-sm text-brand-800 dark:text-brand-200">{t('propertyDetails.verifiedPropertyDesc')}</p>
      </div>
    </div>
  );
}
