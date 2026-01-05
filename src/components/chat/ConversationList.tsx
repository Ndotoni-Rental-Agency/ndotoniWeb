'use client';

import React from 'react';
import { ConversationWithParticipant } from '@/types/chat';

interface ConversationListProps {
  conversations: ConversationWithParticipant[];
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
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
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
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const participant = conversation.otherParticipant;
        const lastMessage = conversation.lastMessage;
        const isLastMessageFromCurrentUser = lastMessage?.senderId === currentUserId;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
              isSelected ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-medium">
                {participant.profileImage ? (
                  <img
                    src={participant.profileImage}
                    alt={`${participant.firstName} ${participant.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">
                    {participant.firstName.charAt(0)}{participant.lastName.charAt(0)}
                  </span>
                )}
              </div>
              {participant.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>

            {/* Conversation Info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {participant.firstName} {participant.lastName}
                </h3>
                {lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                    {formatTime(lastMessage.timestamp)}
                  </span>
                )}
              </div>

              {conversation.propertyTitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                  📍 {conversation.propertyTitle}
                </p>
              )}

              {lastMessage && (
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${
                    !lastMessage.isRead && !isLastMessageFromCurrentUser
                      ? 'font-medium text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isLastMessageFromCurrentUser && (
                      <span className="text-gray-500 dark:text-gray-400 mr-1">You: </span>
                    )}
                    {lastMessage.content}
                  </p>
                  {conversation.unreadCount > 0 && !isLastMessageFromCurrentUser && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

