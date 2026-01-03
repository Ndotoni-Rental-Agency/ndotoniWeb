'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollProvider } from '@/contexts/ScrollContext';
import AmplifyProvider from '@/components/ui/AmplifyProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <ScrollProvider>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </ScrollProvider>
    </ThemeProvider>
  );
}