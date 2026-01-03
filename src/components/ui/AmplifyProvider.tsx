'use client';

import { useEffect } from 'react';
import '@/lib/amplify';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Amplify is configured in the import
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}