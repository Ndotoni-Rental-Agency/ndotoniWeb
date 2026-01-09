import React, { useState } from 'react';
import { ConversationList } from '@/components/chat';
import { Conversation } from '@/API';
import { useConversationSearch } from '@/hooks/useConversationSearch';

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
  showConversationList: boolean;
}

export function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
  showConversationList,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { filteredConversations, isSearching } = useConversationSearch({
    conversations,
    searchQuery,
    currentUserId
  });

  return (
    <div className={`w-full md:w-80 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col h-full ${
      showConversationList ? 'block' : 'hidden md:flex'
    }`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 shadow-sm"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-red-500 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {filteredConversations.length} of {conversations.length} conversations
          </p>
        )}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-hidden">
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={onSelectConversation}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}