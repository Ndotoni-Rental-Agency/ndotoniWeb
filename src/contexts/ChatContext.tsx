'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { chatAPI } from '@/lib/api/chat';

interface ChatContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refreshUnreadCount: () => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const subscriptionRef = useRef<any>(null);

  const refreshUnreadCount = async () => {
    if (!isAuthenticated || !user?.userId) {
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const count = await chatAPI.getUnreadCount(user.userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription for unread count changes
  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      // Clean up subscription if user logs out
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      setUnreadCount(0);
      return;
    }

    // Initial load
    refreshUnreadCount();

    // Set up subscription for real-time updates
    subscriptionRef.current = chatAPI.subscribeToUnreadCountChanges(
      user.userId,
      (newCount: number) => {
        console.log('Unread count updated via subscription:', newCount);
        setUnreadCount(newCount);
      }
    );

    // Cleanup subscription on unmount or user change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [isAuthenticated, user?.userId]);

  return (
    <ChatContext.Provider value={{
      unreadCount,
      setUnreadCount,
      refreshUnreadCount,
      isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}