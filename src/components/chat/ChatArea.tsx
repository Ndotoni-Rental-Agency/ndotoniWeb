import React, { useRef, useEffect } from 'react';
import { MessageBubble, ChatInput } from '@/components/chat';
import { Conversation as APIConversation, ChatMessage } from '@/API';
import { UserProfile as User } from '@/API';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useChat } from '@/contexts/ChatContext';

// Extended conversation type with temporary conversation support
interface Conversation extends APIConversation {
  isTemporary?: boolean;
  landlordInfo?: {
    firstName: string;
    lastName: string;
  };
}

interface ChatAreaProps {
  messages: ChatMessage[];
  loadingMessages: boolean;
  sendingMessage: boolean;
  currentUserId: string;
  currentUser: User | null;
  showConversationList: boolean;
  onBackToConversations: () => void;
  onSendMessage: (content: string) => Promise<void>;
  getSuggestedMessage: () => string;
  landlordName?: string; // From URL params for proper display
}

export function ChatArea({
  messages,
  loadingMessages,
  sendingMessage,
  currentUser,
  showConversationList,
  onBackToConversations,
  onSendMessage,
  getSuggestedMessage,
  landlordName,
}: ChatAreaProps) {
  const { selectedConversation } = useChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get display name for the other party (computed by backend)
  const getOtherPartyDisplayName = () => {
    // If landlordName is provided from URL params, use it
    if (landlordName) {
      return landlordName;
    }

    const extendedConversation = selectedConversation as Conversation;
    // For temporary conversations, use landlord info from URL params if available
    if (extendedConversation?.isTemporary && extendedConversation?.landlordInfo) {
      const { firstName, lastName } = extendedConversation.landlordInfo;
      return `${firstName} ${lastName}`.trim();
    }
    // Otherwise use the backend-computed otherPartyName
    return selectedConversation?.otherPartyName || 'User';
  };

  const getOtherPartyInitials = () => {
    // If landlordName is provided from URL params, use it
    if (landlordName) {
      const parts = landlordName.split(' ');
      if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      }
      return landlordName.charAt(0).toUpperCase();
    }

    const extendedConversation = selectedConversation as Conversation;
    // For temporary conversations, use landlord info from URL params if available
    if (extendedConversation?.isTemporary && extendedConversation?.landlordInfo) {
      const { firstName, lastName } = extendedConversation.landlordInfo;
      const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
      const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
      return (firstInitial + lastInitial) || 'L';
    }
    // Otherwise compute from otherPartyName
    const name = selectedConversation?.otherPartyName || 'User';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

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
      <div className="hidden md:flex items-center justify-center h-full w-full text-center bg-white dark:bg-gray-800">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Chat</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 h-full overflow-hidden ${
      !showConversationList ? 'block' : 'hidden md:flex'
    }`}>
      {/* Chat Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          {/* Back Button - Mobile Only */}
          <button
            onClick={onBackToConversations}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Back to conversations"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {getOtherPartyDisplayName()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center space-x-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{selectedConversation.propertyTitle}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area - Constrained to leave room for input */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white dark:bg-gray-800"
        style={{ 
          minHeight: 0, // Allow flex item to shrink
          paddingBottom: '1rem' // Add some padding at bottom
        }}
      >
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Loading messages...</span>
            </div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => {
            // Use the backend-computed isMine flag
            const isOwnMessage = message.isMine;
            const senderName = message.senderName;
            
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
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start the conversation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send your first message about <span className="font-medium text-red-600 dark:text-red-400">{selectedConversation.propertyTitle}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Always visible at bottom */}
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