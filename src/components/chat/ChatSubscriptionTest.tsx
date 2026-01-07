'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatAPI } from '@/lib/api/chat';

export function ChatSubscriptionTest() {
  const { user, isAuthenticated } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    conversations: boolean;
    unreadCount: boolean;
    messages: string | null;
  }>({
    conversations: false,
    unreadCount: false,
    messages: null,
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setSubscriptionStatus({
        conversations: false,
        unreadCount: false,
        messages: null,
      });
      return;
    }

    console.log('Setting up chat subscriptions for user:', user.userId);

    // Test conversation updates subscription
    const conversationSub = chatAPI.subscribeToConversationUpdates(
      user.userId,
      (conversation) => {
        console.log('🔄 Conversation update received:', conversation);
        setSubscriptionStatus(prev => ({ ...prev, conversations: true }));
        setLastUpdate(`Conversation updated: ${conversation.id} at ${new Date().toLocaleTimeString()}`);
      }
    );

    // Test unread count subscription
    const unreadSub = chatAPI.subscribeToUnreadCountChanges(
      user.userId,
      (count) => {
        console.log('📊 Unread count update received:', count);
        setSubscriptionStatus(prev => ({ ...prev, unreadCount: true }));
        setLastUpdate(`Unread count: ${count} at ${new Date().toLocaleTimeString()}`);
      }
    );

    return () => {
      if (conversationSub) conversationSub.unsubscribe();
      if (unreadSub) unreadSub.unsubscribe();
    };
  }, [isAuthenticated, user?.userId]);

  const testMessageSubscription = (conversationId: string) => {
    if (!conversationId.trim()) return;

    console.log('Testing message subscription for conversation:', conversationId);
    
    const messageSub = chatAPI.subscribeToNewMessages(
      conversationId,
      (message) => {
        console.log('💬 New message received:', message);
        setSubscriptionStatus(prev => ({ ...prev, messages: conversationId }));
        setLastUpdate(`New message in ${conversationId}: "${message.content}" at ${new Date().toLocaleTimeString()}`);
      }
    );

    // Auto cleanup after 30 seconds
    setTimeout(() => {
      if (messageSub) messageSub.unsubscribe();
      setSubscriptionStatus(prev => ({ ...prev, messages: null }));
    }, 30000);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please sign in to test chat subscriptions</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chat Subscriptions Test
      </h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${subscriptionStatus.conversations ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm">Conversation Updates</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${subscriptionStatus.unreadCount ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm">Unread Count Updates</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${subscriptionStatus.messages ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm">
            Message Updates {subscriptionStatus.messages && `(${subscriptionStatus.messages})`}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Message Subscription (Enter Conversation ID):
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="e.g., tenant123#property456"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                testMessageSubscription((e.target as HTMLInputElement).value);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="tenant123"]') as HTMLInputElement;
              if (input) testMessageSubscription(input.value);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Subscribe
          </button>
        </div>
      </div>

      {lastUpdate && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Last Update:</strong> {lastUpdate}
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>User ID: {user?.userId}</p>
        <p>This component tests real-time GraphQL subscriptions for chat functionality.</p>
      </div>
    </div>
  );
}