'use client';

import React from 'react';
import Portal from '@/components/ui/Portal';

interface AccountPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

export function AccountPromptModal({
  isOpen,
  onClose,
  onCreateAccount,
  onContinueAsGuest,
}: AccountPromptModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 transition-colors z-10 mx-4">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-4">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                List Your Property
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Choose how you'd like to proceed
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={onCreateAccount}
                className="w-full px-6 py-3 bg-gray-900 dark:bg-emerald-900 hover:bg-gray-800 dark:hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={onContinueAsGuest}
                className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
              >
                Continue as Guest
              </button>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-4">
              {/* Create Account Option */}
              <div className="border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/10">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Create an Account (Recommended)
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Save drafts and edit anytime</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Manage multiple properties</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Track inquiries and messages</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Access analytics and insights</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Guest Option */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Continue as Guest
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Quick listing with minimal info</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Publish immediately with photos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Cannot save drafts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Limited property management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              You can create an account later to manage your guest listings
            </p>
          </div>
        </div>
      </div>
    </Portal>
  );
}
