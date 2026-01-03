import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { extractErrorMessage, isUserNotConfirmedError, getFriendlyErrorMessage } from '@/lib/utils/errorUtils';

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'verify-email' | 'reset-password';

export function useAuthModal(initialMode: AuthMode = 'signin') {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  const { signIn, signUp, signInWithSocial, signUpWithSocial, verifyEmail, forgotPassword, resetPassword, resendVerificationCode: resendCode } = useAuth();

  // Clear messages when mode changes
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Tanzania phone number validation
    const phoneRegex = /^(\+255|255|0)[67]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      setPendingEmail(email);
      await signIn(email, password);
      return true; // Success
    } catch (err) {
      // Check if user is not confirmed
      if (isUserNotConfirmedError(err)) {
        setPendingEmail(email);
        try {
          await resendCode(email);
          setSuccess('Your account needs to be verified. Please check your email for the verification code.');
        } catch (resendErr) {
          setError(getFriendlyErrorMessage(resendErr));
        }
        switchMode('verify-email');
        return false;
      }
      
      const errorMessage = getFriendlyErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    setLoading(true);
    setError(null);

    if (!validatePhoneNumber(data.phoneNumber)) {
      setError('Please enter a valid Tanzania phone number (e.g., +255 XXX XXX XXX)');
      setLoading(false);
      return false;
    }

    try {
      await signUp(data);
      setPendingEmail(data.email);
      setSuccess('Account created successfully! Please check your email for the verification code.');
      setTimeout(() => {
        switchMode('verify-email');
      }, 2000);
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Sign up failed');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setPendingEmail(email);
      setSuccess(`Password reset code sent to ${email}`);
      switchMode('reset-password');
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Failed to send reset email');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

    if (provider === 'google' && !googleClientId) {
      setError('Google authentication is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.');
      setLoading(false);
      return false;
    }

    if (provider === 'facebook' && !facebookAppId) {
      setError('Facebook authentication is not configured. Please add NEXT_PUBLIC_FACEBOOK_APP_ID to your environment variables.');
      setLoading(false);
      return false;
    }

    try {
      if (mode === 'signin') {
        await signInWithSocial(provider);
      } else {
        await signUpWithSocial(provider, 'TENANT');
      }
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err, `${provider} authentication failed`);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      await verifyEmail(pendingEmail, code);
      setSuccess('Email verified successfully! You can now sign in.');
      setTimeout(() => {
        switchMode('signin');
      }, 2000);
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Email verification failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (code: string, newPassword: string) => {
    setLoading(true);
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(pendingEmail, code, newPassword);
      setSuccess('Password reset successfully! You can now sign in with your new password.');
      setTimeout(() => {
        switchMode('signin');
      }, 2000);
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Password reset failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!pendingEmail) {
      setError('No email address found. Please try signing up again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resendCode(pendingEmail);
      setSuccess('Verification code sent to your email.');
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Failed to resend verification code. Please try again later.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}