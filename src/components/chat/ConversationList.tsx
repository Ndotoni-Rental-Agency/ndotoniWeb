'use client';

import React from 'react';
import { Conversation } from '@/types/chat';
import { getUser } from '@/lib/mockChatData';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start a conversation to connect with others
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conversation, index) => {
        const isSelected = conversation.id === selectedConversationId;
        
        // Get the other participant
        const otherUserId = conversation.tenantId === currentUserId 
          ? conversation.landlordId 
          : conversation.tenantId;
        const otherUser = getUser(otherUserId);
        
        // Check if current user has unread messages
        const unreadCount = conversation.unreadCount[currentUserId] || 0;
        const isLastMessageFromMe = conversation.lastMessageSender === currentUserId;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-700 text-left ${
              isSelected ? 'bg-red-50 dark:bg-red-900/20' : ''
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-medium overflow-hidden">
                {otherUser?.profileImage ? (
                  <img
                    src={otherUser.profileImage}
                    alt={`${otherUser.firstName} ${otherUser.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base">
                    {otherUser ? `${otherUser.firstName.charAt(0)}${otherUser.lastName.charAt(0)}` : '??'}
                  </span>
                )}
              </div>
            </div>

            {/* Conversation Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User'}
                </h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                  {unreadCount > 0 && !isLastMessageFromMe && (
                    <div className="w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${
                    unreadCount > 0 && !isLastMessageFromMe
                      ? 'font-medium text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isLastMessageFromMe && (
                      <span className="text-gray-500 dark:text-gray-400 mr-1">You: </span>
                    )}
                    {conversation.lastMessage}
                  </p>
                  {conversation.propertyTitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      📍 {conversation.propertyTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

