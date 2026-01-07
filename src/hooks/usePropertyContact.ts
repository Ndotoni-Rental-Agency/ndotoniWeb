import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export function usePropertyContact(
  userId: string | undefined,
  onConversationCreated?: (conversationId: string, tempConversation?: any) => void,
  onConversationsReload?: () => Promise<any[]>
) {
  const [suggestedMessage, setSuggestedMessage] = useState('');
  const searchParams = useSearchParams();
  const processedParams = useRef<string | null>(null);

  // Extract search params
  const landlordId = searchParams.get('landlordId');
  const propertyTitle = searchParams.get('propertyTitle');
  const isLandlordAccessingOwnProperty = userId === landlordId;

  const getSuggestedMessage = (messagesLength: number) => {
    console.log('getSuggestedMessage called - suggestedMessage:', suggestedMessage, 'messagesLength:', messagesLength);
    
    // Return the stored suggested message if available
    if (suggestedMessage) {
      console.log('Returning stored suggested message:', suggestedMessage);
      return suggestedMessage;
    }
    
    // If we have URL params and this is a new conversation (no messages yet)
    const propertyTitle = searchParams.get('propertyTitle');
    const landlordId = searchParams.get('landlordId');
    
    if (propertyTitle && messagesLength === 0) {
      // Check if current user is the landlord
      const isLandlord = userId === landlordId;
      
      let fallbackMessage = '';
      if (isLandlord) {
        fallbackMessage = `This is a conversation for your property "${propertyTitle}".`;
      } else {
        fallbackMessage = `Hi! I'm interested in your property "${propertyTitle}". Could you please provide more information about viewing arrangements?`;
      }
      
      console.log('Returning fallback message for', isLandlord ? 'landlord' : 'tenant', ':', fallbackMessage);
      return fallbackMessage;
    }
    
    console.log('No suggested message to return');
    return '';
  };

  const clearSuggestedMessage = () => {
    setSuggestedMessage('');
  };

  useEffect(() => {
    const handlePropertyContact = () => {
      const propertyId = searchParams.get('propertyId');
      let landlordId = searchParams.get('landlordId');
      const propertyTitle = searchParams.get('propertyTitle');

      // Create a unique key for these params to prevent duplicate processing
      const paramsKey = `${propertyId}-${landlordId}-${propertyTitle}-${userId}`;
      
      // Skip if we've already processed these exact params
      if (!propertyId || !propertyTitle || !userId || 
          processedParams.current === paramsKey) {
        return;
      }

      // Mark these params as being processed
      processedParams.current = paramsKey;

      // Check if current user is the landlord (property owner)
      const isLandlord = userId === landlordId;
      
      if (isLandlord) {
        // Landlord accessing their own property - this shouldn't create a conversation
        // Instead, redirect them to view existing conversations for this property
        console.log('Landlord accessing their own property - showing existing conversations');
        setSuggestedMessage(`This is your property "${propertyTitle}". You can view and respond to tenant inquiries here.`);
        
        // Don't create a new conversation, just show existing ones
        // The landlord should see conversations where they are the landlord for this property
        return;
      }
      
      // Set appropriate suggested message for tenant inquiries
      const suggested = `Hi! I'm interested in your property "${propertyTitle}". Could you please provide more information about viewing arrangements?`;
      setSuggestedMessage(suggested);
      
      // Generate the conversation ID that would be used
      const conversationId = `${userId}#${propertyId}`;
      
      // Try to find existing conversation first
      onConversationsReload?.().then(async (conversations) => {
        console.log('All conversations for user:', userId, conversations);
        
        const existingConversation = conversations?.find(c => c.id === conversationId);
        
        if (existingConversation) {
          console.log('Found existing conversation:', existingConversation);
          // Select the existing conversation
          setTimeout(() => {
            onConversationCreated?.(conversationId);
          }, 100);
        } else {
          console.log('No existing conversation found for conversationId:', conversationId);
          console.log('Will create on first message send');
          
          // Resolve landlordId if needed for the temporary conversation
          let resolvedLandlordId = landlordId;
          if (landlordId === 'unknown' || !landlordId) {
            try {
              const { resolveLandlordFromProperty } = await import('@/lib/utils/chat');
              const landlordInfo = await resolveLandlordFromProperty(propertyId);
              if (landlordInfo) {
                resolvedLandlordId = landlordInfo.userId;
                console.log('Resolved landlordId for temporary conversation:', resolvedLandlordId);
              }
            } catch (error) {
              console.log('Could not resolve landlordId, will resolve on message send');
            }
          }
          
          // Create a temporary conversation object for the UI
          const tempConversation = {
            id: conversationId,
            tenantId: userId,
            landlordId: resolvedLandlordId || 'unknown',
            propertyId,
            propertyTitle,
            lastMessage: '',
            lastMessageSender: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isTemporary: true, // Flag to indicate this is a temporary conversation
          };
          
          console.log('Created temporary conversation:', tempConversation);
          
          // Trigger the conversation selection with the temporary conversation
          setTimeout(() => {
            onConversationCreated?.(conversationId, tempConversation);
          }, 100);
        }
      });
    };

    if (userId) {
      handlePropertyContact();
    }
  }, [searchParams, userId, onConversationCreated, onConversationsReload]);

  return {
    suggestedMessage,
    getSuggestedMessage,
    clearSuggestedMessage,
    isLandlordAccessingOwnProperty,
    propertyTitle,
  };
}