# Chat System Implementation

## Overview

The chat system allows tenants to message landlords about properties. It supports real-time messaging via GraphQL subscriptions and handles landlord resolution automatically.

## Features

✅ **Real-time Messaging**: GraphQL subscriptions for instant message delivery  
✅ **Landlord Resolution**: Automatically resolves landlord details from property ID  
✅ **Progressive Loading**: Conversations load first, messages on-demand  
✅ **Unread Count Tracking**: Real-time unread message counts  
✅ **Mobile Responsive**: Works seamlessly on mobile and desktop  
✅ **Authentication Integration**: Handles auth flows for unauthenticated users  

## How to Start a Chat

### From Property Card
Click the message icon on any property card. The system will:
1. Check if user is authenticated (show auth modal if not)
2. Resolve the landlord ID from the property
3. Create or find existing conversation
4. Navigate to chat with the conversation selected

### From Property Details
Click the "Contact Agent" button on property detail pages. Same flow as above.

### Direct Navigation
Navigate to `/chat?propertyId=123&landlordId=456&propertyTitle=Nice%20Apartment`

## Architecture

### Backend
- **Single Table Design**: DynamoDB with conversations and messages in one table
- **Real-time Subscriptions**: GraphQL subscriptions for live updates
- **Landlord Resolution**: Automatic lookup of landlord details via `getUser` query

### Frontend
- **Progressive Loading**: Load conversation list first, messages on-demand
- **Optimistic Updates**: Messages appear instantly, confirmed via subscriptions
- **Real-time Updates**: Live message delivery and unread count updates

## Key Components

### Chat Page (`/chat`)
- Main chat interface with conversation list and message view
- Handles property-to-chat navigation via URL parameters
- Sets up real-time subscriptions for messages and conversation updates

### PropertyCard
- Message icon that starts chat for the property
- Handles authentication flow for unauthenticated users
- Uses landlord resolution utility

### ChatContext
- Manages global unread count with real-time updates
- Provides chat state across the application

### Utility Functions (`/lib/utils/chat.ts`)
- `resolveLandlordFromProperty()`: Gets landlord details from property ID
- `createChatUrl()`: Creates proper chat URLs with parameters
- `getLandlordDisplayName()`: Formats landlord names for display

## GraphQL Operations

### Queries
- `getUserConversations`: Get all conversations for a user
- `getConversationMessages`: Get messages for a specific conversation
- `getUnreadCount`: Get total unread message count
- `getProperty`: Get property details (used for landlord resolution)
- `getUser`: Get user/landlord details

### Mutations
- `createConversation`: Create new conversation
- `sendMessage`: Send a message
- `markAsRead`: Mark conversation as read

### Subscriptions
- `onNewMessage`: Real-time new message notifications
- `onConversationUpdated`: Real-time conversation updates
- `onUnreadCountChanged`: Real-time unread count updates

## Testing

### Manual Testing
1. Visit `/chat/test` to test subscriptions
2. Open two browser windows with different users
3. Send messages and verify real-time updates

### Property Integration Testing
1. Click message icon on property cards
2. Verify landlord resolution works
3. Test authentication flow for unauthenticated users

## Error Handling

- **Landlord Not Found**: Falls back gracefully, shows error message
- **Network Errors**: Retry mechanisms and user feedback
- **Authentication**: Seamless auth modal integration
- **Subscription Failures**: Automatic reconnection and fallback to polling

## Performance

- **Caching**: GraphQL queries cached for optimal performance
- **Lazy Loading**: Messages loaded only when conversation is selected
- **Subscription Cleanup**: Proper cleanup prevents memory leaks
- **Optimistic Updates**: Instant UI feedback while backend processes

## Security

- **Authentication Required**: All chat operations require valid user session
- **User Isolation**: Users can only see their own conversations
- **Input Validation**: Message content validated on backend
- **Rate Limiting**: Built into GraphQL resolvers