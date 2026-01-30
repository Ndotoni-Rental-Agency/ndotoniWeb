'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Conversation } from '@/API';

interface SwipeableConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string;
  onSelect: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
}

export function SwipeableConversationItem({
  conversation,
  isSelected,
  currentUserId,
  onSelect,
  onDelete,
}: SwipeableConversationItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Backend provides otherPartyName and otherPartyImage directly
  const displayName = conversation.otherPartyName || 'User';
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentXRef.current = e.touches[0].clientX;
    const deltaX = currentXRef.current - startXRef.current;
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      const offset = Math.max(deltaX, -80); // Limit swipe to 80px
      setSwipeOffset(offset);
      setShowDeleteButton(Math.abs(offset) > 40);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(swipeOffset) > 40) {
      // Snap to delete position
      setSwipeOffset(-80);
      setShowDeleteButton(true);
    } else {
      // Snap back to original position
      setSwipeOffset(0);
      setShowDeleteButton(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      currentXRef.current = e.clientX;
      const deltaX = currentXRef.current - startXRef.current;
      
      // Only allow left swipe (negative deltaX)
      if (deltaX < 0) {
        const offset = Math.max(deltaX, -80); // Limit swipe to 80px
        setSwipeOffset(offset);
        setShowDeleteButton(Math.abs(offset) > 40);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      if (Math.abs(swipeOffset) > 40) {
        // Snap to delete position
        setSwipeOffset(-80);
        setShowDeleteButton(true);
      } else {
        // Snap back to original position
        setSwipeOffset(0);
        setShowDeleteButton(false);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(conversation.id);
  };

  const handleClick = () => {
    if (showDeleteButton) {
      // If delete button is showing, hide it instead of selecting
      setSwipeOffset(0);
      setShowDeleteButton(false);
    } else {
      onSelect(conversation.id);
    }
  };

  // Reset swipe state when conversation changes
  useEffect(() => {
    setSwipeOffset(0);
    setShowDeleteButton(false);
  }, [conversation.id]);

  return (
    <div className="px-3 py-1.5 relative overflow-hidden">
      {/* Delete Button Background */}
      <div 
        className={`absolute right-0 top-1.5 bottom-1.5 w-20 bg-red-500 flex items-center justify-center transition-opacity duration-200 ${
          showDeleteButton ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={handleDelete}
          className="text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          title="Delete conversation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Main Conversation Item */}
      <div
        ref={itemRef}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className="bg-white dark:bg-gray-800 relative z-10"
      >
        <button
          onClick={handleClick}
          className={`w-full p-3 flex items-center space-x-3 rounded-lg text-left transition-colors ${
            isSelected 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold overflow-hidden ${
              isSelected 
                ? 'bg-red-500' 
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
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
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
    </div>
  );
}