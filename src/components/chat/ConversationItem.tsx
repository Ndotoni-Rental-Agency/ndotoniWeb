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
    <div className="px-3 py-2">
      <button
        onClick={() => onSelect(conversation.id)}
        className={`w-full p-4 flex items-center space-x-3 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200 rounded-xl text-left group ${
          isSelected 
            ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-md border border-red-200/50 dark:border-red-800/50' 
            : 'hover:shadow-sm'
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold overflow-hidden shadow-lg ${
            isSelected 
              ? 'bg-gradient-to-br from-red-500 to-pink-600' 
              : 'bg-gradient-to-br from-slate-400 to-slate-600 group-hover:from-red-400 group-hover:to-pink-500'
          } transition-all duration-200`}>
            {otherUser?.profileImage ? (
              <img
                src={otherUser.profileImage}
                alt={getDisplayName(otherUser)}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-sm font-bold">
                {getInitials(otherUser)}
              </span>
            )}
          </div>
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-semibold truncate ${
              isSelected 
                ? 'text-slate-900 dark:text-white' 
                : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
            } transition-colors duration-200`}>
              {getDisplayName(otherUser)}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {formatTime(conversation.lastMessageTime)}
              </span>
              {unreadCount > 0 && !isLastMessageFromMe && (
                <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className={`text-xs truncate ${
              unreadCount > 0 && !isLastMessageFromMe
                ? 'font-semibold text-slate-800 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-400'
            } transition-colors duration-200`}>
              {isLastMessageFromMe && (
                <span className="text-slate-400 dark:text-slate-500 mr-1">You: </span>
              )}
              {conversation.lastMessage || 'No messages yet'}
            </p>
            {conversation.propertyTitle && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
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