# Property Subscription Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              Property Detail Page Component                 │    │
│  │                                                             │    │
│  │  const { isConnected } = usePropertySubscription({         │    │
│  │    propertyId: 'prop_123',                                 │    │
│  │    onUpdate: (event) => refetchProperty()                  │    │
│  │  });                                                        │    │
│  │                                                             │    │
│  │  {isConnected && <LiveIndicator />}                        │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
│                             │                                        │
│                             │ uses                                   │
│                             ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │         usePropertySubscription Hook                        │    │
│  │                                                             │    │
│  │  • Manages subscription lifecycle                          │    │
│  │  • Tracks connection state                                 │    │
│  │  • Handles errors                                          │    │
│  │  • Auto cleanup on unmount                                 │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
│                             │                                        │
│                             │ delegates to                           │
│                             ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │      PropertySubscriptionManager (Singleton)                │    │
│  │                                                             │    │
│  │  subscriptions: Map<propertyId, {                          │    │
│  │    subscription: GraphQLSubscription,                      │    │
│  │    callbacks: Set<Function>,                               │    │
│  │    isConnected: boolean                                    │    │
│  │  }>                                                         │    │
│  │                                                             │    │
│  │  • Single subscription per property                        │    │
│  │  • Multiple callbacks per subscription                     │    │
│  │  • Auto reconnection on failure                            │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
│                             │                                        │
│                             │ GraphQL over WebSocket                 │
└─────────────────────────────┼────────────────────────────────────────┘
                              │
                              │ wss://
                              │
┌─────────────────────────────▼────────────────────────────────────────┐
│                      AWS AppSync GraphQL API                          │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  WebSocket Connection Manager                                        │
│  ├─ Connection: prop_123 → [client1, client2, ...]                  │
│  ├─ Connection: prop_456 → [client3, ...]                           │
│  └─ Connection: prop_789 → [client4, client5, ...]                  │
│                                                                       │
│  Subscription Resolver:                                              │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  subscription onPropertyUpdated($propertyId: ID!) {         │    │
│  │    onPropertyUpdated(propertyId: $propertyId) {            │    │
│  │      propertyId                                            │    │
│  │      eventType                                             │    │
│  │      property                                              │    │
│  │      changes { field oldValue newValue }                   │    │
│  │      timestamp                                             │    │
│  │    }                                                        │    │
│  │  }                                                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Mutation Resolver:                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  mutation publishPropertyUpdateEvent($input: ...) {         │    │
│  │    # Broadcasts to all subscribers of this propertyId      │    │
│  │    publishPropertyUpdateEvent(input: $input)               │    │
│  │  }                                                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ invoked by
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                        Backend Services                                │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Property Update Lambda                                      │   │
│  │                                                              │   │
│  │  async function updateProperty(propertyId, updates) {       │   │
│  │    // 1. Update DynamoDB                                    │   │
│  │    await dynamodb.update({ ... });                          │   │
│  │                                                              │   │
│  │    // 2. Publish subscription event                         │   │
│  │    await appsync.mutate({                                   │   │
│  │      mutation: publishPropertyUpdateEvent,                  │   │
│  │      variables: {                                           │   │
│  │        input: {                                             │   │
│  │          propertyId,                                        │   │
│  │          eventType: 'UPDATED',                              │   │
│  │          property: updatedProperty,                         │   │
│  │          changes: calculateChanges(old, new),               │   │
│  │          timestamp: new Date().toISOString()                │   │
│  │        }                                                     │   │
│  │      }                                                       │   │
│  │    });                                                       │   │
│  │  }                                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Admin API                                                   │   │
│  │  • Update property details                                   │   │
│  │  • Change availability                                       │   │
│  │  • Moderate content                                          │   │
│  │  → Triggers publishPropertyUpdateEvent                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Subscription Setup

```
User opens property page
         │
         ▼
usePropertySubscription hook initializes
         │
         ▼
PropertySubscriptionManager.subscribe(propertyId)
         │
         ├─ Check if subscription exists
         │  ├─ YES → Add callback to existing subscription
         │  └─ NO  → Create new GraphQL subscription
         │
         ▼
GraphQL subscription established with AppSync
         │
         ▼
WebSocket connection opened
         │
         ▼
onConnect callback fired
         │
         ▼
UI shows "Live updates active" indicator
```

