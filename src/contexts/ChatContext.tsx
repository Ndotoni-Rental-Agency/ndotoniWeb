import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useAuth } from './AuthContext';
import { Conversation, ChatMessage } from '@/API';
import { 
  getUserConversations, 
  getConversationMessages, 
  getUnreadCount 
} from '@/graphql/queries';
import { 
  createConversation, 
  sendMessage as sendMessageMutation, 
  markAsRead 
} from '@/graphql/mutations';

interface ChatContextType {
  // State
  conversations: Conversation[];
  messages: ChatMessage[];
  unreadCount: number;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  isLoading: boolean;
  
  // Actions
  loadConversations: () => Promise<Conversation[]>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, senderId: string, content: string) => Promise<void>;
  createNewConversation: (input: {
    tenantId: string;
    landlordId: string;
    propertyId: string;
    propertyTitle: string;
    initialMessage?: string;
  }) => Promise<Conversation>;
  markConversationAsRead: (conversationId: string, userId: string) => Promise<void>;
  subscribeToConversation: (conversationId: string, userId: string) => void;
  refreshUnreadCount: () => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
  const sendMessage = async (conversationId: string, senderId: string, content: string): Promise<void> => {
    if (sendingRef.current) return;

    const optimisticMessage: ChatMessage = {
      __typename: 'ChatMessage',
      id: `temp-${Date.now()}`,
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Show message immediately - no waiting!
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Update conversation last message immediately
    updateConversationLastMessage(conversationId, content, senderId, optimisticMessage.timestamp);

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

      // Replace optimistic message with real message (in background)
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id ? newMessage : msg
        )
      );

      // Update conversation with real timestamp
      updateConversationLastMessage(conversationId, content, newMessage.senderId, newMessage.timestamp);

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      throw error;
    } finally {
      sendingRef.current = false;
      setSendingMessage(false);
    }
  };

  // Create new conversation
  const createNewConversation = async (input: {
    tenantId: string;
    landlordId: string;
    propertyId: string;
    propertyTitle: string;
    initialMessage?: string;
  }): Promise<Conversation> => {
    // If there's an initial message, show it immediately
    if (input.initialMessage) {
      const optimisticMessage: ChatMessage = {
        __typename: 'ChatMessage',
        id: `temp-${Date.now()}`,
        conversationId: `temp-conv-${Date.now()}`, // Temporary conversation ID
        senderId: input.tenantId,
        content: input.initialMessage,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      
      setMessages([optimisticMessage]);
    }

    try {
      const data = await GraphQLClient.executeAuthenticated<{ createConversation: Conversation }>(
        createConversation,
        { input }
      );
      const newConversation = data.createConversation;
      
      // Add to conversations list
      setConversations(prev => [newConversation, ...prev]);
      
      // If there was an initial message, update it with the real conversation ID
      if (input.initialMessage) {
        setMessages(prev => 
          prev.map(msg => 
            msg.conversationId.startsWith('temp-conv-') 
              ? { ...msg, conversationId: newConversation.id }
              : msg
          )
        );
      }
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Remove optimistic message on error
      if (input.initialMessage) {
        setMessages([]);
      }
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

      // Update local state
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            let unreadCountObj: Record<string, number> = {};
            try {
              unreadCountObj = typeof conv.unreadCount === 'string' 
                ? JSON.parse(conv.unreadCount) 
                : (conv.unreadCount as any) || {};
            } catch (e) {
              unreadCountObj = {};
            }
            
            unreadCountObj[userId] = 0;
            
            return {
              ...conv,
              unreadCount: JSON.stringify(unreadCountObj)
            };
          }
          return conv;
        })
      );

      // Refresh unread count
      refreshUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  };

  // Subscribe to conversation messages
  const subscribeToConversation = (conversationId: string, userId: string): void => {
    // Clean up previous subscription
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current.unsubscribe();
      messageSubscriptionRef.current = null;
    }

    // Subscriptions are temporarily disabled
    console.log('Chat subscriptions are temporarily disabled');
    
    // TODO: Re-enable when subscriptions are available
    /*
    const subscription = client.graphql({
      query: onNewMessage,
      variables: { conversationId }
    });

    if ('subscribe' in subscription) {
      messageSubscriptionRef.current = subscription.subscribe({
        next: ({ data }: any) => {
          if (data?.onNewMessage) {
            const newMessage = data.onNewMessage;
            
            // Add message to the list, avoiding duplicates
            setMessages(prev => {
              const exists = prev.some(msg => 
                msg.id === newMessage.id || 
                (msg.id.startsWith('temp-') && msg.content === newMessage.content && msg.senderId === newMessage.senderId)
              );
              
              if (exists) {
                return prev.map(msg => 
                  (msg.id.startsWith('temp-') && msg.content === newMessage.content && msg.senderId === newMessage.senderId)
                    ? newMessage 
                    : msg
                );
              } else {
                return [...prev, newMessage];
              }
            });
          }
        },
        error: (error: any) => {
          console.error('Message subscription error:', error);
        }
      });
    }
    */
  };

  // Refresh unread count
  const refreshUnreadCount = async (): Promise<void> => {
    if (!user) return;

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

  // Helper function to update conversation last message
  const updateConversationLastMessage = (conversationId: string, content: string, senderId: string, timestamp: string): void => {
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

    // Subscriptions are temporarily disabled
    console.log('Chat subscriptions are temporarily disabled');
    
    // TODO: Re-enable when subscriptions are available
    /*
    // Set up conversation updates subscription
    const conversationSubscription = client.graphql({
      query: onConversationUpdated,
    });

    if ('subscribe' in conversationSubscription) {
      conversationSubscriptionRef.current = conversationSubscription.subscribe({
        next: ({ data }: any) => {
          if (data?.onConversationUpdated) {
            setConversations(prev => {
              const updated = prev.map(conv =>
                conv.id === data.onConversationUpdated.id ? data.onConversationUpdated : conv
              );
              return updated.sort((a, b) => 
                new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
              );
            });
          }
        },
        error: (error: any) => {
          console.error('Conversation subscription error:', error);
        }
      });
    }

    // Set up unread count subscription
    const unreadSubscription = client.graphql({
      query: onUnreadCountChanged,
    });

    if ('subscribe' in unreadSubscription) {
      unreadSubscriptionRef.current = unreadSubscription.subscribe({
        next: ({ data }: any) => {
          if (data?.onUnreadCountChanged) {
            setUnreadCount(data.onUnreadCountChanged.totalUnread);
          }
        },
        error: (error: any) => {
          console.error('Unread count subscription error:', error);
        }
      });
    }
    */

    return () => {
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
        conversationSubscriptionRef.current = null;
      }
      if (unreadSubscriptionRef.current) {
        unreadSubscriptionRef.current.unsubscribe();
        unreadSubscriptionRef.current = null;
      }
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
    unreadCount,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    isLoading,
    
    // Actions
    loadConversations,
    loadMessages,
    sendMessage,
    createNewConversation,
    markConversationAsRead,
    subscribeToConversation,
    refreshUnreadCount,
    clearMessages,
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
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}