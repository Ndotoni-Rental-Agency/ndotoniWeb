import { generateClient } from 'aws-amplify/api';

const client = generateClient();

// GraphQL queries and mutations
const GET_USER_CONVERSATIONS = `
  query GetUserConversations($userId: String!) {
    getUserConversations(userId: $userId) {
      id
      tenantId
      landlordId
      propertyId
      propertyTitle
      lastMessage
      lastMessageSender
      lastMessageTime
      unreadCount
      createdAt
      updatedAt
    }
  }
`;

const GET_CONVERSATION_MESSAGES = `
  query GetConversationMessages($conversationId: String!) {
    getConversationMessages(conversationId: $conversationId) {
      id
      conversationId
      senderId
      content
      timestamp
      isRead
    }
  }
`;

const CREATE_CONVERSATION = `
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      tenantId
      landlordId
      propertyId
      propertyTitle
      lastMessage
      lastMessageSender
      lastMessageTime
      unreadCount
      createdAt
      updatedAt
    }
  }
`;

const SEND_MESSAGE = `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      conversationId
      senderId
      content
      timestamp
      isRead
    }
  }
`;

const MARK_AS_READ = `
  mutation MarkAsRead($conversationId: String!, $userId: String!) {
    markAsRead(conversationId: $conversationId, userId: $userId) {
      id
      unreadCount
      updatedAt
    }
  }
`;

const GET_UNREAD_COUNT = `
  query GetUnreadCount($userId: String!) {
    getUnreadCount(userId: $userId)
  }
`;

// GraphQL subscriptions
const ON_NEW_MESSAGE = `
  subscription OnNewMessage($conversationId: String!) {
    onNewMessage(conversationId: $conversationId) {
      id
      conversationId
      senderId
      content
      timestamp
      isRead
    }
  }
`;

const ON_CONVERSATION_UPDATED = `
  subscription OnConversationUpdated($userId: String!) {
    onConversationUpdated(userId: $userId) {
      id
      tenantId
      landlordId
      propertyId
      propertyTitle
      lastMessage
      lastMessageSender
      lastMessageTime
      unreadCount
      createdAt
      updatedAt
    }
  }
`;

const ON_UNREAD_COUNT_CHANGED = `
  subscription OnUnreadCountChanged($userId: String!) {
    onUnreadCountChanged(userId: $userId) {
      totalUnread
    }
  }
`;

// API functions
export const chatAPI = {
  async getUserConversations(userId: string) {
    try {
      const response = await client.graphql({
        query: GET_USER_CONVERSATIONS,
        variables: { userId }
      }) as any;
      return response.data.getUserConversations;
    } catch (error) {
      throw error;
    }
  },

  async getConversationMessages(conversationId: string) {
    try {
      const response = await client.graphql({
        query: GET_CONVERSATION_MESSAGES,
        variables: { conversationId }
      }) as any;
      return response.data.getConversationMessages;
    } catch (error) {
      throw error;
    }
  },

  async createConversation(input: {
    tenantId: string;
    landlordId: string;
    propertyId: string;
    propertyTitle: string;
    initialMessage?: string;
  }) {
    try {
      const response = await client.graphql({
        query: CREATE_CONVERSATION,
        variables: { input }
      }) as any;
      return response.data.createConversation;
    } catch (error) {
      throw error;
    }
  },

  async sendMessage(input: {
    conversationId: string;
    senderId: string;
    content: string;
  }) {
    try {
      const response = await client.graphql({
        query: SEND_MESSAGE,
        variables: { input }
      }) as any;
      return response.data.sendMessage;
    } catch (error) {
      throw error;
    }
  },

  async markAsRead(conversationId: string, userId: string) {
    try {
      const response = await client.graphql({
        query: MARK_AS_READ,
        variables: { conversationId, userId }
      }) as any;
      return response.data.markAsRead;
    } catch (error) {
      throw error;
    }
  },

  async getUnreadCount(userId: string) {
    try {
      const response = await client.graphql({
        query: GET_UNREAD_COUNT,
        variables: { userId }
      }) as any;
      return response.data.getUnreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Subscription functions
  subscribeToNewMessages(conversationId: string, callback: (message: any) => void) {
    try {
      const subscription = client.graphql({
        query: ON_NEW_MESSAGE,
        variables: { conversationId }
      });

      if ('subscribe' in subscription) {
        return subscription.subscribe({
          next: ({ data }) => {
            if (data?.onNewMessage) {
              callback(data.onNewMessage);
            }
          },
          error: (error) => {
            console.error('New message subscription error:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error setting up new message subscription:', error);
    }
  },

  subscribeToConversationUpdates(userId: string, callback: (conversation: any) => void) {
    try {
      const subscription = client.graphql({
        query: ON_CONVERSATION_UPDATED,
        variables: { userId }
      });

      if ('subscribe' in subscription) {
        return subscription.subscribe({
          next: ({ data }) => {
            if (data?.onConversationUpdated) {
              callback(data.onConversationUpdated);
            }
          },
          error: (error) => {
            console.error('Conversation update subscription error:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error setting up conversation update subscription:', error);
    }
  },

  subscribeToUnreadCountChanges(userId: string, callback: (count: number) => void) {
    try {
      const subscription = client.graphql({
        query: ON_UNREAD_COUNT_CHANGED,
        variables: { userId }
      });

      if ('subscribe' in subscription) {
        return subscription.subscribe({
          next: ({ data }) => {
            if (data?.onUnreadCountChanged) {
              callback(data.onUnreadCountChanged.totalUnread);
            }
          },
          error: (error) => {
            console.error('Unread count subscription error:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error setting up unread count subscription:', error);
    }
  }
};