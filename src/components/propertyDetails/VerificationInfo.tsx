'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  verificationStatus: string | undefined;
};

export default function VerificationInfo({ verificationStatus }: Props) {
  const { t } = useLanguage();
  if (!verificationStatus) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">{t('propertyDetails.propertyVerification')}</h3>
      <div className="space-y-3">
        {verificationStatus === 'VERIFIED' ? (
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-medium text-green-800 dark:text-green-400 transition-colors">{t('propertyDetails.verifiedProperty')}</div>
              <div className="text-sm text-green-700 dark:text-green-300 transition-colors">{t('propertyDetails.verifiedPropertyDesc')}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-medium text-yellow-800 dark:text-yellow-400 transition-colors">{t('propertyDetails.unverifiedProperty')}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 transition-colors">{t('propertyDetails.unverifiedPropertyDesc')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
