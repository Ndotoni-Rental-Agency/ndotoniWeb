import { ChatMessage, Conversation, ChatParticipant, ConversationWithParticipant } from '@/types/chat';

// Mock participants (tenants and landlords)
export const mockParticipants: Record<string, ChatParticipant> = {
  'tenant-1': {
    userId: 'tenant-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    userType: 'TENANT',
    isOnline: true,
  },
  'tenant-2': {
    userId: 'tenant-2',
    firstName: 'Michael',
    lastName: 'Chen',
    userType: 'TENANT',
    isOnline: false,
    lastSeen: '2026-01-05T10:30:00Z',
  },
  'tenant-3': {
    userId: 'tenant-3',
    firstName: 'Emma',
    lastName: 'Wilson',
    userType: 'TENANT',
    isOnline: true,
  },
  'landlord-1': {
    userId: 'landlord-1',
    firstName: 'John',
    lastName: 'Smith',
    userType: 'LANDLORD',
    isOnline: true,
  },
  'landlord-2': {
    userId: 'landlord-2',
    firstName: 'David',
    lastName: 'Kumar',
    userType: 'LANDLORD',
    isOnline: false,
    lastSeen: '2026-01-05T09:00:00Z',
  },
};

// Mock messages for different conversations
export const mockMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      receiverId: 'landlord-1',
      content: 'Hello! I saw your listing for the Modern Apartment in Masaki. Is it still available?',
      timestamp: '2026-01-05T08:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'landlord-1',
      receiverId: 'tenant-1',
      content: 'Hi Sarah! Yes, the apartment is still available. Would you like to schedule a viewing?',
      timestamp: '2026-01-05T08:15:00Z',
      isRead: true,
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      receiverId: 'landlord-1',
      content: 'That would be great! I\'m available this Wednesday or Thursday afternoon. Would either of those days work for you?',
      timestamp: '2026-01-05T08:20:00Z',
      isRead: true,
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'landlord-1',
      receiverId: 'tenant-1',
      content: 'Thursday afternoon works perfectly! How about 2 PM? I can meet you at the property and show you around. It usually takes about 30-45 minutes.',
      timestamp: '2026-01-05T08:25:00Z',
      isRead: true,
    },
    {
      id: 'msg-5',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      receiverId: 'landlord-1',
      content: 'Perfect! Thursday at 2 PM works for me. Could you send me the exact address? Also, are pets allowed in the building?',
      timestamp: '2026-01-05T08:30:00Z',
      isRead: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-6',
      conversationId: 'conv-2',
      senderId: 'tenant-2',
      receiverId: 'landlord-1',
      content: 'Hi, I\'m interested in the Family House in Mikocheni. What\'s included in the rent?',
      timestamp: '2026-01-04T14:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-7',
      conversationId: 'conv-2',
      senderId: 'landlord-1',
      receiverId: 'tenant-2',
      content: 'Hello Michael! The rent includes water and security services. Electricity is metered separately. The house also comes with a backup generator.',
      timestamp: '2026-01-04T14:30:00Z',
      isRead: true,
    },
    {
      id: 'msg-8',
      conversationId: 'conv-2',
      senderId: 'tenant-2',
      receiverId: 'landlord-1',
      content: 'That sounds good. What about parking? And is there a garden area?',
      timestamp: '2026-01-04T15:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-9',
      conversationId: 'conv-2',
      senderId: 'landlord-1',
      receiverId: 'tenant-2',
      content: 'Yes, there\'s covered parking for 2 cars and a spacious garden with mature trees. It\'s perfect for families with children.',
      timestamp: '2026-01-04T15:15:00Z',
      isRead: false,
    },
  ],
  'conv-3': [
    {
      id: 'msg-10',
      conversationId: 'conv-3',
      senderId: 'tenant-3',
      receiverId: 'landlord-2',
      content: 'Good morning! I\'m looking for a studio apartment and yours caught my eye. Can I ask about the lease terms?',
      timestamp: '2026-01-03T09:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-11',
      conversationId: 'conv-3',
      senderId: 'landlord-2',
      receiverId: 'tenant-3',
      content: 'Good morning Emma! The minimum lease is 6 months with a one-month deposit and one month advance rent. Utilities are not included.',
      timestamp: '2026-01-03T10:00:00Z',
      isRead: true,
    },
  ],
};

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['tenant-1', 'landlord-1'],
    propertyId: 'prop-1',
    propertyTitle: 'Modern Apartment in Masaki',
    lastMessage: mockMessages['conv-1'][mockMessages['conv-1'].length - 1],
    unreadCount: 1,
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-05T08:30:00Z',
  },
  {
    id: 'conv-2',
    participantIds: ['tenant-2', 'landlord-1'],
    propertyId: 'prop-2',
    propertyTitle: 'Family House in Mikocheni',
    lastMessage: mockMessages['conv-2'][mockMessages['conv-2'].length - 1],
    unreadCount: 1,
    createdAt: '2026-01-04T14:00:00Z',
    updatedAt: '2026-01-04T15:15:00Z',
  },
  {
    id: 'conv-3',
    participantIds: ['tenant-3', 'landlord-2'],
    propertyId: 'prop-3',
    propertyTitle: 'Studio in Upanga',
    lastMessage: mockMessages['conv-3'][mockMessages['conv-3'].length - 1],
    unreadCount: 0,
    createdAt: '2026-01-03T09:00:00Z',
    updatedAt: '2026-01-03T10:00:00Z',
  },
];

// Helper function to get conversations for a specific user
export const getConversationsForUser = (userId: string): ConversationWithParticipant[] => {
  return mockConversations
    .filter(conv => conv.participantIds.includes(userId))
    .map(conv => {
      const otherParticipantId = conv.participantIds.find(id => id !== userId);
      const otherParticipant = mockParticipants[otherParticipantId || ''];
      
      return {
        ...conv,
        otherParticipant,
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

// Helper function to get messages for a conversation
export const getMessagesForConversation = (conversationId: string): ChatMessage[] => {
  return mockMessages[conversationId] || [];
};

// Helper function to get participant info
export const getParticipant = (userId: string): ChatParticipant | undefined => {
  return mockParticipants[userId];
};

