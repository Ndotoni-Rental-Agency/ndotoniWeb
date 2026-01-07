// Simplified core types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface Conversation {
  id: string; // tenantId#propertyId
  tenantId: string;
  landlordId: string;
  propertyId: string;
  propertyTitle: string;
  lastMessage: string;
  lastMessageSender: string;
  lastMessageTime: string;
  unreadCount: { [userId: string]: number }; // Simplified unread tracking
  createdAt: string;
  updatedAt: string;
  isTemporary?: boolean; // Flag for temporary conversations not yet created in backend
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Simple contact request
export interface ContactRequest {
  propertyId: string;
  propertyTitle: string;
  landlordId: string;
  message?: string;
}