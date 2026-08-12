'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';

interface ChatNavigationOptions {
  propertyId?: string;
  landlordId?: string;
  propertyTitle?: string;
  onAuthRequired?: () => void;
}

export function useChatNavigation() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthPrompt();

  const navigateToChat = (options: ChatNavigationOptions = {}) => {
    if (!isAuthenticated) {
      if (options.onAuthRequired) {
        options.onAuthRequired();
        return;
      }

      if (options.propertyId) {
        requireAuth({
          action: { type: 'chat', propertyId: options.propertyId },
        });
        return;
      }

      requireAuth();
      return;
    }

    let chatUrl = '/chat';

    if (options.propertyId && options.landlordId && options.propertyTitle) {
      const params = new URLSearchParams({
        propertyId: options.propertyId,
        landlordId: options.landlordId,
        propertyTitle: options.propertyTitle,
      });
      chatUrl = `/chat?${params.toString()}`;
    }

    router.push(chatUrl);
  };

  return {
    navigateToChat,
    isAuthenticated,
  };
}
