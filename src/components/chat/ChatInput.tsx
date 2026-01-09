'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  initialMessage?: string;
  isEmpty?: boolean; // New prop to indicate if chat is empty or has few messages
  messageCount?: number; // To differentiate between empty and few messages
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  initialMessage = '',
  isEmpty = false,
  messageCount = 0,
}) => {
  const [message, setMessage] = useState('');
  const [lastInitialMessage, setLastInitialMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set initial message when it changes and input is empty
  useEffect(() => {
    if (initialMessage && initialMessage !== lastInitialMessage) {
      // Only set if current message is empty or matches the last initial message
      if (!message || message === lastInitialMessage) {
        setMessage(initialMessage);
        setLastInitialMessage(initialMessage);
        // Trigger resize after setting initial message
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
          }
        }, 0);
      }
    }
  }, [initialMessage]); // Remove message and lastInitialMessage from dependencies

  // Auto-focus when chat is empty
  useEffect(() => {
    if (textareaRef.current && messageCount === 0) {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 500);
    }
  }, [messageCount]);

  // Auto-resize textarea when component mounts or message changes
  useEffect(() => {
    if (textareaRef.current && message) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      const messageToSend = message.trim();
      
      // Clear message immediately - no waiting!
      setMessage('');
      setLastInitialMessage('');
      
      // Reset textarea height immediately
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      // Send message in background (fire and forget)
      onSendMessage(messageToSend).catch(error => {
        console.error('Error sending message:', error);
        // Could show a toast notification here if needed
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height based on content, with max height of 120px
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 ${
      isEmpty ? 'bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10' : ''
    }`}>
      {isEmpty && (
        <div className={`text-center mb-4 ${messageCount === 0 ? 'animate-pulse' : ''}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              {messageCount === 0 ? 'Ready to start chatting?' : 'Keep the conversation going!'}
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {messageCount === 0 
              ? 'Type your message below to begin the conversation'
              : 'Your message input is right here'
            }
          </p>
        </div>
      )}
      <div className="flex items-end space-x-4">
        {/* Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed self-end group"
          title="Attach file"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className={`w-full px-5 py-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-gray-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 leading-6 shadow-sm ${
              isEmpty && messageCount === 0 ? 'ring-2 ring-red-200 dark:ring-red-800 bg-red-50 dark:bg-red-950/20 placeholder-red-400 dark:placeholder-red-500' : 
              isEmpty && messageCount <= 3 ? 'ring-1 ring-red-100 dark:ring-red-900 bg-red-25 dark:bg-red-950/10' : ''
            }`}
            style={{ 
              minHeight: '48px',
              maxHeight: '120px', 
              overflowY: message.length > 100 ? 'auto' : 'hidden'
            }}
          />
          {/* Character count for long messages */}
          {message.length > 200 && (
            <div className="absolute -top-6 right-2 text-xs text-gray-400 dark:text-gray-500">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          variant="primary"
          size="icon"
          className="flex-shrink-0 rounded-2xl w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 self-end shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          title="Send message"
        >
          <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>

      {/* Hint Text */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Shift + Enter</kbd> for new line
        </p>
        {message.trim() && (
          <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Ready to send</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;

