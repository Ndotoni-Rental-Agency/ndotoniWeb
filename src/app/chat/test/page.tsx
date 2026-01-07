'use client';

import React from 'react';
import { ChatSubscriptionTest } from '@/components/chat';

export default function ChatTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chat Subscriptions Test
          </h1>
          <p className="text-gray-600">
            Test real-time GraphQL subscriptions for the chat system.
          </p>
        </div>

        <div className="grid gap-6">
          <ChatSubscriptionTest />
          
          <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How to Test
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <strong>1. Conversation Updates:</strong> Send a message from another device/browser while logged in as a different user in the same conversation.
              </div>
              <div>
                <strong>2. Unread Count:</strong> Send messages to this user from another account to see unread count updates.
              </div>
              <div>
                <strong>3. Message Updates:</strong> Enter a conversation ID and subscribe, then send messages to that conversation from another device.
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <strong>Note:</strong> Make sure the backend is deployed with chat subscriptions enabled. 
                Check the browser console for detailed subscription logs.
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Troubleshooting
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Check browser console for subscription errors</div>
              <div>• Verify GraphQL endpoint is configured correctly</div>
              <div>• Ensure AWS Amplify is configured with the right API key</div>
              <div>• Check that the backend subscription resolvers are deployed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}