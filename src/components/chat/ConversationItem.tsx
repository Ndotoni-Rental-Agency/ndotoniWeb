import React from 'react';
import { Conversation } from '@/API';
import { useUserInfo } from '@/hooks/useUserInfo';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string;
  onSelect: (conversationId: string) => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  currentUserId,
  onSelect,
}: ConversationItemProps) {
  // Get the other participant's ID
  const otherUserId = conversation.tenantId === currentUserId 
    ? conversation.landlordId 
    : conversation.tenantId;

  // Fetch the other user's information
  const { userInfo: otherUser, getDisplayName, getInitials } = useUserInfo(otherUserId);

  // Parse unreadCount from JSON string and check if current user has unread messages
  const unreadCountObj = JSON.parse(conversation.unreadCount || '{}');
  const unreadCount = unreadCountObj[currentUserId] || 0;
  const isLastMessageFromMe = conversation.lastMessageSender === currentUserId;

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

  return (
    <button
      onClick={() => onSelect(conversation.id)}
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
              alt={getDisplayName(otherUser)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base">
              {getInitials(otherUser)}
            </span>
          )}
        </div>
      </div>

      {/* Conversation Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {getDisplayName(otherUser)}
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
              {conversation.lastMessage || 'No messages yet'}
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
}