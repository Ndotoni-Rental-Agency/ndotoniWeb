'use client';

import { lazy, Suspense } from 'react';

const ConfirmationModal = lazy(() => import('./ConfirmationModal'));

interface LazyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function LazyConfirmationModal(props: LazyConfirmationModalProps) {
  // Only load the modal when it's opened
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={null}>
      <ConfirmationModal {...props} />
    </Suspense>
  );
}
