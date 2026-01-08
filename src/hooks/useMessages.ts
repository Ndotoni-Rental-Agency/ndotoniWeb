import { useState, useRef } from 'react';
import { ChatMessage } from '@/API';
import { chatAPI } from '@/lib/api/chat';

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messageSubscriptionRef = useRef<any>(null);
  const sendingRef = useRef(false); // Add ref to track sending state

  const loadMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const conversationMessages = await chatAPI.getConversationMessages(conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (
    conversationId: string, 
    senderId: string, 
    content: string,
    onSuccess?: (message: ChatMessage) => void
  ) => {
    // Use ref for immediate check to prevent race conditions
    if (sendingRef.current) {
      console.log('Message already being sent, ignoring duplicate request');
      return;
    }

    const optimisticMessage: ChatMessage = {
      __typename: 'ChatMessage',
      id: `temp-${Date.now()}`,
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      sendingRef.current = true;
      setSendingMessage(true);
      setMessages(prev => [...prev, optimisticMessage]);

      const newMessage = await chatAPI.sendMessage({
        conversationId,
        senderId,
        content,
      });

      // Replace optimistic message with real message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id ? newMessage : msg
        )
      );

      onSuccess?.(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    } finally {
      sendingRef.current = false;
      setSendingMessage(false);
    }
  };

  const subscribeToMessages = (conversationId: string, userId: string) => {
    // Clean up previous subscription
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current.unsubscribe();
      messageSubscriptionRef.current = null;
    }

    // Set up new subscription
    messageSubscriptionRef.current = chatAPI.subscribeToNewMessages(
      conversationId,
      (newMessage: any) => {
        console.log('New message received via subscription:', newMessage);
        // Only add message if it's not from the current user (to avoid duplicates)
        if (newMessage.senderId !== userId) {
          setMessages(prev => [...prev, newMessage]);
        }
      }
    );
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const cleanup = () => {
    if (messageSubscriptionRef.current) {
      messageSubscriptionRef.current.unsubscribe();
      messageSubscriptionRef.current = null;
    }
  };

  return {
    messages,
    loadingMessages,
    sendingMessage,
    loadMessages,
    sendMessage,
    subscribeToMessages,
    clearMessages,
    cleanup,
  };
}