import { ChatMessage, Conversation, User } from '@/types/chat';

// Simplified user data (fetch from user service in real app)
export const mockUsers: Record<string, User> = {
  'tenant-1': { id: 'tenant-1', firstName: 'Sarah', lastName: 'Johnson', profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
  'tenant-2': { id: 'tenant-2', firstName: 'Michael', lastName: 'Chen', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  'landlord-1': { id: 'landlord-1', firstName: 'John', lastName: 'Smith', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  'landlord-2': { id: 'landlord-2', firstName: 'David', lastName: 'Kumar', profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face' },
};

// Simplified conversations
export const mockConversations: Conversation[] = [
  {
    id: 'tenant-1#prop-1',
    tenantId: 'tenant-1',
    landlordId: 'landlord-1',
    propertyId: 'prop-1',
    propertyTitle: 'Modern 2BR Apartment in Masaki',
    lastMessage: 'Perfect! Thursday at 2 PM works for me.',
    lastMessageSender: 'tenant-1',
    lastMessageTime: '2026-01-05T08:30:00Z',
    unreadCount: { 'landlord-1': 1, 'tenant-1': 0 },
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-05T08:30:00Z',
  },
  {
    id: 'tenant-2#prop-2',
    tenantId: 'tenant-2',
    landlordId: 'landlord-1',
    propertyId: 'prop-2',
    propertyTitle: 'Family House in Mikocheni',
    lastMessage: 'Yes, covered parking for 2 cars and spacious garden.',
    lastMessageSender: 'landlord-1',
    lastMessageTime: '2026-01-04T15:15:00Z',
    unreadCount: { 'landlord-1': 0, 'tenant-2': 1 },
    createdAt: '2026-01-04T14:00:00Z',
    updatedAt: '2026-01-04T15:15:00Z',
  },
];

// Simplified messages
export const mockMessages: Record<string, ChatMessage[]> = {
  'tenant-1#prop-1': [
    { id: 'msg-1', conversationId: 'tenant-1#prop-1', senderId: 'tenant-1', content: 'Hello! Is the apartment still available?', timestamp: '2026-01-05T08:00:00Z', isRead: true },
    { id: 'msg-2', conversationId: 'tenant-1#prop-1', senderId: 'landlord-1', content: 'Hi Sarah! Yes, would you like to schedule a viewing?', timestamp: '2026-01-05T08:15:00Z', isRead: true },
  ],
  'tenant-2#prop-2': [
    { id: 'msg-3', conversationId: 'tenant-2#prop-2', senderId: 'tenant-2', content: 'What\'s included in the rent?', timestamp: '2026-01-04T14:00:00Z', isRead: true },
    { id: 'msg-4', conversationId: 'tenant-2#prop-2', senderId: 'landlord-1', content: 'Water and security included. Electricity separate.', timestamp: '2026-01-04T14:30:00Z', isRead: true },
  ],
};

// Simplified helper functions
export const getUser = (userId: string): User | undefined => mockUsers[userId];

export const getUserConversations = (userId: string) => {
  return mockConversations
    .filter(conv => conv.tenantId === userId || conv.landlordId === userId)
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
};

export const getConversationMessages = (conversationId: string) => mockMessages[conversationId] || [];

export const getConversation = (conversationId: string) => mockConversations.find(c => c.id === conversationId);

export const createConversation = (tenantId: string, landlordId: string, propertyId: string, propertyTitle: string) => {
  const id = `${tenantId}#${propertyId}`;
  const existing = getConversation(id);
  if (existing) return existing;

  const newConversation: Conversation = {
    id,
    tenantId,
    landlordId,
    propertyId,
    propertyTitle,
    lastMessage: '',
    lastMessageSender: '',
    lastMessageTime: new Date().toISOString(),
    unreadCount: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockConversations.push(newConversation);
  return newConversation;
};