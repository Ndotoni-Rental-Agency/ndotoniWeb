'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Status = 'confirming' | 'success' | 'error' | 'missing-params';

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();

  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const [status, setStatus] = useState<Status>(email && code ? 'confirming' : 'missing-params');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email || !code) return;

    verifyEmail(email, code)
      .then(() => setStatus('success'))
      .catch((err: any) => {
        setStatus('error');
        setError(err?.message || 'This link may have expired. Try signing up again to get a new one.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, code]);

  if (status === 'confirming') {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Confirming your email…</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">This only takes a second.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email confirmed</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your account is ready. Sign in to get started.</p>
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
    <div className="text-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {status === 'missing-params' ? 'Invalid confirmation link' : "Couldn't confirm your email"}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {status === 'missing-params'
          ? 'This link is missing some information. Copy the full link from your confirmation email, or request a new one.'
          : error}
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

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <VerifyEmail />
        </Suspense>
      </div>
    </div>
  );
}