### 2. Property Update Flow

```
Admin updates property
         │
         ▼
Lambda function processes update
         │
         ├─ Update DynamoDB
         │
         ├─ Calculate changes (old vs new)
         │
         └─ Call publishPropertyUpdateEvent mutation
                  │
                  ▼
         AppSync receives mutation
                  │
                  ├─ Validates IAM permissions
                  │
                  └─ Broadcasts to all subscribers of propertyId
                           │
                           ▼
         WebSocket message sent to all connected clients
                           │
                           ▼
         PropertySubscriptionManager receives event
                           │
                           ├─ Validates event
                           │
                           └─ Notifies all registered callbacks
                                    │
                                    ▼
         Component onUpdate callback fired
                                    │
                                    ├─ Log event
                                    │
                                    └─ Refresh property data
                                             │
                                             ▼
         UI updates with new data
```

### 3. Multiple Subscribers (Same Property)

```
Component A subscribes to prop_123
         │
         ▼
PropertySubscriptionManager creates subscription
         │
         ▼
GraphQL subscription established
         │
         ▼
Component B subscribes to prop_123 (same property)
         │
         ▼
PropertySubscriptionManager adds callback to existing subscription
         │
         ▼
NO new GraphQL subscription created! ✅
         │
         ▼
Property update received
         │
         ├─ Component A callback fired
         └─ Component B callback fired
```

### 4. Cleanup Flow

```
Component unmounts
         │
         ▼
usePropertySubscription cleanup
         │
         ▼
PropertySubscriptionManager.unsubscribe()
         │
         ├─ Remove callback from subscription
         │
         └─ Check if any callbacks remain
                  │
                  ├─ YES → Keep subscription alive
                  │
                  └─ NO  → Close GraphQL subscription
                           │
                           ▼
                  WebSocket connection closed
                           │
                           ▼
                  Resources freed
```

## Connection States

```
┌──────────────┐
│ Disconnected │ ◄─────────────────────┐
└──────┬───────┘                       │
       │                               │
       │ subscribe()                   │
       │                               │
       ▼                               │
┌──────────────┐                       │
│  Connecting  │                       │
└──────┬───────┘                       │
       │                               │
       │ WebSocket opened              │
       │                               │
       ▼                               │
┌──────────────┐                       │
│  Connected   │ ──────────────────────┤
└──────┬───────┘                       │
       │                               │
       │ Connection lost               │
       │                               │
       ▼                               │
┌──────────────┐                       │
│ Reconnecting │ ──────────────────────┤
└──────────────┘                       │
       │                               │
       │ Max retries / unsubscribe()   │
       │                               │
       └───────────────────────────────┘
```

## Subscription Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Lifecycle                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Mount                                                       │
│    │                                                         │
│    ├─ usePropertySubscription hook initializes              │
│    │                                                         │
│    ├─ PropertySubscriptionManager.subscribe()               │
│    │  │                                                      │
│    │  ├─ Create/reuse GraphQL subscription                  │
│    │  │                                                      │
│    │  ├─ Register callbacks                                 │
│    │  │                                                      │
│    │  └─ Return unsubscribe function                        │
│    │                                                         │
│    └─ Connection established                                │
│                                                              │
│  Active                                                      │
│    │                                                         │
│    ├─ Receive updates                                       │
│    │  │                                                      │
│    │  ├─ onUpdate callback fired                            │
│    │  │                                                      │
│    │  └─ Component re-renders with new data                 │
│    │                                                         │
│    └─ Handle errors                                         │
│       │                                                      │
│       ├─ onError callback fired                             │
│       │                                                      │
│       └─ Auto reconnection attempted                        │
│                                                              │
│  Unmount                                                     │
│    │                                                         │
│    ├─ useEffect cleanup runs                                │
│    │                                                         │
│    ├─ unsubscribe() called                                  │
│    │  │                                                      │
│    │  ├─ Remove callbacks                                   │
│    │  │                                                      │
│    │  └─ Close subscription if no more callbacks            │
│    │                                                         │
│    └─ Resources freed                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                      Error Scenarios                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Network Error                                               │
│    │                                                         │
│    ├─ WebSocket connection lost                             │
│    │                                                         │
│    ├─ onDisconnect callback fired                           │
│    │                                                         │
│    ├─ UI shows disconnected state                           │
│    │                                                         │
│    ├─ Wait 5 seconds                                        │
│    │                                                         │
│    └─ Attempt reconnection                                  │
│       │                                                      │
│       ├─ Success → onConnect callback fired                 │
│       │                                                      │
│       └─ Failure → Retry (max 3 times)                      │
│                                                              │
│  Invalid Property ID                                         │
│    │                                                         │
│    ├─ Subscription fails to establish                       │
│    │                                                         │
│    ├─ onError callback fired                                │
│    │                                                         │
│    └─ Error message shown in UI                             │
│                                                              │
│  Callback Error                                              │
│    │                                                         │
│    ├─ Error in onUpdate callback                            │
│    │                                                         │
│    ├─ Error caught and logged                               │
│    │                                                         │
│    └─ Other callbacks still execute ✅                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### Single Subscription Pattern

