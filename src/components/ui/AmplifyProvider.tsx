'use client';

import { useEffect } from 'react';
import '@/lib/amplify';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthPromptProvider } from '@/contexts/AuthPromptContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Amplify is configured in the import above
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <AuthPromptProvider>
            {children}
          </AuthPromptProvider>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}