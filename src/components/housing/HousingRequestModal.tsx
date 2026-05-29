'use client';

import { HousingRequestForm } from './HousingRequestForm';

type HousingRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
};

export function HousingRequestModal({ isOpen, onClose, titleId }: HousingRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
