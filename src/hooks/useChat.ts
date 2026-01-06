'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ChatNavigationOptions {
  propertyId?: string;
  landlordId?: string;
  propertyTitle?: string;
  onAuthRequired?: () => void;
}

export function useChatNavigation() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const navigateToChat = (options: ChatNavigationOptions = {}) => {
    if (!isAuthenticated) {
      // If user is not authenticated, call the auth handler or redirect to property
      if (options.onAuthRequired) {
        options.onAuthRequired();
        return;
      }
      
      // Fallback: redirect to property page where they can authenticate
      if (options.propertyId) {
        router.push(`/property/${options.propertyId}`);
        return;
      }
      
      // No property context, just return
      return;
    }

    // Build chat URL with property context if available
    let chatUrl = '/chat';
    
    if (options.propertyId && options.landlordId && options.propertyTitle) {
      const params = new URLSearchParams({
        propertyId: options.propertyId,
        landlordId: options.landlordId,
        propertyTitle: options.propertyTitle
      });
      chatUrl = `/chat?${params.toString()}`;
    }

    router.push(chatUrl);
  };

  return {
    navigateToChat,
    isAuthenticated
  };
}