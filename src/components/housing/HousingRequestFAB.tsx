'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { HousingRequestForm } from './HousingRequestForm';
import { HOUSING_REQUEST_CTA } from './housingRequestCopy';

/**
 * Floating action button that opens the housing request form as a modal.
 * Place this on the homepage or any page where users might want to submit a request.
 */
export function HousingRequestFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={HOUSING_REQUEST_CTA.ariaLabel}
        className="
          fixed bottom-[92px] right-6 z-40
          flex items-center gap-1.5 sm:gap-2
          max-w-[calc(100vw-3rem)]
          px-3.5 py-2.5 sm:px-4 sm:py-3
          bg-brand-600 hover:bg-brand-700 active:bg-brand-800
          text-white font-semibold
          text-xs sm:text-sm leading-tight
          rounded-full
          shadow-green-sm hover:shadow-green
          transition-all duration-200 ease-out
          hover:scale-[1.03] active:scale-[0.98]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-gray-900
        "
      >
        <span className="whitespace-nowrap">{HOUSING_REQUEST_CTA.title}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md sm:max-w-lg animate-in fade-in zoom-in-95 duration-200"
          >
            <HousingRequestForm
              onClose={closeModal}
              titleId={titleId}
            />
          </div>
        </div>
      )}
    </>
  );
}
