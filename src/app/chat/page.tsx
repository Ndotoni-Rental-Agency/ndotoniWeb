'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Conversation as APIConversation } from '@/API';

// Frontend-specific conversation type that extends the API type
interface Conversation extends APIConversation {
  isTemporary?: boolean;
}
import { resolveLandlordFromProperty } from '@/lib/utils/chat';
import AuthModal from '@/components/auth/AuthModal';

// Custom hooks
import { usePropertyContact } from '@/hooks/usePropertyContact';
import { useChatLayout } from '@/hooks/useChatLayout';

// Components
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { LoadingSpinner, UnauthenticatedState } from '@/components/chat/LoadingStates';

function ChatPageContent() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    loadConversations,
    loadMessages,
    sendMessage,
    createNewConversation,
    markConversationAsRead,
    subscribeToConversation,
    refreshUnreadCount,
    clearMessages
  } = useChat();
  
  // State management
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Custom hooks
  const {
    showConversationList,
    handleSelectConversation: handleLayoutConversationSelect,
    handleBackToConversations,
  } = useChatLayout();

  const {
    getSuggestedMessage,
    clearSuggestedMessage,
    isLandlordAccessingOwnProperty,
    propertyTitle,
  } = usePropertyContact(
    user?.userId,
    (conversationId: string, tempConversation?: any) => {
      if (tempConversation) {
        // Handle temporary conversation
        handleSelectTemporaryConversation(tempConversation);
      } else {
        // Handle existing conversation
        handleSelectConversation(conversationId);
      }
    },
    () => loadConversations()
  );

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.location.reload();
  };

  // Handle temporary conversation selection (for new conversations)
  const handleSelectTemporaryConversation = (tempConversation: any) => {
    console.log('Selecting temporary conversation:', tempConversation);
    
    // Handle layout changes (mobile responsiveness)
    handleLayoutConversationSelect();

    // Set the temporary conversation
    setSelectedConversation(tempConversation);
    clearMessages();
    
    // No need to load messages since it's a new conversation
    // No need to set up subscriptions yet since conversation doesn't exist in backend
  };

  // Handle conversation selection
  const handleSelectConversation = async (conversationId: string) => {
    console.log('handleSelectConversation called with:', conversationId);
    console.log('Available conversations:', conversations.map(c => c.id));
    
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation || !user?.userId) {
      console.log('Conversation not found:', conversationId);
      return;
    }

    console.log('Found conversation:', conversation);

    // Handle layout changes (mobile responsiveness)
    handleLayoutConversationSelect();

    // Set selected conversation immediately for UI responsiveness
    setSelectedConversation(conversation);
    clearMessages();
    
    // Load messages for this conversation
    await loadMessages(conversationId);
    
    // Set up real-time subscription for new messages AFTER loading messages
    subscribeToConversation(conversationId, user.userId);
    
    // Parse unreadCount from JSON string
    const unreadCount = JSON.parse(conversation.unreadCount || '{}');
    
    // Mark conversation as read if there are unread messages
    if (unreadCount[user.userId] > 0) {
      try {
        await markConversationAsRead(conversationId, user.userId);
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  // Handle back to conversations (mobile)
  const handleBackToConversationsWithCleanup = () => {
    handleBackToConversations();
    setSelectedConversation(null);
    clearMessages();
    clearSuggestedMessage();
  };

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.userId) return;

    // Check if this is a temporary conversation (needs to be created in backend)
    if (selectedConversation.isTemporary) {
      console.log('Creating conversation in backend for first message...');
      
      try {
        // Resolve landlordId if needed
        let landlordId = selectedConversation.landlordId;
        if (landlordId === 'unknown') {
          const landlordInfo = await resolveLandlordFromProperty(selectedConversation.propertyId);
          if (landlordInfo) {
            landlordId = landlordInfo.userId;
          } else {
            throw new Error('Could not resolve landlord for this property.');
          }
        }

        // Create the conversation in the backend (this will show the message immediately)
        const conversation = await createNewConversation({
          tenantId: user.userId,
          landlordId: landlordId,
          propertyId: selectedConversation.propertyId,
          propertyTitle: selectedConversation.propertyTitle,
          initialMessage: content,
        });

        console.log('Conversation created with initial message:', conversation);

        // Update the selected conversation to remove the temporary flag
        setSelectedConversation({
          ...conversation,
          isTemporary: false,
        });

        // Set up real-time subscription for new messages
        subscribeToConversation(conversation.id, user.userId);

        // Clear suggested message after sending
        clearSuggestedMessage();

        return;

      } catch (error) {
        console.error('Error creating conversation:', error);
        throw error; // Re-throw so ChatInput can handle the error
      }
    }

    // Normal message sending for existing conversations (shows message immediately)
    await sendMessage(selectedConversation.id, user.userId, content);
    
    // Clear suggested message after sending
    clearSuggestedMessage();
  };

  // Check authentication status
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, authLoading]);

  // Cleanup on unmount
  // Loading states
  if (authLoading) {
    return <LoadingSpinner message="Loading..." />;
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
    return <LoadingSpinner message="Loading conversations..." />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col overflow-hidden">
      <ChatHeader conversationCount={conversations.length} />

      {/* Special message for landlords accessing their own property */}
      {isLandlordAccessingOwnProperty && propertyTitle && (
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200/50 dark:border-blue-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  Property Owner View
                </h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  You're viewing your property "{propertyTitle}". Tenant inquiries will appear in your conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="max-w-7xl mx-auto h-full flex relative shadow-xl bg-white dark:bg-gray-800 rounded-t-2xl mt-2 mx-2">
          <ConversationSidebar
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            currentUserId={user?.userId || ''}
            showConversationList={showConversationList}
          />

          <ChatArea
            selectedConversation={selectedConversation}
            messages={messages}
            loadingMessages={loadingMessages}
            sendingMessage={sendingMessage}
            currentUserId={user?.userId || ''}
            currentUser={user}
            showConversationList={showConversationList}
            onBackToConversations={handleBackToConversationsWithCleanup}
            onSendMessage={handleSendMessage}
            getSuggestedMessage={() => getSuggestedMessage(messages.length)}
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
  return (
    <Suspense fallback={<LoadingSpinner message="Loading chat..." />}>
      <ChatPageContent />
    </Suspense>
  );
}