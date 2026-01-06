# Chat System Demo

## How to Test the Complete Flow

### 1. **Start the development server** (if not already running):
```bash
cd ndotoniWeb
npm run dev
```

### 2. **Test the Property → Chat Flow**:

**Step 1:** Navigate to any property page:
- Go to: http://localhost:3001/property/[any-property-id]
- Example: http://localhost:3001/property/123

**Step 2:** Click "Contact Agent" button
- The blue "Contact Agent" button will either:
  - **If logged in:** Navigate directly to chat with property context
  - **If not logged in:** Show authentication modal popup
- After successful login, automatically proceeds to chat
- Pre-fills a suggested message about the property

**Step 3:** View the chat interface:
- Opens at: http://localhost:3001/chat
- Shows conversation list on the left
- Auto-selects the conversation for the property you contacted about
- Message input has a pre-filled inquiry message

### 3. **Direct Chat Access**:
- Navigate directly to: http://localhost:3001/chat
- Use the toggle button to switch between Landlord/Tenant views

## What You'll See

### Mock Data Features
- **4 sample conversations** with realistic property inquiries
- **Profile images** from Unsplash for visual appeal
- **Different user types**: Switch between Landlord and Tenant views
- **Unread message indicators** with blue badges
- **Property context** showing which property each conversation is about
- **Realistic timestamps** and message content

### New Contact Agent Flow
- **Seamless navigation** from property page to chat
- **Automatic conversation creation** for new property inquiries
- **Pre-filled messages** with property context
- **Property-specific conversations** clearly labeled

### UI Features
- **iPhone Messages style** design
- **Clean, simple interface** without fancy effects
- **Responsive design** - works on mobile and desktop
- **Real-time message preview** in conversation list
- **User avatars** with fallback initials
- **Property titles** shown in conversation previews
- **Unread counts** for each conversation

### Sample Conversations Include:
1. **Sarah Johnson** ↔ **John Smith** - Modern 2BR Apartment in Masaki
2. **Michael Chen** ↔ **John Smith** - Family House in Mikocheni  
3. **Emma Wilson** ↔ **David Kumar** - Studio Apartment in Upanga
4. **James Mwangi** ↔ **John Smith** - Luxury Villa in Oyster Bay

## Key Design Features

### Data Structure
- **Denormalized participant names** - No additional API calls needed for conversation list
- **Separate unread counts** for tenants and landlords
- **Property context** embedded in each conversation
- **Optimized for DynamoDB** with predictable keys

### Contact Agent Flow
1. **Property page** - User clicks "Contact Agent"
2. **Authentication check** - Shows auth modal if not logged in
3. **Chat navigation** - Passes property context via URL params after login
4. **Conversation creation** - Automatically creates or finds existing conversation
5. **Pre-filled message** - Suggests appropriate inquiry text

### UX Flow
1. **Fast conversation list** - All data in single query
2. **Lazy message loading** - Messages only loaded when conversation opened
3. **Real-time previews** - Last message always visible
4. **Mobile-first design** - Smooth transitions between list and chat

## Toggle Between Views
Use the "Switch to Tenant/Landlord View" button to see how the same conversations look from different user perspectives.

## Technical Implementation
- **TypeScript interfaces** for type safety
- **Mock data** that matches production data structure  
- **Responsive Tailwind CSS** styling
- **Component-based architecture** for reusability
- **URL parameter handling** for property context
- **Automatic conversation management**