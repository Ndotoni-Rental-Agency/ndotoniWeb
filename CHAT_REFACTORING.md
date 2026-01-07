# Chat Page Refactoring & Improved Contact Flow

## Overview
The chat page has been refactored from a single large component (~400+ lines) into smaller, more manageable pieces for better maintainability and readability. Additionally, the "Contact Agent" flow has been completely redesigned to eliminate rate limiting issues and provide a better user experience.

## New Contact Agent Flow

### **Before (Problematic)**
1. User clicks "Contact Agent" → Immediate backend API call to create conversation
2. Rate limiting issues due to multiple rapid API calls
3. Complex error handling and retry mechanisms needed
4. Page "tweaking" when API calls failed

### **After (Improved)**
1. User clicks "Contact Agent" → **No backend calls**, just opens chat interface
2. Shows suggested message based on user role (landlord vs tenant)
3. **First message send** → Creates conversation in backend with initial message
4. Subsequent messages → Normal message flow

### **Benefits of New Approach**
- ✅ **No rate limiting issues** - No API calls until user actually sends a message
- ✅ **Instant response** - Chat interface opens immediately
- ✅ **Better UX** - Users see the interface right away with suggested message
- ✅ **Simpler code** - No complex retry/error handling for conversation creation
- ✅ **Efficient** - Only creates conversations when users actually want to chat

## Structure

### Custom Hooks
- **`useConversations`** - Manages conversation list state and real-time updates
- **`useMessages`** - Handles message loading, sending, and real-time subscriptions
- **`usePropertyContact`** - Manages property inquiry flow and suggested messages (simplified)
- **`useChatLayout`** - Handles responsive layout state (mobile/desktop)

### Components
- **`ChatHeader`** - Top header with title and conversation count
- **`ConversationSidebar`** - Left sidebar with search and conversation list
- **`ChatArea`** - Main chat interface with messages and input
- **`LoadingStates`** - Reusable loading and unauthenticated state components

### Contact Flow Features
1. **Role-Aware Messaging** - Different suggested messages for landlords vs tenants
2. **Temporary Conversations** - UI shows conversation before backend creation
3. **Lazy Creation** - Conversations only created when first message is sent
4. **Existing Conversation Detection** - Checks for existing conversations first
5. **Real User Names** - Displays actual user names instead of generic labels
6. **User Avatars** - Shows user initials or profile images

### Benefits
1. **Separation of Concerns** - Each hook/component has a single responsibility
2. **Reusability** - Components and hooks can be reused in other parts of the app
3. **Testability** - Smaller units are easier to test individually
4. **Maintainability** - Easier to locate and fix issues
5. **Readability** - Main component is now ~100 lines instead of 400+
6. **Reliability** - No more rate limiting or API failure issues on contact

### File Structure
```
src/
├── hooks/
│   ├── useConversations.ts
│   ├── useMessages.ts
│   ├── usePropertyContact.ts (simplified - no API calls)
│   ├── useChatLayout.ts
│   └── useUserInfo.ts (new - fetches user information)
├── components/chat/
│   ├── ChatHeader.tsx
│   ├── ConversationSidebar.tsx
│   ├── ChatArea.tsx (enhanced with real user names)
│   ├── ConversationItem.tsx (new - individual conversation with user info)
│   └── LoadingStates.tsx
├── types/
│   └── chat.ts (updated with isTemporary flag)
└── app/chat/
    └── page.tsx (refactored main component)
```

## Contact Flow Details

### **Role Detection**
- Detects when a landlord accesses their own property vs when a tenant accesses it
- Shows appropriate suggested messages based on user role:
  - **Landlord**: "This is a conversation for your property [title]."
  - **Tenant**: "Hi! I'm interested in your property [title]. Could you please provide more information about viewing arrangements?"

### **Conversation Lifecycle**
1. **URL Access**: User clicks "Contact Agent" with URL params (propertyId, landlordId, propertyTitle)
2. **Existing Check**: System checks if conversation already exists
3. **Temporary Creation**: If no existing conversation, creates temporary UI conversation
4. **Interface Opening**: Chat interface opens immediately with suggested message
5. **Backend Creation**: When user sends first message, conversation is created in backend
6. **Normal Flow**: Subsequent messages follow normal chat flow

### **User Experience Improvements**
- **Real Names**: Chat interface now shows actual user names (e.g., "John Smith") instead of generic labels ("Landlord", "Tenant")
- **User Avatars**: Displays user initials or profile images in conversation list and chat header
- **Smart Fallbacks**: Shows email or "Unknown User" if name information is unavailable
- **Consistent Display**: Same user information shown across conversation list, chat header, and message bubbles

### **Temporary Conversations**
- Marked with `isTemporary: true` flag
- Exist only in frontend state until first message
- Automatically converted to real conversations on first message send
- Include all necessary data for UI display

## Usage
The refactored system maintains the same user experience but with much better performance and reliability. Users can now access the chat interface instantly without waiting for backend operations or encountering rate limit errors.