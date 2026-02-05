# Property Subscription Testing Guide

Complete guide for testing the real-time property subscription system.

## Quick Test

### 1. Start Development Server

```bash
cd ndotoniWeb
npm run dev
```

### 2. Open Property Page

```
http://localhost:3000/property/[any-property-id]
```

### 3. Check Console

Look for these logs:
```
🔌 Setting up subscription for property: prop_xxx
✅ Subscription established for property: prop_xxx
```

### 4. Verify UI

- Look for "Live updates active" badge with green pulsing dot
- Badge should appear in the property details sidebar

## Detailed Testing

### Test 1: Subscription Connection

**Objective**: Verify subscription connects successfully

**Steps**:
1. Open property detail page
2. Open browser console (F12)
3. Check for connection logs

**Expected Results**:
```
🔌 Setting up subscription for property: prop_abc123
✅ Subscription established for property: prop_abc123
```

**UI Verification**:
- Green pulsing dot visible
- "Live updates active" text displayed
- No error messages

**Pass Criteria**: ✅ Connection established within 2 seconds

---

### Test 2: Receive Property Update

**Objective**: Verify updates are received and processed

**Prerequisites**: Backend access to trigger updates

**Steps**:
1. Open property detail page
2. Note current property details (price, availability, etc.)
3. Trigger property update from backend/admin
4. Observe console and UI

**Backend Trigger** (example):
```typescript
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

**Expected Console Output**:
```
📡 Property update received: {
  propertyId: 'prop_abc123',
  eventType: 'UPDATED',
  changes: [{ field: 'pricing.monthlyRent', oldValue: 500000, newValue: 550000 }],
  timestamp: '2026-02-05T10:30:00Z'
}
🔄 Property update received, refreshing data...
```

**Expected UI Changes**:
- Property data refreshes automatically
- New price displayed
- No page reload required

**Pass Criteria**: ✅ Update received and UI refreshed within 1 second

---

### Test 3: Multiple Subscribers (Same Property)

**Objective**: Verify single subscription handles multiple components

**Steps**:
1. Open property page in two browser tabs (same property)
2. Check console in both tabs
3. Trigger property update
4. Verify both tabs receive update

**Expected Behavior**:
- Only ONE GraphQL subscription created
- Both tabs receive the same update
- Both tabs refresh simultaneously

**Console Verification**:
```
Tab 1: ✅ Subscription established
Tab 2: ✅ Subscription established (reuses existing)
```

**Pass Criteria**: ✅ Single subscription, both tabs updated

---

### Test 4: Connection Recovery

**Objective**: Verify automatic reconnection on connection loss

**Steps**:
1. Open property page
2. Verify connection established
3. Simulate network disconnect:
   - Open DevTools → Network tab
   - Set throttling to "Offline"
4. Wait 5 seconds
5. Set throttling back to "Online"
6. Observe reconnection

**Expected Console Output**:
```
❌ Subscription error: Connection lost
🔌 Cleaning up subscription for property: prop_abc123
🔄 Attempting to reconnect subscription for: prop_abc123
🔌 Setting up subscription for property: prop_abc123
✅ Subscription established for property: prop_abc123
```

**Expected UI Changes**:
- "Live updates active" badge disappears during disconnect
- Badge reappears after reconnection
- No error messages shown to user

**Pass Criteria**: ✅ Reconnects within 10 seconds

---

### Test 5: Component Cleanup

**Objective**: Verify proper cleanup on component unmount

**Steps**:
1. Open property page
2. Verify subscription established
3. Navigate away from page
4. Check console for cleanup logs

**Expected Console Output**:
```
🔌 Cleaning up subscription for property: prop_abc123
```

**Memory Check**:
```typescript
// In console
PropertySubscriptionManager.getInstance().getActiveSubscriptionCount()
// Should return 0 after navigating away
```

**Pass Criteria**: ✅ Subscription cleaned up, no memory leaks

---

### Test 6: Error Handling

**Objective**: Verify graceful error handling

**Test 6a: Invalid Property ID**

**Steps**:
1. Navigate to `/property/invalid-id-12345`
2. Check console for errors
3. Verify UI shows appropriate message

**Expected Behavior**:
- Subscription attempts to connect
- Error logged but doesn't crash app
- User sees "Property not found" message

**Test 6b: Backend Error**

**Steps**:
1. Open property page
2. Simulate backend error (if possible)
3. Verify error handling

**Expected Console Output**:
```
❌ Subscription error: [error message]
```

**Expected UI**:
- Connection indicator shows disconnected
- No crash or blank screen
- User can still view cached property data

**Pass Criteria**: ✅ Errors handled gracefully, no crashes

---

### Test 7: Performance

**Objective**: Verify performance with multiple subscriptions

**Steps**:
1. Open 10 different property pages in separate tabs
2. Check memory usage in Task Manager
3. Verify all subscriptions are active
4. Trigger updates to different properties
5. Verify each tab receives only its property's updates

**Performance Metrics**:
```
Memory per subscription: ~1-2KB
Total memory (10 subscriptions): ~10-20KB
CPU usage: <1%
Network: 10 WebSocket connections
```

**Console Check**:
```typescript
PropertySubscriptionManager.getInstance().getActiveSubscriptionCount()
// Should return 10
```

**Pass Criteria**: 
- ✅ Memory usage < 50KB
- ✅ CPU usage < 5%
- ✅ All subscriptions active

---

### Test 8: Event Types

**Objective**: Verify all event types are handled

**Test Different Event Types**:

**8a: CREATED**
```typescript
eventType: 'CREATED'
```
Expected: New property appears in lists

**8b: UPDATED**
```typescript
eventType: 'UPDATED'
```
Expected: Property details refresh

**8c: PUBLISHED**
```typescript
eventType: 'PUBLISHED'
```
Expected: Property becomes visible

**8d: ARCHIVED**
```typescript
eventType: 'ARCHIVED'
```
Expected: Property marked as archived

**8e: DELETED**
```typescript
eventType: 'DELETED'
```
Expected: Property removed or redirect

**Pass Criteria**: ✅ All event types handled correctly

---

## Browser Compatibility Testing

### Test Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ | Full support |
| Firefox | Latest | ✅ | Full support |
| Safari | Latest | ✅ | Full support |
| Edge | Latest | ✅ | Full support |
| Mobile Safari | iOS 14+ | ✅ | Full support |
| Mobile Chrome | Latest | ✅ | Full support |

### Testing Steps

1. Open property page in each browser
2. Verify subscription connects
3. Trigger update
4. Verify update received
5. Check for console errors

---

## Network Conditions Testing

### Test Different Network Speeds

**Fast 3G**:
```
Download: 1.6 Mbps
Upload: 750 Kbps
Latency: 150ms
```
Expected: Connection established, updates received

**Slow 3G**:
```
Download: 400 Kbps
Upload: 400 Kbps
Latency: 400ms
```
Expected: Slower connection, but still functional

**Offline**:
```
No connection
```
Expected: Graceful degradation, reconnects when online

### DevTools Network Throttling

1. Open DevTools → Network tab
2. Select throttling profile
3. Test subscription behavior
4. Verify reconnection when back online

---

## Load Testing

### Simulate High Load

**Test 1: Many Concurrent Users**

```bash
# Use artillery or similar tool
artillery quick --count 100 --num 10 http://localhost:3000/property/prop_123
```

**Expected**:
- All users connect successfully
- Updates broadcast to all users
- No performance degradation

**Test 2: Rapid Updates**

```typescript
// Trigger 100 updates in 10 seconds
for (let i = 0; i < 100; i++) {
  await publishPropertyUpdate({
    propertyId: 'prop_123',
    eventType: 'UPDATED',
    changes: [{ field: 'viewCount', oldValue: i, newValue: i + 1 }],
  });
  await sleep(100);
}
```

**Expected**:
- All updates received
- UI remains responsive
- No memory leaks

---

## Automated Testing

### Unit Tests

```typescript
// test/PropertySubscriptionManager.test.ts
import { PropertySubscriptionManager } from '@/lib/subscriptions/PropertySubscriptionManager';

