'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/contexts/ChatContext';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { AuthPendingAction } from '@/lib/auth-return';
import { logger } from '@/lib/utils/logger';

/**
 * Executes serializable auth pending actions after successful authentication.
 * Used by AuthPromptProvider and survives OAuth full-page redirects.
 */
export function useAuthActionExecutor() {
  const router = useRouter();
  const { initializeChat } = useChat();
  const { toggleFavorite } = usePropertyFavorites();

  const executeAuthAction = useCallback(
    async (action: AuthPendingAction): Promise<void> => {
      switch (action.type) {
        case 'contact-agent':
        case 'chat': {
          const chatData = await initializeChat(action.propertyId);
          const params = new URLSearchParams({
            conversationId: chatData.conversationId,
            propertyId: action.propertyId,
            propertyTitle: chatData.propertyTitle,
            landlordName: chatData.landlordName,
            newPropertyInquiry: 'true',
          });
          router.push(`/chat?${params.toString()}`);
          break;
        }
        case 'favorite': {
          await toggleFavorite(action.propertyId);
          break;
        }
        case 'book': {
          const bookingData = {
            checkIn: action.checkIn,
            checkOut: action.checkOut,
            guests: action.guests,
          };
          sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
          router.push(
            `/booking/${action.propertyId}?checkIn=${action.checkIn}&checkOut=${action.checkOut}&guests=${action.guests}`
          );
          break;
        }
        case 'navigate': {
          router.push(action.path);
          break;
        }
        default: {
          const _exhaustive: never = action;
          logger.warn('Unknown auth pending action', _exhaustive);
        }
      }
    },
    [initializeChat, router, toggleFavorite]
  );

  return { executeAuthAction };
}