```
❌ Without Manager (Inefficient)
┌──────────────┐     ┌──────────────┐
│ Component A  │────▶│ Subscription │
└──────────────┘     │   prop_123   │
                     └──────────────┘
┌──────────────┐     ┌──────────────┐
│ Component B  │────▶│ Subscription │
└──────────────┘     │   prop_123   │
                     └──────────────┘
                     
2 components = 2 subscriptions = 2 WebSocket connections


✅ With Manager (Efficient)
┌──────────────┐     
│ Component A  │────┐
└──────────────┘    │
                    ├─▶┌──────────────┐
┌──────────────┐    │  │ Subscription │
│ Component B  │────┘  │   prop_123   │
└──────────────┘       └──────────────┘

2 components = 1 subscription = 1 WebSocket connection
```

### Resource Usage

```
┌─────────────────────────────────────────────────────────────┐
│                    Resource Comparison                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Without Manager:                                            │
│  • 10 components × 1 subscription each = 10 connections     │
│  • Memory: ~10KB per connection = 100KB                     │
│  • Network: 10 WebSocket connections                        │
│                                                              │
│  With Manager:                                               │
│  • 10 components → 1 subscription = 1 connection            │
│  • Memory: ~1KB + (10 × 0.1KB callbacks) = 2KB             │
│  • Network: 1 WebSocket connection                          │
│                                                              │
│  Savings: 98KB memory, 9 fewer connections ✅               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Subscription)                                     │
│  ├─ Authentication: API Key (public read access)            │
│  ├─ Authorization: Read-only                                │
│  └─ Data: Property details (no sensitive info)              │
│                                                              │
│  AppSync API                                                 │
│  ├─ Rate limiting: 1000 requests/minute                     │
│  ├─ Validation: Property ID format                          │
│  └─ Filtering: Only subscribed property updates             │
│                                                              │
│  Backend (Mutation)                                          │
│  ├─ Authentication: IAM role (Lambda only)                  │
│  ├─ Authorization: Write access                             │
│  └─ Validation: Full property validation                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Debugging

### Console Logs

```
🔌 Setting up subscription for property: prop_123
✅ Subscription established for property: prop_123
📡 Property update received: { propertyId, eventType, changes }
🔄 Property update received, refreshing data...
❌ Subscription error: Connection lost
🔌 Cleaning up subscription for property: prop_123
```

### Browser DevTools

```
Network Tab → WS (WebSocket)
├─ Connection: wss://xxx.appsync-realtime-api.amazonaws.com
├─ Status: 101 Switching Protocols
├─ Messages:
│  ├─ ▶ connection_init
│  ├─ ◀ connection_ack
│  ├─ ▶ start (subscription)
│  ├─ ◀ start_ack
│  ├─ ◀ data (property update)
│  └─ ▶ stop (unsubscribe)
└─ Closed
```

---

**Last Updated**: February 5, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
