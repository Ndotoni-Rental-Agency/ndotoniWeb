'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/API';

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
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

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

  const handleLongPress = () => {
    if (onDelete) {
      setShowDeleteMenu(true);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowDeleteMenu(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) {
      setShowDeleteMenu(true);
    }
  };

  return (
    <div className={`flex items-end space-x-2 relative ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar - only show for other person's messages */}
      {!isOwnMessage && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
            {senderImage ? (
              <img src={senderImage} alt={senderName} className="w-full h-full object-cover" />
            ) : (
              <span>{senderName.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-4 py-2.5 rounded-lg relative ${
            isOwnMessage
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
          onContextMenu={handleContextMenu}
          onTouchStart={(e) => {
            const timer = setTimeout(handleLongPress, 500);
            const handleTouchEnd = () => {
              clearTimeout(timer);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          
          {/* Delete Menu */}
          {showDeleteMenu && onDelete && (
            <div className="absolute top-0 right-0 transform translate-x-full -translate-y-2 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1">
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete for me</span>
                </button>
                <button
                  onClick={() => setShowDeleteMenu(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
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

      {/* Backdrop to close delete menu */}
      {showDeleteMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDeleteMenu(false)}
        />
      )}
    </div>
  );
};

export default MessageBubble;
