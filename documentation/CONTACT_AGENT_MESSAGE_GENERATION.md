# Contact Agent Message Generation

## Overview

When users click "Contact Agent" on a property, the chat interface now automatically generates a suggested message similar to the WhatsApp contact feature. This provides a consistent user experience and makes it easier for users to start conversations about properties.

## How It Works

### 1. Message Generation
- When a user clicks "Contact Agent" from a property page or property card
- The system generates a pre-filled message in the format:
  ```
  Hi! I'm interested in your property: [Property Title]
  
  Property link: https://www.ndotoni.com/property/[property-id]
  ```

### 2. User Experience
- The message appears pre-filled in the chat input field
- Users can:
  - Send the message as-is
  - Edit the message before sending
  - Delete the message and write their own
  - The message only appears for new conversations (not existing ones)

### 3. Implementation Details

#### Files Modified:
- `src/lib/utils/chat.ts` - Added `generateInitialContactMessage()` function
- `src/app/chat/page.tsx` - Updated `getSuggestedMessage()` to generate the message
- `src/components/chat/ChatInput.tsx` - Already had support for `initialMessage` prop

#### Key Functions:

**generateInitialContactMessage()**
```typescript
export function generateInitialContactMessage(
  propertyTitle: string,
  propertyId: string,
  customMessage?: string
): string
```
- Generates the standard contact message format
- Includes property title and link
- Allows for custom message override

**getSuggestedMessage() in ChatPage**
- Checks if this is a new conversation (temporary conversation)
- Uses URL parameters to get property details
- Returns the generated message for new property conversations
- Returns empty string for existing conversations

## Benefits

1. **Consistency** - Same message format as WhatsApp contact feature
2. **User Convenience** - Pre-filled message saves typing
3. **Flexibility** - Users can edit or replace the message
4. **Context** - Always includes property link for reference
5. **Professional** - Standardized format looks more professional

## Usage Examples

### From Property Details Page
1. User clicks "Contact Agent" button
2. Chat opens with pre-filled message:
   ```
   Hi! I'm interested in your property: Cozy Studio in Upanga
   
   Property link: https://www.ndotoni.com/property/5cd37d77-d968-4518-8781-2fbf710739c0
   ```

### From Property Cards
1. User clicks contact button on property card
2. Same pre-filled message appears in chat

### Existing Conversations
- No suggested message appears
- Users start with empty input field
- Maintains normal chat experience

## Technical Notes

- Message generation only happens client-side for security
- Uses URL parameters passed during chat initialization
- Compatible with existing chat infrastructure
- No backend changes required
- Gracefully handles missing property information