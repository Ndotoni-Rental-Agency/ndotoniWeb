'use client';

import { useEffect } from 'react';
import { HousingRequestForm } from './HousingRequestForm';

type HousingRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
};

export function HousingRequestModal({ isOpen, onClose, titleId }: HousingRequestModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md sm:max-w-lg animate-in fade-in zoom-in-95 duration-200"
      >
        <HousingRequestForm onClose={onClose} titleId={titleId} />
      </div>
    </div>
  );
}
