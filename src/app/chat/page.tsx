'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Conversation as APIConversation } from '@/API';

// Frontend-specific conversation type that extends the API type
interface Conversation extends APIConversation {
  isTemporary?: boolean;
  propertyId?: string; // Needed for temporary conversations
  landlordInfo?: {
    firstName: string;
    lastName: string;
  };
}
import AuthModal from '@/components/auth/AuthModal';

// Custom hooks
import { useChatLayout } from '@/hooks/useChatLayout';
import { useChatDeletion } from '@/hooks/useChatDeletion';

// Components
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { LoadingSpinner, UnauthenticatedState } from '@/components/chat/LoadingStates';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { t } = useLanguage();
  const {
    conversations,
    messages,
    selectedConversation,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    loadConversations,
    loadMessages,
    sendMessage,
    initializeChat,
    markConversationAsRead,
    subscribeToConversation,
    refreshUnreadCount,
    clearMessages,
    selectConversation,
    selectTemporaryConversation
  } = useChat();

  // State management
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
  const [suggestedMessageShown, setSuggestedMessageShown] = useState(false);

  // Custom hooks
  const {
    showConversationList,
    handleSelectConversation: handleLayoutConversationSelect,
    handleBackToConversations,
  } = useChatLayout();

  const {
    deleteConversation,
    deleteMessage,
    isDeletingConversation,
    isDeletingMessage,
  } = useChatDeletion();

  // For chat page, we need to generate the suggested message based on URL params
  const getSuggestedMessage = () => {
    const propertyId = searchParams.get('propertyId');
    const propertyTitle = searchParams.get('propertyTitle');
    const newPropertyInquiry = searchParams.get('newPropertyInquiry');
    
    // Show suggested message for new property inquiries with no messages yet and not already shown
    if (newPropertyInquiry === 'true' && propertyId && propertyTitle && messages.length === 0 && !suggestedMessageShown) {
      if (typeof window !== 'undefined') {
        const propertyUrl = `${window.location.origin}/property/${propertyId}`;
        // Use a more readable format with line breaks
        const suggestedMessage = `Hi! I'm interested in your property: ${propertyTitle}\n\nProperty link: ${propertyUrl}`;
        return suggestedMessage;
      }
    }
    
    return '';
  };

  const clearSuggestedMessage = () => {
    setSuggestedMessageShown(true);
  };

  // These values are not relevant for chat page
  const isLandlordAccessingOwnProperty = false;
  const propertyTitle = '';

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.location.reload();
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (conversationId: string) => {
    const success = await deleteConversation(conversationId);
    if (success) {
      // If the deleted conversation was selected, clear selection
      if (selectedConversation?.id === conversationId) {
        selectConversation(null);
        clearMessages();
        handleBackToConversations();
      }
      
      // Refresh conversations to get updated list from server
      await loadConversations();
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    const success = await deleteMessage(messageId);
    if (success) {
      // Refresh messages to get updated list from server
      if (selectedConversation) {
        await loadMessages(selectedConversation.id);
      }
    }
  };

  // Handle temporary conversation selection (for new conversations)
  const handleSelectTemporaryConversation = (tempConversation: Conversation) => {
    console.log('Selecting temporary conversation:', tempConversation);

    // Handle layout changes (mobile responsiveness)
    handleLayoutConversationSelect();

    // Set the temporary conversation
    selectTemporaryConversation(tempConversation);
    clearMessages();

    // No need to load messages since it's a new conversation
    // No need to set up subscriptions yet since conversation doesn't exist in backend
  };

  // Handle conversation selection
  const handleSelectConversation = async (conversationId: string, landlordName?: string) => {
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation || !user?.email) {
      return;
    }

    // Handle layout changes (mobile responsiveness)
    handleLayoutConversationSelect();

    // Set selected conversation
    selectConversation(conversationId);
    clearMessages();

    // Load messages for this conversation
    await loadMessages(conversationId);

    // Subscribe to real-time messages for this conversation
    subscribeToConversation(conversationId);

    // Mark conversation as read if there are unread messages
    if (conversation.unreadCount > 0) {
      try {
        await markConversationAsRead(conversationId, user.email);
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  // Handle back to conversations (mobile)
  const handleBackToConversationsWithCleanup = () => {
    handleBackToConversations();
    selectConversation(null);
    clearMessages();
    setSuggestedMessageShown(false); // Reset suggested message state
  };

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.email) return;

    try {
      // Check if this is a temporary conversation (needs to be created in backend)
      const extendedConversation = selectedConversation as Conversation;
      if (extendedConversation.isTemporary) {
        if (!extendedConversation.propertyId) {
          throw new Error('Property ID is missing for temporary conversation');
        }
        
        // Initialize the chat using the secure backend endpoint
        const chatData = await initializeChat(extendedConversation.propertyId);

        // Update the selected conversation with the real conversation ID
        const realConversation: Conversation = {
          __typename: 'Conversation',
          id: chatData.conversationId,
          propertyId: extendedConversation.propertyId,
          propertyTitle: chatData.propertyTitle,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          otherPartyName: chatData.landlordName,
          otherPartyImage: null,
        };

        selectTemporaryConversation({
          ...realConversation,
          isTemporary: false,
          landlordInfo: {
            firstName: chatData.landlordName.split(' ')[0] || '',
            lastName: chatData.landlordName.split(' ').slice(1).join(' ') || '',
          },
        });

        // Now send the initial message (optimistic updates will handle UI)
        await sendMessage(chatData.conversationId, content);

        // Clear the suggested message after sending the first message
        clearSuggestedMessage();

        return;

      } else {
        // Normal message sending for existing conversations (optimistic updates will handle UI)
        await sendMessage(selectedConversation.id, content);

        // Clear the suggested message after sending any message
        clearSuggestedMessage();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw so ChatInput can handle the error
    }
  };

  // Process URL parameters to initialize chat
  useEffect(() => {
    if (!urlParamsProcessed && isAuthenticated && !loadingConversations && conversations.length >= 0) {
      const conversationId = searchParams.get('conversationId');
      const propertyId = searchParams.get('propertyId');
      const propertyTitle = searchParams.get('propertyTitle');
      const landlordName = searchParams.get('landlordName');
      const newPropertyInquiry = searchParams.get('newPropertyInquiry');

      if (conversationId) {
        // Direct link to existing conversation
        // If this is NOT a new property inquiry, clear any suggested message
        if (newPropertyInquiry !== 'true') {
          clearSuggestedMessage();
        }
        
        handleSelectConversation(conversationId, landlordName || undefined);
      } else if (propertyId && propertyTitle && landlordName) {
        // Link to start new conversation with property
        const tempConversation: Conversation = {
          __typename: 'Conversation',
          id: `temp-${propertyId}`,
          propertyId: propertyId,
          propertyTitle: propertyTitle,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          otherPartyName: landlordName,
          otherPartyImage: null,
          isTemporary: true,
          landlordInfo: {
            firstName: landlordName.split(' ')[0] || '',
            lastName: landlordName.split(' ').slice(1).join(' ') || '',
          },
        };

        handleSelectTemporaryConversation(tempConversation);
      }

      setUrlParamsProcessed(true);
    }
  }, [searchParams, isAuthenticated, loadingConversations, conversations.length, urlParamsProcessed]);

  // Check authentication status
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, authLoading]);

  // Cleanup on unmount
  // Loading states
  if (authLoading) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <UnauthenticatedState onSignIn={() => setShowAuthModal(true)} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signin"
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (loadingConversations) {
    return <LoadingSpinner message={t('messages.loadingConversations')} />;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col" style={{ height: '100dvh' }}>
      <ChatHeader conversationCount={conversations.length} />

      {/* Special message for landlords accessing their own property */}
      {isLandlordAccessingOwnProperty && propertyTitle && (
        <div className="mx-4 mt-20 mb-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Property Owner View
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                You're viewing your property "{propertyTitle}". Tenant inquiries will appear here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden pt-16 min-h-0">
        <div className="h-full max-w-7xl mx-auto bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 overflow-hidden flex">
          <ConversationSidebar
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            currentUserId={''}
            showConversationList={showConversationList}
          />

          <ChatArea
            messages={messages}
            loadingMessages={loadingMessages}
            sendingMessage={sendingMessage}
            currentUserId={''}
            currentUser={user}
            showConversationList={showConversationList}
            onBackToConversations={handleBackToConversationsWithCleanup}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage}
            getSuggestedMessage={getSuggestedMessage}
            landlordName={searchParams.get('landlordName') || undefined}
          />
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<LoadingSpinner message={t('messages.loadingChat')} />}>
      <ChatPageContent />
    </Suspense>
  );
}
