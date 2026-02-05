# Property Subscriptions - Quick Start Guide

Real-time property updates are now live! This guide will help you integrate property subscriptions into your components.

## 🚀 Quick Start

### 1. Basic Integration (Property Detail Page)

The property detail page (`/property/[id]`) already has subscriptions enabled:

```tsx
import { usePropertySubscription } from '@/hooks/usePropertySubscription';

const { isConnected, error } = usePropertySubscription({
  propertyId: 'property-123',
  onUpdate: (event) => {
    console.log('Property updated!', event);
    // Refresh your data here
  },
});
```

### 2. Show Live Indicator

Display connection status to users:

```tsx
{isConnected && (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
    <span>Live updates active</span>
  </div>
)}
```

### 3. Handle Updates

When a property is updated, you'll receive an event:

```tsx
onUpdate: (event) => {
  // Event contains:
  // - propertyId: string
  // - eventType: 'CREATED' | 'UPDATED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'
  // - property: full property object
  // - changes: array of field changes
  // - timestamp: ISO datetime
  
  // Refresh your property data
  refetchProperty();
}
```

## 📋 What's Included

### Files Created

1. **Hook**: `ndotoniWeb/src/hooks/usePropertySubscription.ts`
   - React hook for easy integration
   - Automatic cleanup
   - Connection state tracking

2. **Manager**: `ndotoniWeb/src/lib/subscriptions/PropertySubscriptionManager.ts`
   - Singleton subscription manager
   - Efficient resource management
   - Automatic reconnection

3. **Demo Component**: `ndotoniWeb/src/components/property/PropertySubscriptionDemo.tsx`
   - Example implementation
   - Shows event history
   - Connection status

4. **Documentation**: `ndotoniWeb/src/lib/subscriptions/README.md`
   - Complete API reference
   - Usage examples
   - Best practices

### Integration Points

- ✅ Property detail page (`/property/[id]/page.tsx`)
- ✅ Details sidebar with live indicator
- ✅ Automatic data refresh on updates

## 🎯 Use Cases

### 1. Property Detail Page (Already Implemented)

Users viewing a property get instant updates when:
- Price changes
- Availability changes
- Property details are updated
- Property is archived/deleted

### 2. Property Cards (Future)

```tsx
function PropertyCard({ property }) {
  usePropertySubscription({
    propertyId: property.propertyId,
    onUpdate: (event) => {
      // Update card in real-time
      updatePropertyInList(event.property);
    },
  });
  
  return <div>{/* Property card */}</div>;
}
```

### 3. Admin Dashboard (Future)

```tsx
function AdminPropertyList() {
  usePropertySubscription({
    propertyId: selectedPropertyId,
    onUpdate: (event) => {
      // Show notification
      toast.success(`Property ${event.eventType.toLowerCase()}`);
      // Refresh list
      refetchProperties();
    },
  });
}
```

## 🔧 Testing

### Manual Testing

1. **Open property detail page**
   ```
   http://localhost:3000/property/[some-property-id]
   ```

2. **Check for live indicator**
   - Should see "Live updates active" badge
   - Green pulsing dot indicates connection

3. **Update property from admin**
   - Change price, availability, or details
   - Page should update automatically

4. **Check console logs**
   ```
   🔌 Setting up subscription for property: prop_abc123
   ✅ Subscription established for property: prop_abc123
   📡 Property update received: { propertyId, eventType, changes }
   ```

### Backend Testing

To trigger an update from the backend:

```typescript
// In Lambda or resolver
await appsync.mutate({
  mutation: publishPropertyUpdateEvent,
  variables: {
    input: {
      propertyId: 'prop_abc123',
      eventType: 'UPDATED',
      property: updatedPropertyObject,
      changes: [
        {
          field: 'pricing.monthlyRent',
          oldValue: 500000,
          newValue: 550000,
        },
      ],
      timestamp: new Date().toISOString(),
    },
  },
});
```

## 📊 Monitoring

### Check Active Subscriptions

```typescript
import { PropertySubscriptionManager } from '@/lib/subscriptions/PropertySubscriptionManager';

const manager = PropertySubscriptionManager.getInstance();

// Get count of active subscriptions
console.log('Active subscriptions:', manager.getActiveSubscriptionCount());

// Check if specific property is subscribed
console.log('Is subscribed:', manager.isSubscribed('prop_abc123'));

// Check connection status
console.log('Is connected:', manager.isConnected('prop_abc123'));
```

### Browser DevTools

1. Open Network tab
2. Filter by "WS" (WebSocket)
3. Look for AppSync WebSocket connection
4. Monitor messages in real-time

## 🎨 UI Examples

### Minimal Indicator

```tsx
{isConnected && (
  <div className="flex items-center gap-1 text-xs text-emerald-600">
    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
    Live
  </div>
)}
```

### Full Status Badge

```tsx
<div className={`px-3 py-1 rounded-full text-xs font-medium ${
  isConnected 
    ? 'bg-emerald-100 text-emerald-700' 
    : 'bg-gray-100 text-gray-600'
}`}>
  {isConnected ? '🟢 Live' : '⚫ Offline'}
</div>
```

### With Animation

```tsx
{isConnected && (
  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
    <div className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </div>
    <span className="text-xs font-medium text-emerald-700">
      Live updates active
    </span>
  </div>
)}
```

## 🐛 Troubleshooting

### Subscription not connecting

**Check:**
1. AppSync API is configured correctly
2. API key is valid in `.env.local`
3. Property ID is valid
4. Browser console for errors

**Solution:**
```bash
# Verify environment variables
cat .env.local | grep NEXT_PUBLIC_

# Check AppSync endpoint
echo $NEXT_PUBLIC_APPSYNC_ENDPOINT
```

### Updates not received

**Check:**
1. Backend is publishing events correctly
2. Subscription is connected (`isConnected === true`)
3. Property ID matches exactly
4. WebSocket connection in Network tab

**Debug:**
```typescript
// Enable verbose logging
const { isConnected, error } = usePropertySubscription({
  propertyId,
  onUpdate: (event) => {
    console.log('📡 Full event:', JSON.stringify(event, null, 2));
  },
});

console.log('Connection status:', { isConnected, error });
```

### Memory leaks

**Check:**
1. Components cleanup on unmount (automatic with hook)
2. No manual subscriptions without cleanup
3. Subscription count doesn't grow indefinitely

**Monitor:**
```typescript
// Add to useEffect
useEffect(() => {
  const manager = PropertySubscriptionManager.getInstance();
  console.log('Active subscriptions:', manager.getActiveSubscriptionCount());
}, []);
```

## 🚀 Next Steps

1. **Test the implementation**
   - Open property detail page
   - Verify live indicator appears
   - Test with property updates

2. **Add to more components**
   - Property cards in search results
   - Landlord property list
   - Admin dashboard

3. **Enhance UX**
   - Show toast notifications on updates
   - Highlight changed fields
   - Add update animations

4. **Monitor performance**
   - Track subscription count
   - Monitor WebSocket health
   - Log update frequency

## 📚 Additional Resources

- [Full Documentation](./src/lib/subscriptions/README.md)
- [GraphQL Schema](../packages/schema/schemas/property/subscription-mutations.graphql)
- [AppSync Guide](./documentation/APPSYNC_AUTHENTICATION_GUIDE.md)

## 💡 Tips

- Only enable subscriptions when component is visible
- Use the React hook for automatic cleanup
- Handle connection errors gracefully
- Show connection status to users
- Test with slow network conditions

---

**Need help?** Check the full documentation or console logs for detailed debugging information.
