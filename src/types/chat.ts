// Chat-specific types for the messaging system

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
}

export interface Conversation {
  id: string;
  participantIds: [string, string]; // [tenantId, landlordId]
  propertyId?: string;
  propertyTitle?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  userId: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  userType: 'TENANT' | 'LANDLORD';
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ConversationWithParticipant extends Conversation {
  otherParticipant: ChatParticipant;
}

