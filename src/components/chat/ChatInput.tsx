'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
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
  const [isSending, setIsSending] = useState(false); // Add state for sending status
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set initial message when it changes and input is empty
  useEffect(() => {
    if (initialMessage && initialMessage !== lastInitialMessage && !message) {
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
  }, [initialMessage, lastInitialMessage, message]);

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
    if (message.trim() && !disabled && !isSending) {
      setIsSending(true);
      onSendMessage(message.trim());
      // Don't clear message immediately - wait for parent to finish
      setLastInitialMessage(''); // Reset so new initial messages can be set
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };

  // Reset isSending and clear message when disabled prop changes (when parent finishes sending)
  useEffect(() => {
    if (!disabled && isSending) {
      setIsSending(false);
      setMessage(''); // Clear message after send is complete
      // Reset textarea height after clearing
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [disabled, isSending]);

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
    <div className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 ${
      isEmpty ? 'shadow-lg border-t-2 border-t-red-100 dark:border-t-red-900' : ''
    }`}>
      {isEmpty && (
        <div className={`text-center mb-3 ${messageCount === 0 ? 'animate-pulse' : ''}`}>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {messageCount === 0 ? 'Ready to start chatting?' : 'Keep the conversation going!'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {messageCount === 0 
              ? 'Type your message below to begin the conversation'
              : 'Your message input is right here'
            }
          </p>
        </div>
      )}
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
          title="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`w-full px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors leading-5 ${
              isEmpty && messageCount === 0 ? 'ring-2 ring-red-200 dark:ring-red-800 bg-red-50 dark:bg-red-950/20' : 
              isEmpty && messageCount <= 3 ? 'ring-1 ring-red-100 dark:ring-red-900 bg-red-25 dark:bg-red-950/10' : ''
            }`}
            style={{ 
              minHeight: '42px',
              maxHeight: '120px', 
              overflowY: message.length > 100 ? 'auto' : 'hidden'
            }}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isSending}
          variant="primary"
          size="icon"
          className="flex-shrink-0 rounded-full w-10 h-10 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          title="Send message"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </Button>
      </div>

      {/* Hint Text */}
      <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;

