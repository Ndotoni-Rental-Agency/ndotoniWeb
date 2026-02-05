import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { ChatSubscriptionManager } from '@/lib/subscriptions';
import { useAuth } from './AuthContext';
import { Conversation, ChatMessage } from '@/API';
import { 
  getUserConversations, 
  getConversationMessages, 
  getUnreadCount 
} from '@/graphql/queries';
import { 
  sendMessage as sendMessageMutation, 
  markAsRead 
} from '@/graphql/mutations';
import { initializePropertyChatSecure } from '@/lib/utils/chat';

interface ChatContextType {
  // State
  conversations: Conversation[];
  messages: ChatMessage[];
  selectedConversation: Conversation | null;
  unreadCount: number;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  isLoading: boolean;

  // Actions
  loadConversations: () => Promise<Conversation[]>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  initializeChat: (propertyId: string) => Promise<{
    conversationId: string;
    landlordName: string;
    propertyTitle: string;
  }>;
  markConversationAsRead: (conversationId: string, userId: string) => Promise<void>;
  subscribeToConversation: (conversationId: string) => void;
  refreshUnreadCount: () => Promise<void>;
  clearMessages: () => void;
  selectConversation: (conversationId: string | null) => void;
  selectTemporaryConversation: (tempConversation: Conversation & { isTemporary?: boolean; propertyId?: string; landlordInfo?: { firstName: string; lastName: string } }) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Throttle state for unread count refresh
  const lastUnreadRefresh = useRef(0);
  
  // Subscription refs
  const conversationSubscriptionRef = useRef<any>(null);
  const messageSubscriptionRef = useRef<any>(null);
  const unreadSubscriptionRef = useRef<any>(null);
  const sendingRef = useRef(false);

  // Load conversations
  const loadConversations = async (): Promise<Conversation[]> => {
    if (!user) return [];
    
    try {
      setLoadingConversations(true);
      const data = await GraphQLClient.executeAuthenticated<{ getUserConversations: Conversation[] }>(
        getUserConversations
      );
      const userConversations = data.getUserConversations;
      setConversations(userConversations);
      return userConversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    } finally {
      setLoadingConversations(false);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string): Promise<void> => {
    try {
      setLoadingMessages(true);
      const data = await GraphQLClient.executeAuthenticated<{ getConversationMessages: ChatMessage[] }>(
        getConversationMessages,
        { conversationId }
      );
      const conversationMessages = data.getConversationMessages;
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a message
  const sendMessage = async (conversationId: string, content: string): Promise<void> => {
    if (sendingRef.current) {
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      __typename: 'ChatMessage',
      id: tempId,
      conversationId,
      senderName: user?.firstName || 'You',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      isMine: true,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    
    updateConversationLastMessage(conversationId, content, optimisticMessage.timestamp);

    try {
      sendingRef.current = true;
      setSendingMessage(true);

      const data = await GraphQLClient.executeAuthenticated<{ sendMessage: ChatMessage }>(
        sendMessageMutation,
        {
          input: { conversationId, content }
        }
      );

      const newMessage = data.sendMessage;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId ? { ...newMessage } : msg
        )
      );

      updateConversationLastMessage(conversationId, content, newMessage.timestamp);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      throw error;
    } finally {
      sendingRef.current = false;
      setSendingMessage(false);
    }
  };

  // Initialize chat for a property (secure - no landlordId exposure)
  const initializeChat = async (propertyId: string): Promise<{
    conversationId: string;
    landlordName: string;
    propertyTitle: string;
  }> => {
    try {
      // Call secure backend endpoint
      const chatData = await initializePropertyChatSecure(propertyId);
      
      if (!chatData) {
        throw new Error('Failed to initialize chat');
      }

      const landlordName = chatData.landlordInfo.businessName || 
        `${chatData.landlordInfo.firstName} ${chatData.landlordInfo.lastName}`;

      // Refresh conversations to include the new one
      await loadConversations();

      return {
        conversationId: chatData.conversationId,
        landlordName,
        propertyTitle: chatData.propertyTitle,
      };
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  };

  // Mark conversation as read
  const markConversationAsRead = async (conversationId: string, userId: string): Promise<void> => {
    try {
      await GraphQLClient.executeAuthenticated<{ markAsRead: any }>(
        markAsRead,
        { conversationId }
      );

      // Update local state - unreadCount is now a simple Int (current user's count)
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );

      // Refresh unread count
      refreshUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  };

  // Subscribe to conversation messages
  const subscribeToConversation = (conversationId: string): void => {
    // Clean up previous subscription
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current();
      messageSubscriptionRef.current = null;
    }

    console.log('💬 Setting up chat subscription for conversation:', conversationId);
    
    const manager = ChatSubscriptionManager.getInstance();
    
    const unsubscribe = manager.subscribe(conversationId, {
      onMessage: (newMessage: ChatMessage) => {
        console.log('💬 New message received via subscription:', newMessage);
        
        // Add message to the list, avoiding duplicates
        setMessages(prev => {
          const exists = prev.some(msg => 
            msg.id === newMessage.id || 
            (msg.id.startsWith('temp-') && msg.content === newMessage.content && msg.timestamp === newMessage.timestamp)
          );
          
          if (exists) {
            // Replace temp message with real one
            return prev.map(msg => 
              (msg.id.startsWith('temp-') && msg.content === newMessage.content)
                ? newMessage 
                : msg
            );
          } else {
            return [...prev, newMessage];
          }
        });

        // Update conversation's last message
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: newMessage.content,
                  lastMessageTime: newMessage.timestamp,
                  unreadCount: newMessage.isMine ? conv.unreadCount : (conv.unreadCount || 0) + 1,
                }
              : conv
          )
        );

        // Refresh unread count if message is not mine
        if (!newMessage.isMine) {
          refreshUnreadCount();
        }
      },
      onError: (error: Error) => {
        console.error('💬 Chat subscription error:', error);
      },
      onConnect: () => {
        console.log('✅ Chat subscription connected for:', conversationId);
      },
      onDisconnect: () => {
        console.log('❌ Chat subscription disconnected for:', conversationId);
      },
    });

