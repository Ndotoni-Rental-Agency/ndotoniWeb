'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  clearAuthReturnState,
  getAuthReturnState,
} from '@/lib/auth-return';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await refreshUser();

        const returnState = getAuthReturnState();
        const destination = returnState?.returnUrl || '/';

        router.replace(destination);
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        clearAuthReturnState();
        router.replace('/');
      }
    };

    handleCallback();
  }, [router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
