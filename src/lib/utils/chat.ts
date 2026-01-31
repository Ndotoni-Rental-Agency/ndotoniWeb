import { cachedGraphQL } from '@/lib/cache';
import { initializePropertyChat } from '@/graphql/mutations';

export interface LandlordInfo {
  firstName: string;
  lastName: string;
  businessName?: string;
  profileImage?: string;
}

export interface ChatInitializationData {
  conversationId: string;
  landlordInfo: LandlordInfo;
  propertyTitle: string;
  propertyId: string;
}

/**
 * Initialize a property chat securely through the backend
 * This replaces the insecure method of exposing landlordId in property details
 */
export async function initializePropertyChatSecure(propertyId: string): Promise<ChatInitializationData | null> {
  try {
    console.log('Initializing chat for property:', propertyId);
    
    const response = await cachedGraphQL.mutate({
      query: initializePropertyChat,
      variables: { propertyId }
    });
    
    const data = response.data?.initializePropertyChat;
    if (!data) {
      console.error('Failed to initialize chat');
      return null;
    }
    
    console.log('Chat initialized successfully:', data);
    return data;
    
  } catch (error) {
    console.error('Error initializing property chat:', error);
    return null;
  }
}

/**
 * Creates a chat URL with secure chat initialization
 */
export function createSecureChatUrl(chatData: ChatInitializationData): string {
  const params = new URLSearchParams({
    conversationId: chatData.conversationId,
    propertyId: chatData.propertyId,
    propertyTitle: chatData.propertyTitle,
    landlordFirstName: chatData.landlordInfo.firstName,
    landlordLastName: chatData.landlordInfo.lastName,
  });
  
  if (chatData.landlordInfo.businessName) {
    params.append('businessName', chatData.landlordInfo.businessName);
  }
  
  return `/chat?${params.toString()}`;
}

/**
 * Gets a display name for a landlord
 */
export function getLandlordDisplayName(landlord: LandlordInfo): string {
  if (landlord.businessName) {
    return landlord.businessName;
  }
  
  if (landlord.firstName && landlord.lastName) {
    return `${landlord.firstName} ${landlord.lastName}`;
  }
  
  if (landlord.firstName) {
    return landlord.firstName;
  }
  
  return 'Landlord';
}

/**
 * Generate initial contact message for property inquiry
 */
export function generateInitialContactMessage(
  propertyTitle: string,
  propertyId: string,
  customMessage?: string
): string {
  // Construct property URL
  const propertyUrl = `${window.location.origin}/property/${propertyId}`;
  
  // Use readable format with line breaks (now that we handle them properly in the UI)
  let defaultMessage = `Hi! I'm interested in your property: ${propertyTitle}\n\nProperty link: ${propertyUrl}`;
  
  return customMessage || defaultMessage;
}