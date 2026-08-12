# Property Subscription System

Real-time property update subscriptions using GraphQL subscriptions.

## Overview

The property subscription system enables real-time updates for property details. When a property is updated (price change, availability, etc.), all connected clients receive instant notifications.

## Features

- ✅ **Real-time updates** - Instant property change notifications
- ✅ **Efficient resource management** - Single subscription per property, multiple subscribers
- ✅ **Automatic reconnection** - Handles connection drops gracefully
- ✅ **Connection state tracking** - Know when subscriptions are active
- ✅ **Type-safe** - Full TypeScript support

## Architecture

### Components

1. **PropertySubscriptionManager** - Singleton class managing all subscriptions
2. **usePropertySubscription** - React hook for easy component integration
3. **GraphQL Subscription** - `onPropertyUpdated(propertyId: ID!)`

### How It Works

```
┌─────────────────┐
│   Component A   │──┐
└─────────────────┘  │
                     │    ┌──────────────────────────┐
┌─────────────────┐  ├───▶│ PropertySubscription     │
│   Component B   │──┘    │ Manager                  │
└─────────────────┘       │ (Single Subscription)    │
                          └──────────┬───────────────┘
                                     │
                                     ▼
                          ┌──────────────────────────┐
                          │   AppSync GraphQL API    │
                          │   (WebSocket)            │
                          └──────────────────────────┘
```

## Usage

### Basic Usage (React Hook)

```tsx
import { usePropertySubscription } from '@/hooks/usePropertySubscription';

function PropertyDetail({ propertyId }: { propertyId: string }) {
  const { isConnected, error } = usePropertySubscription({
    propertyId,
    onUpdate: (event) => {
      console.log('Property updated:', event);
      // Refresh property data
      refetchProperty();
    },
    enabled: true, // Optional, default: true
  });

  return (
    <div>
      {isConnected && (
        <div className="live-indicator">
          🟢 Live updates active
        </div>
      )}
      {/* Property content */}
    </div>
  );
}
```

### Advanced Usage (Direct Manager)

```typescript
import { PropertySubscriptionManager } from '@/lib/subscriptions/PropertySubscriptionManager';

const manager = PropertySubscriptionManager.getInstance();

// Subscribe to property updates
const unsubscribe = manager.subscribe('property-123', {
  onUpdate: (event) => {
    console.log('Property updated:', event);
  },
  onError: (error) => {
    console.error('Subscription error:', error);
  },
  onConnect: () => {
    console.log('Connected to property updates');
  },
  onDisconnect: () => {
    console.log('Disconnected from property updates');
  },
});

// Later, cleanup
unsubscribe();
```

### Multiple Subscribers

Multiple components can subscribe to the same property without creating duplicate subscriptions:

```tsx
// Component A
usePropertySubscription({
  propertyId: 'property-123',
  onUpdate: (event) => updateSidebar(event),
});

// Component B (same property)
usePropertySubscription({
  propertyId: 'property-123',
  onUpdate: (event) => updateGallery(event),
});

// Only ONE GraphQL subscription is created!
```

## Event Structure

### PropertyUpdateEvent

```typescript
interface PropertyUpdateEvent {
  propertyId: string;
  eventType: 'CREATED' | 'UPDATED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  property: any; // Full property JSON
  changes: PropertyChange[];
  timestamp: string; // ISO 8601 datetime
}

interface PropertyChange {
  field: string;
  oldValue: any;
  newValue: any;
}
```

### Example Event

```json
{
  "propertyId": "prop_abc123",
  "eventType": "UPDATED",
  "property": { /* full property object */ },
  "changes": [
    {
      "field": "pricing.monthlyRent",
      "oldValue": 500000,
      "newValue": 550000
    },
    {
      "field": "availability.status",
      "oldValue": "AVAILABLE",
      "newValue": "RENTED"
    }
  ],
  "timestamp": "2026-02-05T10:30:00Z"
}
```

## Connection States

The subscription can be in one of these states:

