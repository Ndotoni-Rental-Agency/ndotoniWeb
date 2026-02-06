'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/API';
import { renderTextWithLinks } from '@/lib/utils/linkRenderer';
import { toTitleCase } from '@/utils/common';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  senderName: string;
  senderImage?: string;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  senderName,
  senderImage,
  onDelete,
}) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const displayName = toTitleCase(senderName);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const handleTouchStart = () => {
    if (!onDelete) return;
    
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      setShowDeleteOptions(true);
      // Add haptic feedback on supported devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseDown = () => {
    if (!onDelete) return;
    
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      setShowDeleteOptions(true);
    }, 500);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) {
      setShowDeleteOptions(true);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowDeleteOptions(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowDeleteOptions(false);
  };

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowDeleteOptions(false);
      }
    };

    if (showDeleteOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDeleteOptions]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div 
      ref={messageRef}
      className={`flex items-end space-x-2 relative ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar - only show for other person's messages */}
      {!isOwnMessage && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
            {senderImage ? (
              <img src={senderImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className="relative">
          <div 
            className={`px-4 py-2.5 rounded-2xl relative select-none transition-all duration-150 ${
              isPressed ? 'scale-95' : 'scale-100'
            } ${
              isOwnMessage
                ? 'bg-gray-900 dark:bg-emerald-900 text-white rounded-br-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          >
            <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {renderTextWithLinks(message.content)}
            </div>
          </div>

          {/* iMessage-style Action Menu */}
          {showDeleteOptions && (
            <div className={`absolute top-0 z-50 ${
              isOwnMessage ? 'right-0 transform translate-x-full' : 'left-0 transform -translate-x-full'
            }`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 overflow-hidden min-w-[160px]">
                <div className="py-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </button>
                  
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete for me</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Arrow pointing to message */}
              <div className={`absolute top-4 ${
                isOwnMessage ? '-left-2' : '-right-2'
              }`}>
                <div className={`w-0 h-0 ${
                  isOwnMessage 
                    ? 'border-l-8 border-l-white dark:border-l-gray-800 border-y-8 border-y-transparent' 
                    : 'border-r-8 border-r-white dark:border-r-gray-800 border-y-8 border-y-transparent'
                }`}></div>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp and Read Status */}
        <div className={`flex items-center space-x-2 mt-1 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          {isOwnMessage && message.isRead && (
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {/* Backdrop to close options */}
      {showDeleteOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDeleteOptions(false)}
        />
      )}
    </div>
  );
};

export default MessageBubble;
