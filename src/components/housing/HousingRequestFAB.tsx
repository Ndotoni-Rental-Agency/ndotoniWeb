'use client';

import { usePathname } from 'next/navigation';
import { HOUSING_REQUEST_CTA } from './housingRequestCopy';
import { HousingRequestModal } from './HousingRequestModal';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';
import { useHousingRequestInline } from '@/contexts/HousingRequestInlineContext';
import { cn } from '@/lib/utils/common';

/**
 * Floating action button that opens the housing request form as a modal.
 * Place this on the homepage or any page where users might want to submit a request.
 */
export function HousingRequestFAB() {
  const pathname = usePathname();
  const { isOpen, openModal, closeModal, titleId } = useHousingRequestModal();
  const { hasInlineCTA } = useHousingRequestInline();

  if (pathname?.startsWith('/admin') || hasInlineCTA) {
    return null;
  }

  // Hide on homepage — the CTA is inline in the hero there
  if (pathname === '/') {
    return null;
  }

  // WhatsApp FAB sits at bottom-6 (24px) and is 56px tall — stack above it when both show.
  // On property pages WhatsApp is hidden on mobile, so sit at bottom-6 there instead.
  const isPropertyPage = /^\/(short-)?property\//.test(pathname ?? '');

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={HOUSING_REQUEST_CTA.ariaLabel}
        className={cn(
          'fixed right-6 z-40',
          isPropertyPage ? 'bottom-6 sm:bottom-[5.75rem]' : 'bottom-[5.75rem]',
          'flex items-center gap-1.5 sm:gap-2',
          'max-w-[calc(100vw-3rem)]',
          'px-3.5 py-2.5 sm:px-4 sm:py-3',
          'bg-brand-600 hover:bg-brand-700 active:bg-brand-800',
          'text-white font-semibold',
          'text-xs sm:text-sm leading-tight',
          'rounded-full',
          'shadow-green-sm hover:shadow-green',
          'transition-all duration-200 ease-out',
          'hover:scale-[1.03] active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-offset-gray-900',
        )}
      >
        <span className="whitespace-nowrap">{HOUSING_REQUEST_CTA.title}</span>
      </button>

      <HousingRequestModal isOpen={isOpen} onClose={closeModal} titleId={titleId} />
    </>
  );
}