- **Disconnected** - Not subscribed or connection lost
- **Connecting** - Establishing connection
- **Connected** - Active subscription receiving updates
- **Reconnecting** - Attempting to reconnect after error

## Error Handling

The system handles errors gracefully:

1. **Connection errors** - Automatic reconnection after 5 seconds
2. **Callback errors** - Isolated, won't affect other subscribers
3. **Network issues** - Transparent reconnection

```tsx
const { isConnected, error } = usePropertySubscription({
  propertyId,
  onUpdate: (event) => {
    // Handle update
  },
});

if (error) {
  console.error('Subscription error:', error);
}
```

## Best Practices

### ✅ Do

- Enable subscriptions only when needed (use `enabled` prop)
- Handle connection state in UI (show live indicator)
- Cleanup subscriptions when component unmounts (automatic with hook)
- Use the hook for React components
- Use the manager for non-React code

### ❌ Don't

- Create multiple subscriptions for the same property manually
- Forget to handle errors
- Subscribe to properties that aren't displayed
- Keep subscriptions active when navigating away

## Performance

- **Efficient** - Single WebSocket connection per property
- **Lightweight** - Minimal overhead (~1KB gzipped)
- **Scalable** - Handles hundreds of concurrent subscriptions

## Backend Integration

The subscription connects to the AppSync GraphQL API:

```graphql
subscription OnPropertyUpdated($propertyId: ID!) {
  onPropertyUpdated(propertyId: $propertyId) {
    propertyId
    eventType
    property
    changes {
      field
      oldValue
      newValue
    }
    timestamp
  }
}
```

### Publishing Updates (Backend)

To publish property updates from the backend:

```typescript
// Lambda function or resolver
await appsync.mutate({
  mutation: publishPropertyUpdateEvent,
  variables: {
    input: {
      propertyId: 'prop_abc123',
      eventType: 'UPDATED',
      property: updatedProperty,
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

## Testing

### Manual Testing

1. Open property detail page
2. Check for "Live updates active" indicator
3. Update property from admin panel
4. Verify page updates automatically

### Automated Testing

```typescript
import { PropertySubscriptionManager } from '@/lib/subscriptions/PropertySubscriptionManager';

describe('PropertySubscriptionManager', () => {
  it('should subscribe to property updates', () => {
    const manager = PropertySubscriptionManager.getInstance();
    const callback = jest.fn();
    
    const unsubscribe = manager.subscribe('prop-123', {
      onUpdate: callback,
    });
    
    expect(manager.isSubscribed('prop-123')).toBe(true);
    
    unsubscribe();
    expect(manager.isSubscribed('prop-123')).toBe(false);
  });
});
```

## Troubleshooting

### Subscription not connecting

1. Check AppSync API configuration
2. Verify API key is valid
3. Check browser console for errors
4. Ensure property ID is valid

### Updates not received

1. Verify backend is publishing events
2. Check subscription is connected (`isConnected === true`)
3. Verify property ID matches
4. Check network tab for WebSocket connection

### Memory leaks

1. Ensure components cleanup subscriptions on unmount
2. Use the React hook (automatic cleanup)
3. Call `unsubscribe()` when using manager directly

## Future Enhancements

- [ ] Batch updates for multiple properties
- [ ] Offline support with queue
- [ ] Subscription analytics
- [ ] Custom retry strategies
- [ ] Connection quality indicators

## Status

⚠️ This module is fully implemented and accurate to this doc, but as of this writing has
**zero call sites** anywhere in `src/app`/`src/components` — it isn't wired into any page.
See [`docs/architecture.md` § known gaps](../../../docs/architecture.md#known-gaps--dead-code)
in this repo for the up-to-date status before assuming this feature is live in production.

## Related Documentation

- [`docs/architecture.md`](../../../docs/architecture.md) and
  [`docs/graphql-and-caching.md`](../../../docs/graphql-and-caching.md) in this repo.
- The backend's GraphQL schema for the `onPropertyUpdated` subscription lives in the
  [`ndotoniBackend`](https://github.com/Ndotoni-Rental-Agency/ndotoniBackend) repo under
  `packages/schema/schemas/property/`.
