'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
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
import { usePropertyContact } from '@/hooks/usePropertyContact';
import { useChatLayout } from '@/hooks/useChatLayout';

// Components
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { LoadingSpinner, UnauthenticatedState } from '@/components/chat/LoadingStates';

function ChatPageContent() {
  const searchParams = useSearchParams();
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
    initializeChat,
    markConversationAsRead,
    subscribeToConversation,
    refreshUnreadCount,
    clearMessages
  } = useChat();

  // State management
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);

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
    user?.email, // Use email as the user identifier
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
    
    if (!conversation || !user?.email) {
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
    subscribeToConversation(conversationId, user.email);
    
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
    setSelectedConversation(null);
    clearMessages();
    clearSuggestedMessage();
  };

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.email) return;

    // Check if this is a temporary conversation (needs to be created in backend)
    if (selectedConversation.isTemporary) {
      console.log('Creating conversation in backend for first message...');
      
      if (!selectedConversation.propertyId) {
        throw new Error('Property ID is missing for temporary conversation');
      }
      
      try {
        // Initialize the chat using the secure backend endpoint
        const chatData = await initializeChat(selectedConversation.propertyId);
        
        console.log('Chat initialized:', chatData);

        // Update the selected conversation with the real conversation ID
        const realConversation: Conversation = {
          __typename: 'Conversation',
          id: chatData.conversationId,
          propertyId: selectedConversation.propertyId,
          propertyTitle: chatData.propertyTitle,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          otherPartyName: chatData.landlordName,
          otherPartyImage: null,
        };

        setSelectedConversation({
          ...realConversation,
          isTemporary: false,
          landlordInfo: {
            firstName: chatData.landlordName.split(' ')[0] || '',
            lastName: chatData.landlordName.split(' ').slice(1).join(' ') || '',
          },
        });

        // Set up real-time subscription for new messages
        subscribeToConversation(chatData.conversationId, user.email);

        // Now send the initial message
        await sendMessage(chatData.conversationId, content);

        return;

      } catch (error) {
        console.error('Error creating conversation:', error);
        throw error; // Re-throw so ChatInput can handle the error
      }
    }

    // Normal message sending for existing conversations (shows message immediately)
    await sendMessage(selectedConversation.id, content);
  };

  // Process URL parameters to initialize chat
  useEffect(() => {
    if (!urlParamsProcessed && isAuthenticated && !loadingConversations && conversations.length >= 0) {
      const conversationId = searchParams.get('conversationId');
      const propertyId = searchParams.get('propertyId');
      const propertyTitle = searchParams.get('propertyTitle');
      const landlordName = searchParams.get('landlordName');

      console.log('Processing URL params:', { conversationId, propertyId, propertyTitle, landlordName });

      if (conversationId) {
        // Direct link to existing conversation
        console.log('Selecting existing conversation from URL:', conversationId);
        handleSelectConversation(conversationId);
      } else if (propertyId && propertyTitle && landlordName) {
        // Link to start new conversation with property
        console.log('Creating temporary conversation from URL params');
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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
      <div className="flex-1 overflow-hidden pt-16">
        <div className="h-full max-w-7xl mx-auto bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 overflow-hidden flex">
          <ConversationSidebar
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            currentUserId={''}
            showConversationList={showConversationList}
          />

          <ChatArea
            selectedConversation={selectedConversation}
            messages={messages}
            loadingMessages={loadingMessages}
            sendingMessage={sendingMessage}
            currentUserId={''}
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
