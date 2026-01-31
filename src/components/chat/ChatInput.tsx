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
  sendingMessage?: boolean; // Add this prop to show sending state
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  initialMessage = '',
  messageCount = 0,
  sendingMessage = false,
}) => {
  const [message, setMessage] = useState('');
  const [lastInitialMessage, setLastInitialMessage] = useState('');
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set initial message when it changes and input is empty
  useEffect(() => {
    if (messageCount > 0) {
      // If conversation already has messages, don't show suggested message
      setMessage('');
      setLastInitialMessage('');
      setHasSentMessage(true);
    } else if (initialMessage && initialMessage !== lastInitialMessage && !hasSentMessage) {
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
    } else if (!initialMessage) {
      // If no initial message, clear the input and reset sent state for new conversations
      setMessage('');
      setLastInitialMessage('');
      setHasSentMessage(false);
    }
  }, [initialMessage, hasSentMessage, messageCount]);

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

  const handleSend = async () => {
    if (message.trim() && !disabled && !isSending) {
      const messageToSend = message.trim();
      
      try {
        setIsSending(true);
        setHasSentMessage(true); // Prevent re-showing initial message
        
        // Send message and wait for response
        await onSendMessage(messageToSend);
        
        // Only clear message after successful send
        setMessage('');
        setLastInitialMessage('');
        
        // Reset textarea height after successful send
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
        // Don't clear the message on error - let user try again
        setHasSentMessage(false); // Allow initial message to show again if needed
        
        // Show error feedback with more specific information
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        if (errorMessage.includes('WAFForbidden') || errorMessage.includes('403')) {
          alert('Message blocked by security filters. Please avoid external links and try again.');
        } else if (errorMessage.includes('External URLs are not allowed')) {
          alert('External URLs are not allowed in messages. Only property links are permitted.');
        } else if (errorMessage.includes('Message contains prohibited content')) {
          alert('Message contains prohibited content. Please remove any scripts or suspicious content.');
        } else if (errorMessage.includes('Message content too long')) {
          alert('Message is too long. Please keep messages under 2000 characters.');
        } else {
          alert(`Failed to send message: ${errorMessage}. Please try again.`);
        }
      } finally {
        setIsSending(false);
      }
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
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 shadow-lg">
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
          disabled={!message.trim() || disabled || isSending || sendingMessage}
          variant="primary"
          size="sm"
          className="flex-shrink-0"
          title="Send message"
        >
          {isSending || sendingMessage ? (
            <>
              <svg className="w-4 h-4 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
