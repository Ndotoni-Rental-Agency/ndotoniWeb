import { useState, useEffect, useRef } from 'react';
import { Conversation } from '@/API';
import { chatAPI } from '@/lib/api/chat';

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const conversationSubscriptionRef = useRef<any>(null);

  const loadConversations = async () => {
    if (!userId) return [];
    
    try {
      setLoadingConversations(true);
      console.log('Loading conversations for userId:', userId);
      const userConversations = await chatAPI.getUserConversations(userId);
      console.log('Loaded conversations:', userConversations);
      setConversations(userConversations);
      return userConversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    } finally {
      setLoadingConversations(false);
    }
  };

  const updateConversationLastMessage = (conversationId: string, content: string, senderId: string, timestamp: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { 
              ...conv, 
              lastMessage: content,
              lastMessageSender: senderId,
              lastMessageTime: timestamp,
              updatedAt: timestamp
            }
          : conv
      ).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
    );
  };

  const markConversationAsRead = (conversationId: string, userId: string) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          // Parse the existing unreadCount JSON string
          let unreadCountObj: Record<string, number> = {};
          try {
            unreadCountObj = typeof conv.unreadCount === 'string' 
              ? JSON.parse(conv.unreadCount) 
              : (conv.unreadCount as any) || {};
          } catch (e) {
            console.warn('Failed to parse unreadCount:', conv.unreadCount);
            unreadCountObj = {};
          }
          
          // Update the count for this user
          unreadCountObj[userId] = 0;
          
          return {
            ...conv,
            unreadCount: JSON.stringify(unreadCountObj)
          };
        }
        return conv;
      })
    );
  };

  useEffect(() => {
    if (userId) {
      loadConversations();

      // Set up real-time subscription for conversation updates
      conversationSubscriptionRef.current = chatAPI.subscribeToConversationUpdates(
        userId,
        (updatedConversation: any) => {
          console.log('Conversation updated via subscription:', updatedConversation);
          setConversations(prev => {
            const updated = prev.map(conv =>
              conv.id === updatedConversation.id ? updatedConversation : conv
            );
            return updated.sort((a, b) => 
              new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            );
          });
        }
      );
    }

    return () => {
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
        conversationSubscriptionRef.current = null;
      }
    };
  }, [userId]);

  return {
    conversations,
    loadingConversations,
    loadConversations,
    updateConversationLastMessage,
    markConversationAsRead,
  };
}