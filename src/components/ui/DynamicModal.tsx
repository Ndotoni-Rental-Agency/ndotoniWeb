'use client';

import { Suspense, lazy } from 'react';

// Dynamic imports for heavy modal components
const AuthModal = lazy(() => import('@/components/auth/AuthModal'));
const BecomeLandlordModal = lazy(() => import('@/components/auth/BecomeLandlordModal'));

// Loading fallback component
const ModalSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

interface DynamicAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
  onAuthSuccess?: () => void;
}

export const DynamicAuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }: DynamicAuthModalProps) => {
  if (!isOpen) return null;

  return (
    <Suspense fallback={<ModalSkeleton />}>
      <AuthModal 
        isOpen={isOpen} 
        onClose={onClose} 
        initialMode={initialMode}
        onAuthSuccess={onAuthSuccess}
      />
    </Suspense>
  );
};

interface DynamicBecomeLandlordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicBecomeLandlordModal = ({ isOpen, onClose }: DynamicBecomeLandlordModalProps) => {
  if (!isOpen) return null;

  return (
    <Suspense fallback={<ModalSkeleton />}>
      <BecomeLandlordModal isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
};