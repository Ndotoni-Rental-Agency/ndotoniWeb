'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useSearchParams } from 'next/navigation';
import { ConversationList, MessageBubble, ChatInput } from '@/components/chat';
import { Conversation, ChatMessage } from '@/types/chat';
import { getUserConversations, getConversationMessages, getConversation, createConversation, getUser } from '@/lib/mockChatData';

export default function ChatPage() {
  const { user } = useAuth();
  const { refreshUnreadCount } = useChat();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showConversationList, setShowConversationList] = useState(true);

  // For demo purposes, simulate different user types
  // In production, this would come from the authenticated user
  const [currentUserId, setCurrentUserId] = useState<string>('landlord-1');

  // Handle property contact from URL params
  useEffect(() => {
    const propertyId = searchParams.get('propertyId');
    const landlordId = searchParams.get('landlordId');
    const propertyTitle = searchParams.get('propertyTitle');

    if (propertyId && propertyTitle) {
      // This means user came from property card or "Contact Agent" button
      console.log('Contact agent for:', { propertyId, landlordId, propertyTitle });
      
      // For demo, assume current user is a tenant wanting to contact landlord
      const tenantId = 'tenant-1'; // In real app, get from authenticated user
      
      // If landlordId is unknown, we'll use a default landlord for demo purposes
      // In a real app, you would fetch the property details to get the actual landlordId
      const actualLandlordId = (landlordId === 'unknown' || !landlordId) ? 'landlord-1' : landlordId;
      
      // Create or find the conversation
      const conversation = createConversation(tenantId, actualLandlordId, propertyId, propertyTitle);
      
      // Update conversations list and select this conversation
      setTimeout(() => {
        const userConversations = getUserConversations(tenantId);
        setConversations(userConversations);
        setCurrentUserId(tenantId);
        handleSelectConversation(conversation.id);
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    // Simulate loading conversations
    const loadConversations = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userConversations = getUserConversations(currentUserId);
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
      const conversationMessages = getConversationMessages(conversationId);
      setMessages(conversationMessages);
      
      // Mark messages as read
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      
      // Update unread count for current user
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId 
            ? { ...conv, unreadCount: { ...conv.unreadCount, [currentUserId]: 0 } }
            : conv
        )
      );

      // Refresh global unread count
      refreshUnreadCount();

      if (window.innerWidth < 768) {
        setShowConversationList(false);
      }
    }
  };

  const handleBackToConversations = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
    setMessages([]);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { 
              ...conv, 
              lastMessage: content,
              lastMessageSender: currentUserId,
              lastMessageTime: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : conv
      ).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
    );
  };

  // Get suggested message for property inquiries
  const getSuggestedMessage = () => {
    const propertyTitle = searchParams.get('propertyTitle');
    if (propertyTitle && messages.length === 0) {
      return `Hi! I'm interested in your property "${propertyTitle}". Could you please provide more information about viewing arrangements?`;
    }
    return '';
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !showConversationList && !selectedConversation) {
        setShowConversationList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showConversationList, selectedConversation]);



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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Clean Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Messages
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="max-w-7xl mx-auto h-full flex relative">
          {/* Conversations Sidebar */}
          <div className={`absolute md:relative inset-0 z-10 md:z-auto w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full transition-transform duration-300 ease-out ${
            showConversationList ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            {/* Search Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
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
          <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 h-full transition-transform duration-300 ease-out overflow-hidden ${
            !showConversationList ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          }`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Back Button - Mobile Only */}
                      <button
                        onClick={handleBackToConversations}
                        className="md:hidden p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        title="Back to conversations"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {(() => {
                        const otherUserId = selectedConversation.tenantId === currentUserId 
                          ? selectedConversation.landlordId 
                          : selectedConversation.tenantId;
                        const otherUser = getUser(otherUserId);
                        return (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                            {otherUser?.profileImage ? (
                              <img
                                src={otherUser.profileImage}
                                alt={`${otherUser.firstName} ${otherUser.lastName}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm sm:text-base">
                                {otherUser ? `${otherUser.firstName.charAt(0)}${otherUser.lastName.charAt(0)}` : '?'}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                      
                      <div className="min-w-0 flex-1">
                        {(() => {
                          const otherUserId = selectedConversation.tenantId === currentUserId 
                            ? selectedConversation.landlordId 
                            : selectedConversation.tenantId;
                          const otherUser = getUser(otherUserId);
                          return (
                            <>
                              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User'}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {selectedConversation.propertyTitle}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
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
                </div>

                {/* Messages Area */}
                <div 
                  ref={messagesContainerRef} 
                  className={`overflow-y-auto px-4 sm:px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-900 ${
                    messages.length === 0 ? 'flex-none' : messages.length <= 3 ? 'flex-none' : 'flex-1'
                  }`}
                  style={{
                    ...(messages.length === 0 ? { minHeight: '200px' } : messages.length <= 3 ? { minHeight: '300px' } : {}),
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain'
                  }}
                >
                  {messages.length > 0 ? (
                    <>
                      {messages.map((message) => {
                        const isOwnMessage = message.senderId === currentUserId;
                        const sender = getUser(message.senderId);
                        const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown';
                        const senderImage = sender?.profileImage;
                        
                        return (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={isOwnMessage}
                            senderName={senderName}
                            senderImage={senderImage}
                          />
                        );
                      })}
                    </>
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

                {/* Spacer for empty state to push input up */}
                {messages.length <= 3 && (
                  <div className="flex-1 min-h-0"></div>
                )}

                {/* Chat Input */}
                {(() => {
                  const otherUserId = selectedConversation.tenantId === currentUserId 
                    ? selectedConversation.landlordId 
                    : selectedConversation.tenantId;
                  const otherUser = getUser(otherUserId);
                  return (
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      placeholder={`Message ${otherUser?.firstName || 'User'}...`}
                      initialMessage={getSuggestedMessage()}
                      isEmpty={messages.length <= 3}
                      messageCount={messages.length}
                    />
                  );
                })()}
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

