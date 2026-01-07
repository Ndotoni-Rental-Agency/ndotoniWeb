import React, { useRef, useEffect } from 'react';
import { MessageBubble, ChatInput } from '@/components/chat';
import { Conversation, ChatMessage } from '@/types/chat';
import { User } from '@/types';
import { useUserInfo } from '@/hooks/useUserInfo';

interface ChatAreaProps {
  selectedConversation: Conversation | null;
  messages: ChatMessage[];
  loadingMessages: boolean;
  sendingMessage: boolean;
  currentUserId: string;
  currentUser: User | null;
  showConversationList: boolean;
  onBackToConversations: () => void;
  onSendMessage: (content: string) => void;
  getSuggestedMessage: () => string;
}

export function ChatArea({
  selectedConversation,
  messages,
  loadingMessages,
  sendingMessage,
  currentUserId,
  currentUser,
  showConversationList,
  onBackToConversations,
  onSendMessage,
  getSuggestedMessage,
}: ChatAreaProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get the other user's ID (the person we're chatting with)
  const otherUserId = selectedConversation 
    ? (selectedConversation.tenantId === currentUserId 
        ? selectedConversation.landlordId 
        : selectedConversation.tenantId)
    : undefined;

  // Fetch the other user's information
  const { userInfo: otherUserInfo, getDisplayName, getInitials } = useUserInfo(otherUserId);

  // Helper functions for current user
  const getCurrentUserDisplayName = () => {
    if (!currentUser) return 'You';
    return `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email;
  };

  const getCurrentUserInitials = () => {
    if (!currentUser) return 'Y';
    const firstInitial = currentUser.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = currentUser.lastName?.charAt(0)?.toUpperCase() || '';
    return (firstInitial + lastInitial) || currentUser.email?.charAt(0)?.toUpperCase() || 'Y';
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="hidden md:flex items-center justify-center h-full text-center p-8">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select a conversation</h3>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 h-full transition-transform duration-300 ease-out overflow-hidden ${
      !showConversationList ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
    }`}>
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Back Button - Mobile Only */}
            <button
              onClick={onBackToConversations}
              className="md:hidden p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              title="Back to conversations"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-medium flex-shrink-0">
              <span className="text-sm sm:text-base">
                {getInitials(otherUserInfo)}
              </span>
            </div>
            
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                {getDisplayName(otherUserInfo)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {selectedConversation.propertyTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-red-500"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            const senderName = isOwnMessage 
              ? getCurrentUserDisplayName()
              : (message.senderId === otherUserId ? getDisplayName(otherUserInfo) : 'Unknown User');
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                senderName={senderName}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418 4.03-8 9-8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start the conversation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send your first message about {selectedConversation.propertyTitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        placeholder="Type your message..."
        initialMessage={getSuggestedMessage()}
        disabled={sendingMessage}
        isEmpty={messages.length === 0}
        messageCount={messages.length}
      />
    </div>
  );
}