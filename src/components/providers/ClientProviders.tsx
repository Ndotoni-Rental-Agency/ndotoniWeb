'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollProvider } from '@/contexts/ScrollContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { HousingRequestInlineProvider } from '@/contexts/HousingRequestInlineContext';
import AmplifyProvider from '@/components/ui/AmplifyProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ScrollProvider>
          <HousingRequestInlineProvider>
            <AmplifyProvider>
              {children}
            </AmplifyProvider>
          </HousingRequestInlineProvider>
        </ScrollProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}