describe('PropertySubscriptionManager', () => {
  let manager: PropertySubscriptionManager;

  beforeEach(() => {
    manager = PropertySubscriptionManager.getInstance();
  });

  afterEach(() => {
    manager.cleanupAll();
  });

  test('should create singleton instance', () => {
    const instance1 = PropertySubscriptionManager.getInstance();
    const instance2 = PropertySubscriptionManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should subscribe to property updates', () => {
    const callback = jest.fn();
    const unsubscribe = manager.subscribe('prop-123', {
      onUpdate: callback,
    });

    expect(manager.isSubscribed('prop-123')).toBe(true);
    
    unsubscribe();
    expect(manager.isSubscribed('prop-123')).toBe(false);
  });

  test('should handle multiple subscribers', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    manager.subscribe('prop-123', { onUpdate: callback1 });
    manager.subscribe('prop-123', { onUpdate: callback2 });

    expect(manager.getActiveSubscriptionCount()).toBe(1); // Single subscription
  });

  test('should cleanup on unsubscribe', () => {
    const callback = jest.fn();
    const unsubscribe = manager.subscribe('prop-123', {
      onUpdate: callback,
    });

    expect(manager.isSubscribed('prop-123')).toBe(true);
    
    unsubscribe();
    
    expect(manager.isSubscribed('prop-123')).toBe(false);
    expect(manager.getActiveSubscriptionCount()).toBe(0);
  });
});
```

### Integration Tests

```typescript
// test/usePropertySubscription.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { usePropertySubscription } from '@/hooks/usePropertySubscription';

