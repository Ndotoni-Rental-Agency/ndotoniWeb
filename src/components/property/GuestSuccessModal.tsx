'use client';

import React from 'react';
import Portal from '@/components/ui/Portal';

interface GuestSuccessModalProps {
  isOpen: boolean;
  propertyId: string;
  onCreateAccount: () => void;
  onGoHome: () => void;
}

export function GuestSuccessModal({
  isOpen,
  propertyId,
  onCreateAccount,
  onGoHome,
}: GuestSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          
          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 transition-colors z-10 mx-4">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Property Published! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Your property has been successfully published
              </p>
            </div>

            {/* Property ID */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Property ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white break-all">
                {propertyId}
              </p>
            </div>

            {/* Benefits of Creating Account */}
            <div className="mb-6 p-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl bg-emerald-50 dark:bg-emerald-900/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Create an account to:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manage and edit your property listing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Respond to inquiries and messages</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track views and performance</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>List additional properties</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onCreateAccount}
                className="w-full px-6 py-3 bg-gray-900 dark:bg-emerald-900 hover:bg-gray-800 dark:hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors"
              >
                Create Account Now
              </button>
              <button
                onClick={onGoHome}
                className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            {/* Note */}
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              You can create an account anytime to claim and manage this property
            </p>
          </div>
        </div>
      </div>
    </Portal>
  );
}
