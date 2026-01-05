'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList, MessageBubble, ChatInput } from '@/components/chat';
import { ConversationWithParticipant, ChatMessage } from '@/types/chat';
import { getConversationsForUser, getMessagesForConversation, getParticipant } from '@/lib/mockChatData';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithParticipant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For demo purposes, simulate different user types
  // In production, this would come from the authenticated user
  const [currentUserId, setCurrentUserId] = useState<string>('landlord-1');
  const [userType, setUserType] = useState<'TENANT' | 'LANDLORD'>('LANDLORD');

  useEffect(() => {
    // Simulate loading conversations
    const loadConversations = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userConversations = getConversationsForUser(currentUserId);
      setConversations(userConversations);
      
      // Auto-select first conversation if available
      if (userConversations.length > 0) {
        handleSelectConversation(userConversations[0].id);
      }
      
      setLoading(false);
    };

    loadConversations();
  }, [currentUserId]);

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      const conversationMessages = getMessagesForConversation(conversationId);
      setMessages(conversationMessages);
      
      // Mark messages as read
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      
      // Update unread count
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      receiverId: selectedConversation.otherParticipant.userId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : conv
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Demo: Toggle between tenant and landlord view
  const toggleUserType = () => {
    const newUserType = userType === 'TENANT' ? 'LANDLORD' : 'TENANT';
    const newUserId = newUserType === 'LANDLORD' ? 'landlord-1' : 'tenant-1';
    setUserType(newUserType);
    setCurrentUserId(newUserId);
    setSelectedConversation(null);
    setMessages([]);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Demo Toggle Button */}
          <button
            onClick={toggleUserType}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            Switch to {userType === 'TENANT' ? 'Landlord' : 'Tenant'} View
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex">
          {/* Conversations Sidebar */}
          <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                />
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-hidden">
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
                currentUserId={currentUserId}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 h-full">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-medium">
                      {selectedConversation.otherParticipant.profileImage ? (
                        <img
                          src={selectedConversation.otherParticipant.profileImage}
                          alt={`${selectedConversation.otherParticipant.firstName} ${selectedConversation.otherParticipant.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>
                          {selectedConversation.otherParticipant.firstName.charAt(0)}
                          {selectedConversation.otherParticipant.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.otherParticipant.firstName} {selectedConversation.otherParticipant.lastName}
                      </h2>
                      <div className="flex items-center space-x-2">
                        {selectedConversation.otherParticipant.isOnline ? (
                          <>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Offline</span>
                        )}
                        {selectedConversation.propertyTitle && (
                          <>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedConversation.propertyTitle}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Call"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="More options"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.length > 0 ? (
                    <>
                      {messages.map((message) => {
                        const sender = getParticipant(message.senderId);
                        const isOwnMessage = message.senderId === currentUserId;
                        return (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={isOwnMessage}
                            senderName={sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown'}
                            senderImage={sender?.profileImage}
                          />
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder={`Message ${selectedConversation.otherParticipant.firstName}...`}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-6">
                <div>
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

