'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ChatContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refreshUnreadCount: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const refreshUnreadCount = () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }

    // TODO: Replace with actual API call to get unread count
    // For now, simulate with mock data
    const mockUnreadCount = 3; // This would come from your chat API
    setUnreadCount(mockUnreadCount);
  };

  useEffect(() => {
    refreshUnreadCount();
  }, [isAuthenticated, user]);

  return (
    <ChatContext.Provider value={{
      unreadCount,
      setUnreadCount,
      refreshUnreadCount
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