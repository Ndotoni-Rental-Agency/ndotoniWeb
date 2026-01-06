'use client';

import { useEffect } from 'react';
import { useAuthModal, AuthMode } from '@/hooks/useAuthModal';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SocialAuthButtons } from './SocialAuthButtons';
import Portal from '@/components/ui/Portal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onAuthSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }: AuthModalProps) {
  const {
    mode,
    loading,
    error,
    success,
    pendingEmail,
    switchMode,
    handleSignIn,
    handleSignUp,
    handleForgotPassword,
    handleSocialAuth,
    handleVerifyEmail,
    handleResetPassword,
    resendVerificationCode,
  } = useAuthModal(initialMode);

  // Prevent body scroll when modal is open (especially important on mobile)
  useEffect(() => {
    if (isOpen) {
      // Add modal-open class to body
      document.body.classList.add('modal-open');
      
      // Cleanup function to remove class
      return () => {
        document.body.classList.remove('modal-open');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSignIn = async (email: string, password: string) => {
    const success = await handleSignIn(email, password);
    if (success) {
      onAuthSuccess?.();
      onClose();
    }
  };

  const onSignUp = async (data: any) => {
    const success = await handleSignUp(data);
    if (success) {
      onAuthSuccess?.();
      onClose();
    }
  };

  const onSocialAuth = async (provider: 'google' | 'facebook') => {
    const success = await handleSocialAuth(provider);
    if (success) {
      onAuthSuccess?.();
      onClose();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome back';
      case 'signup': return 'Create your account';
      case 'forgot': return 'Reset your password';
      case 'verify-email': return 'Verify your email';
      case 'reset-password': return 'Create new password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return 'Sign in to your ndotoni account';
      case 'signup': return 'Join ndotoni to find your perfect home';
      case 'forgot': return 'Enter your email to reset your password';
      default: return '';
    }
  };

  return (
    <Portal>
      <div className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto">
        <div className="modal-container flex min-h-full min-h-screen items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="modal-content relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 transition-colors z-10 mx-4 my-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getTitle()}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {getSubtitle()}
            </p>
          </div>

          {/* Verification Code Sent Notification */}
          {(mode === 'verify-email' || mode === 'reset-password') && pendingEmail && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 text-sm">
              A verification code has been sent to <span className="font-medium">{pendingEmail}</span>
            </div>
          )}

          {/* Success Messages - Keep at top for positive feedback */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Social Authentication Buttons - Show for signin and signup modes */}
          {(mode === 'signin' || mode === 'signup') && (
            <SocialAuthButtons onSocialAuth={onSocialAuth} loading={loading} />
          )}

          {/* Render appropriate form based on mode */}
          {mode === 'signin' && (
            <SignInForm onSubmit={onSignIn} loading={loading} error={error} />
          )}
          
          {mode === 'signup' && (
            <SignUpForm onSubmit={onSignUp} loading={loading} error={error} />
          )}
          
          {mode === 'forgot' && (
            <ForgotPasswordForm onSubmit={handleForgotPassword} loading={loading} error={error} />
          )}
          
          {mode === 'verify-email' && (
            <VerifyEmailForm onSubmit={handleVerifyEmail} loading={loading} error={error} />
          )}
          
          {mode === 'reset-password' && (
            <ResetPasswordForm onSubmit={handleResetPassword} loading={loading} error={error} />
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => switchMode('forgot')}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
                <div className="mt-2">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}
            {mode === 'signup' && (
              <div>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === 'forgot' && (
              <div>
                Remember your password?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === 'verify-email' && (
              <div className="space-y-2">
                <div>
                  Didn't receive the code?{' '}
                  <button
                    onClick={resendVerificationCode}
                    disabled={loading}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Sending...' : 'Resend code'}
                  </button>
                </div>
                <div>
                  Already verified?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}
            {mode === 'reset-password' && (
              <div>
                Didn't receive the code?{' '}
                <button
                  onClick={() => switchMode('forgot')}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Resend code
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}