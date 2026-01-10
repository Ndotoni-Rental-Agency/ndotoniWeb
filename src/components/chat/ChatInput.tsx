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
    <div className={`border-t border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 px-6 py-5 backdrop-blur-sm ${
      isEmpty ? 'bg-gradient-to-br from-red-50/30 via-white to-pink-50/30 dark:from-red-950/20 dark:via-slate-800 dark:to-pink-950/20' : ''
    }`}>
      {isEmpty && (
        <div className={`text-center mb-5 ${messageCount === 0 ? 'animate-bounce-gentle' : ''}`}>
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 rounded-full shadow-lg">
            <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm font-bold text-white">
              {messageCount === 0 ? 'Start Your Conversation' : 'Keep Chatting!'}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {messageCount === 0 
              ? 'Send your first message to begin this conversation'
              : 'Continue the conversation below'
            }
          </p>
        </div>
      )}
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-3 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/30 dark:hover:to-pink-950/30 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed self-end group shadow-sm hover:shadow-md"
          title="Attach file"
        >
          <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`w-full px-5 py-3.5 text-sm bg-slate-50 dark:bg-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:bg-white dark:focus:bg-slate-700 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 leading-6 shadow-sm hover:shadow-md ${
              isEmpty && messageCount === 0 ? 'ring-2 ring-red-300 dark:ring-red-700 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 placeholder-red-400 dark:placeholder-red-400' : 
              isEmpty && messageCount <= 3 ? 'ring-1 ring-red-200 dark:ring-red-800 bg-red-50/50 dark:bg-red-950/10' : ''
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
          className="flex-shrink-0 rounded-2xl w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 self-end shadow-lg hover:shadow-2xl hover:shadow-red-500/50 dark:hover:shadow-red-900/50 transform hover:scale-110 active:scale-95"
          title="Send message"
        >
          <svg className="w-5 h-5 transform rotate-45 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>

      {/* Hint Text */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Press <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-sm">Enter</kbd> to send, <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-sm">Shift + Enter</kbd> for new line
        </p>
        {message.trim() && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
            <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
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
