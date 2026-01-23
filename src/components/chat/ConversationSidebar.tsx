import React, { useState } from 'react';
import { ConversationList } from '@/components/chat';
import { Conversation as APIConversation } from '@/API';
import { useConversationSearch } from '@/hooks/useConversationSearch';
import { useChat } from '@/contexts/ChatContext';

// Extended conversation type with temporary conversation support
interface Conversation extends APIConversation {
  isTemporary?: boolean;
  landlordInfo?: {
    firstName: string;
    lastName: string;
  };
}

interface ConversationSidebarProps {
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
  showConversationList: boolean;
}

export function ConversationSidebar({
  onSelectConversation,
  currentUserId,
  showConversationList,
}: ConversationSidebarProps) {
  const { conversations, selectedConversation } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const { filteredConversations, isSearching } = useConversationSearch({
    conversations,
    searchQuery,
    currentUserId
  });

  return (
    <div className={`w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full ${
      showConversationList ? 'block' : 'hidden md:flex'
    }`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {filteredConversations.length} of {conversations.length} conversations
          </p>
        )}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-hidden">
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={onSelectConversation}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}