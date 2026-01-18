'use client';

import { ReactNode, Suspense, lazy } from 'react';

// Lazy load AmplifyProvider to reduce initial bundle
const AmplifyProvider = lazy(() => import('@/components/ui/AmplifyProvider'));

interface LazyAmplifyProviderProps {
  children: ReactNode;
}

export default function LazyAmplifyProvider({ children }: LazyAmplifyProviderProps) {
  return (
    <Suspense fallback={children}>
      <AmplifyProvider>
        {children}
      </AmplifyProvider>
    </Suspense>
  );
}
