'use client';

import React from 'react';
import { ChatMessage } from '@/API';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  senderName: string;
  senderImage?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  senderName,
  senderImage,
}) => {
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

  return (
    <div className={`flex items-end space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''} group animate-fade-in`}>
      {/* Avatar - only show for other person's messages */}
      {!isOwnMessage && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 dark:from-red-600 dark:to-pink-700 flex items-center justify-center text-white text-sm font-bold overflow-hidden shadow-lg ring-2 ring-white dark:ring-slate-800 group-hover:scale-110 transition-transform duration-300">
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
        <div className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl ${
          isOwnMessage
            ? 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white rounded-br-md transform group-hover:scale-[1.02]'
            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-md border border-slate-200/80 dark:border-slate-600/80 transform group-hover:scale-[1.02] hover:border-red-300 dark:hover:border-red-700'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        </div>

        {/* Timestamp and Read Status */}
        <div className={`flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">
            {formatTime(message.timestamp)}
          </span>
          {isOwnMessage && (
            <div className="flex items-center">
              {message.isRead ? (
                <div className="flex items-center space-x-0.5 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  <svg className="w-3.5 h-3.5 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <svg className="w-3.5 h-3.5 text-red-500 dark:text-red-400 -ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold ml-1">Read</span>
                </div>
              ) : (
                <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold ml-1">Sent</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