    messageSubscriptionRef.current = unsubscribe;
  };

  // Refresh unread count
  const refreshUnreadCount = async (): Promise<void> => {
    if (!user) return;

    // Throttle to prevent rapid successive calls (2 second minimum between calls)
    const now = Date.now();
    if (now - lastUnreadRefresh.current < 2000) {
      return;
    }
    lastUnreadRefresh.current = now;

    try {
      setIsLoading(true);
      const data = await GraphQLClient.executeAuthenticated<{ getUnreadCount: number }>(
        getUnreadCount
      );
      const count = data.getUnreadCount;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = (): void => {
    setMessages([]);
  };

  // Select conversation
  const selectConversation = (conversationId: string | null): void => {
    if (conversationId === null) {
      setSelectedConversation(null);
      return;
    }

    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
    }
  };

  // Select temporary conversation
  const selectTemporaryConversation = (tempConversation: Conversation & { isTemporary?: boolean; propertyId?: string; landlordInfo?: { firstName: string; lastName: string } }): void => {
    // Add temporary conversation to conversations array if not already present
    setConversations(prev => {
      const exists = prev.some(c => c.id === tempConversation.id);
      if (!exists) {
        return [...prev, tempConversation];
      }
      return prev;
    });
    setSelectedConversation(tempConversation);
  };

  // Helper function to update conversation last message
  const updateConversationLastMessage = (conversationId: string, content: string, timestamp: string): void => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { 
              ...conv, 
              lastMessage: content,
              lastMessageTime: timestamp,
              updatedAt: timestamp
            }
          : conv
      ).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
    );
  };

  // Set up subscriptions when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Clean up subscriptions if user logs out
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
        conversationSubscriptionRef.current = null;
      }
      if (unreadSubscriptionRef.current) {
        unreadSubscriptionRef.current.unsubscribe();
        unreadSubscriptionRef.current = null;
      }
      setUnreadCount(0);
      setConversations([]);
      setMessages([]);
      return;
    }

    // Initial load
    loadConversations();
    refreshUnreadCount();

    return () => {
      // Cleanup handled by ChatSubscriptionManager
    };
  }, [isAuthenticated, user]);

  // Clean up message subscription when component unmounts
  useEffect(() => {
    return () => {
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current.unsubscribe();
        messageSubscriptionRef.current = null;
      }
    };
  }, []);

  const value: ChatContextType = {
    // State
    conversations,
    messages,
    selectedConversation,
    unreadCount,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    isLoading,

    // Actions
    loadConversations,
    loadMessages,
    sendMessage,
    initializeChat,
    markConversationAsRead,
    subscribeToConversation,
    refreshUnreadCount,
    clearMessages,
    selectConversation,
    selectTemporaryConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    // During SSR or before provider is mounted, return default values
    if (typeof window === 'undefined') {
      return {
        conversations: [],
        messages: [],
        selectedConversation: null,
        unreadCount: 0,
        loadingConversations: false,
        loadingMessages: false,
        sendingMessage: false,
        isLoading: true,
        loadConversations: async () => [],
        loadMessages: async () => {},
        sendMessage: async () => {},
        initializeChat: async () => ({ conversationId: '', landlordName: '', propertyTitle: '' }),
        markConversationAsRead: async () => {},
        subscribeToConversation: () => {},
        refreshUnreadCount: async () => {},
        clearMessages: () => {},
        selectConversation: () => {},
        selectTemporaryConversation: () => {},
      } as ChatContextType;
    }
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}