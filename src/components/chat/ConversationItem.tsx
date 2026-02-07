import React from 'react';
import { Conversation } from '@/API';
import { toTitleCase } from '@/lib/utils/common';

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
  // Backend provides otherPartyName and otherPartyImage directly
  const displayName = toTitleCase(conversation.otherPartyName) || 'User';
  const profileImage = conversation.otherPartyImage;
  
  // Compute initials from display name
  const getInitials = () => {
    const parts = displayName.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  // unreadCount is now a simple number (current user's count)
  const unreadCount = conversation.unreadCount || 0;

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
    <div className="px-3 py-1.5">
      <button
        onClick={() => onSelect(conversation.id)}
        className={`w-full p-3 flex items-center space-x-3 rounded-lg text-left transition-colors ${
          isSelected 
            ? 'bg-gray-50 dark:bg-emerald-900/20 text-gray-900 dark:text-emerald-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold overflow-hidden ${
            isSelected 
              ? 'bg-gray-900 dark:bg-emerald-900' 
              : 'bg-gray-400 dark:bg-gray-600'
          }`}>
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {getInitials()}
              </span>
            )}
          </div>
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-sm font-medium truncate ${
              isSelected 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {displayName}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(conversation.lastMessageTime)}
              </span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-gray-900 dark:bg-emerald-900 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            <p className={`text-xs truncate ${
              unreadCount > 0
                ? 'font-medium text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {conversation.lastMessage || 'No messages yet'}
            </p>
            {conversation.propertyTitle && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {conversation.propertyTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}