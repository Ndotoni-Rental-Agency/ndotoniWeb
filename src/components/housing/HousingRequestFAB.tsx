'use client';

import { usePathname } from 'next/navigation';
import { HOUSING_REQUEST_CTA } from './housingRequestCopy';
import { HousingRequestModal } from './HousingRequestModal';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';

/**
 * Floating action button that opens the housing request form as a modal.
 * Place this on the homepage or any page where users might want to submit a request.
 */
export function HousingRequestFAB() {
  const pathname = usePathname();
  const { isOpen, openModal, closeModal, titleId } = useHousingRequestModal();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={HOUSING_REQUEST_CTA.ariaLabel}
        className="
          fixed bottom-6 right-6 z-40
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

      <HousingRequestModal isOpen={isOpen} onClose={closeModal} titleId={titleId} />
    </>
  );
}