describe('usePropertySubscription', () => {
  test('should connect to subscription', async () => {
    const { result } = renderHook(() =>
      usePropertySubscription({
        propertyId: 'prop-123',
        onUpdate: jest.fn(),
      })
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  test('should cleanup on unmount', async () => {
    const { unmount } = renderHook(() =>
      usePropertySubscription({
        propertyId: 'prop-123',
        onUpdate: jest.fn(),
      })
    );

    unmount();

    const manager = PropertySubscriptionManager.getInstance();
    expect(manager.isSubscribed('prop-123')).toBe(false);
  });
});
```

### E2E Tests

```typescript
// e2e/property-subscription.spec.ts
import { test, expect } from '@playwright/test';

test('property subscription connects and receives updates', async ({ page }) => {
  // Navigate to property page
  await page.goto('/property/prop-123');

  // Wait for subscription to connect
  await page.waitForSelector('text=Live updates active');

  // Verify connection indicator
  const indicator = page.locator('text=Live updates active');
  await expect(indicator).toBeVisible();

  // Trigger property update (via API)
  // ... trigger update logic ...

  // Verify UI updates
  await page.waitForTimeout(1000);
  // ... verify updated content ...
});
```

---

## Debugging Tools

### Console Commands

```javascript
// Get subscription manager instance
const manager = PropertySubscriptionManager.getInstance();

// Check active subscriptions
manager.getActiveSubscriptionCount();

// Check if property is subscribed
manager.isSubscribed('prop-123');

// Check connection status
manager.isConnected('prop-123');

// Cleanup all subscriptions
manager.cleanupAll();
```

### Network Inspection

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Click on WebSocket connection
5. View Messages tab
6. Monitor real-time messages

**Message Types**:
- `connection_init` - Initial connection
- `connection_ack` - Connection acknowledged
- `start` - Start subscription
- `start_ack` - Subscription started
- `data` - Property update received
- `stop` - Stop subscription

---

## Troubleshooting Guide

### Issue: Subscription not connecting

**Symptoms**:
- No "Live updates active" badge
- Console shows connection errors

**Checks**:
1. Verify AppSync endpoint in `.env.local`
2. Check API key is valid
3. Verify property ID is correct
4. Check network connectivity

**Solution**:
```bash
# Verify environment variables
cat .env.local | grep APPSYNC

# Test AppSync endpoint
curl -X POST $NEXT_PUBLIC_APPSYNC_ENDPOINT \
  -H "x-api-key: $NEXT_PUBLIC_APPSYNC_API_KEY" \
  -d '{"query": "{ __typename }"}'
```

### Issue: Updates not received

**Symptoms**:
- Subscription connected
- Updates triggered but not received

**Checks**:
1. Verify backend is publishing events
2. Check property ID matches exactly
3. Verify WebSocket connection in Network tab
4. Check for JavaScript errors

**Debug**:
```typescript
// Add verbose logging
const { isConnected, error } = usePropertySubscription({
  propertyId,
  onUpdate: (event) => {
    console.log('📡 FULL EVENT:', JSON.stringify(event, null, 2));
  },
});

console.log('Connection:', { isConnected, error });
```

### Issue: Memory leaks

**Symptoms**:
- Memory usage grows over time
- Subscriptions not cleaned up

**Checks**:
1. Verify components cleanup on unmount
2. Check subscription count doesn't grow
3. Monitor memory in DevTools

**Debug**:
```typescript
// Monitor subscription count
setInterval(() => {
  const count = PropertySubscriptionManager.getInstance().getActiveSubscriptionCount();
  console.log('Active subscriptions:', count);
}, 5000);
```

---

## Test Checklist

### Pre-Deployment

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing complete
- [ ] Browser compatibility verified
- [ ] Network conditions tested
- [ ] Performance benchmarks met
- [ ] No console errors
- [ ] No memory leaks
- [ ] Documentation updated

### Post-Deployment

- [ ] Production subscription connects
- [ ] Updates received in production
- [ ] Monitoring dashboards show healthy metrics
- [ ] No error spikes in logs
- [ ] User feedback positive

---

## Success Metrics

### Performance

- Connection time: < 2 seconds
- Update latency: < 1 second
- Memory per subscription: < 2KB
- CPU usage: < 1%

### Reliability

- Connection success rate: > 99%
- Reconnection success rate: > 95%
- Update delivery rate: > 99.9%

### User Experience

- Visual indicator visible: 100%
- No crashes: 100%
- Smooth updates: 100%

---

**Last Updated**: February 5, 2026  
**Version**: 1.0.0  
**Status**: Ready for Testing
