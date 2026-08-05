'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Status = 'form' | 'submitting' | 'success' | 'missing-params';

function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const [status, setStatus] = useState<Status>(email && code ? 'form' : 'missing-params');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !code) return;

    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError('');
    setStatus('submitting');

    try {
      await resetPassword(email, code, newPassword);
      setStatus('success');
    } catch (err: any) {
      setStatus('form');
      setError(err?.message || 'This link may have expired. Request a new password reset to keep going.');
    }
  }

  if (status === 'missing-params') {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid reset link</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This link is missing some information. Copy the full link from your password reset email, or request a new one.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Back to ndotoni
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password updated</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You can sign in with your new password now.</p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Go to ndotoni
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Reset your password</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
              placeholder="Enter new password"
              minLength={8}
              disabled={status === 'submitting'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
            placeholder="Confirm new password"
            minLength={8}
            disabled={status === 'submitting'}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'submitting' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  );
}
