import React, { useRef, useEffect } from 'react';
import { MessageBubble, ChatInput } from '@/components/chat';
import { Conversation, ChatMessage } from '@/API';
import { UserProfile as User } from '@/API';
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
  onSendMessage: (content: string) => Promise<void>;
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
      <div className="hidden md:flex items-center justify-center h-full text-center p-8 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Welcome to Chat</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Select a conversation from the sidebar to start messaging about your property inquiries
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 h-full overflow-hidden ${
      !showConversationList ? 'block' : 'hidden md:flex'
    }`}>
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50">
        <div className="flex items-center space-x-4">
          {/* Back Button - Mobile Only */}
          <button
            onClick={onBackToConversations}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
            title="Back to conversations"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-semibold shadow-lg">
            <span className="text-sm">
              {getInitials(otherUserInfo)}
            </span>
          </div>
          
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {getDisplayName(otherUserInfo)}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex items-center space-x-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{selectedConversation.propertyTitle}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-slate-50/30 to-white dark:from-slate-900/30 dark:to-slate-800"
      >
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-red-500 rounded-full animate-spin"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Loading messages...</span>
            </div>
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
              <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Start the conversation</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Send your first message about <span className="font-semibold text-red-600 dark:text-red-400">{selectedConversation.propertyTitle}</span>
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