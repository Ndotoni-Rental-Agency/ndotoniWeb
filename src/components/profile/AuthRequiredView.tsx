'use client';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthModal from '@/components/auth/AuthModal';

interface AuthRequiredViewProps {
  showAuthModal: boolean;
  onShowAuthModal: (show: boolean) => void;
}

export default function AuthRequiredView({ showAuthModal, onShowAuthModal }: AuthRequiredViewProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('auth.signIn')} Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to view your profile.
          </p>
          <Button
            onClick={() => onShowAuthModal(true)}
            variant="primary"
          >
            {t('auth.signIn')}
          </Button>
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => onShowAuthModal(false)}
        initialMode="signin"
      />
    </>
  );
}