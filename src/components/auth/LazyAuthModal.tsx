'use client';

import { lazy, Suspense } from 'react';

const AuthModal = lazy(() => import('./AuthModal'));

interface LazyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  initialView?: 'signin' | 'signup';
}

export default function LazyAuthModal(props: LazyAuthModalProps) {
  // Only load the modal when it's opened
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={null}>
      <AuthModal {...props} />
    </Suspense>
  );
}
