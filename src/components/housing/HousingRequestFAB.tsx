'use client';

import { useState } from 'react';
import { HousingRequestForm } from './HousingRequestForm';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Floating action button that opens the housing request form as a modal.
 * Place this on the homepage or any page where users might want to submit a request.
 */
export function HousingRequestFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[92px] right-[24px] z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center group"
        aria-label="Tuambia Mahitaji Yako"
        title="Tuambia Mahitaji Yako"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
        {/* Tooltip */}
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tuambie Mahitaji Yako
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Content */}
          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="Close"
            >
              <XMarkIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <HousingRequestForm onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
