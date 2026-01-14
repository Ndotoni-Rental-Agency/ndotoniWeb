# GraphQL Client Migration Guide

## Overview

This guide helps you migrate from direct `generateClient()` usage to the centralized `GraphQLClient` class.

## Why Centralize?

### Benefits:
1. **Single Source of Truth**: All GraphQL calls go through one place
2. **Easier Maintenance**: Change authentication logic once, affects everywhere
3. **Consistent Error Handling**: Standardized error messages and handling
4. **Type Safety**: Better TypeScript support with generic types
5. **Reduced Boilerplate**: No need to handle auth mode in every file
6. **Future-Proof**: Easy to add logging, caching, or retry logic globally

## Migration Steps

### Step 1: Remove Old Imports

**Before:**
```typescript
import { generateClient } from 'aws-amplify/api';
const client = generateClient();
```

**After:**
```typescript
import { GraphQLClient } from '@/lib/graphql-client';
```

### Step 2: Replace Client Calls

#### For Authenticated Operations (User Must Be Logged In)

**Before:**
```typescript
const response = await client.graphql({
  query: getProperty,
  variables: { propertyId },
  authMode: 'userPool',
});
const data = (response as any).data?.getProperty;
```

**After:**
```typescript
const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
  getProperty,
  { propertyId }
);
const property = data.getProperty;
```

#### For Public Operations (No Auth Required)

**Before:**
```typescript
const response = await client.graphql({
  query: listProperties,
  variables: { limit: 10 },
  authMode: 'apiKey',
});
const data = (response as any).data?.listProperties;
```

**After:**
```typescript
const data = await GraphQLClient.executePublic<{ listProperties: Property[] }>(
  listProperties,
  { limit: 10 }
);
const properties = data.listProperties;
```

#### For Auto-Detect Operations (Try Auth, Fall Back to Public)

**Before:**
```typescript
let authMode: 'userPool' | 'apiKey' = 'apiKey';
try {
  await getCurrentUser();
  authMode = 'userPool';
} catch {}

const response = await client.graphql({
  query: getProperty,
  variables: { propertyId },
  authMode,
});
```

**After:**
```typescript
const data = await GraphQLClient.execute<{ getProperty: Property }>(
  getProperty,
  { propertyId }
);
```

### Step 3: Remove Manual Error Checking

The centralized client handles GraphQL errors automatically.

**Before:**
```typescript
const response = await client.graphql({
  query: updateProperty,
  variables: { input },
});

if ((response as any).errors && (response as any).errors.length > 0) {
  throw new Error((response as any).errors[0].message);
}

const data = (response as any).data?.updateProperty;
```

**After:**
```typescript
const data = await GraphQLClient.executeAuthenticated<{ updateProperty: Property }>(
  updateProperty,
  { input }
);
const property = data.updateProperty;
```

## Files That Need Migration

### High Priority (User-Facing Features)
- [ ] `src/app/landlord/properties/[id]/edit/page.tsx`
- [ ] `src/app/landlord/properties/create/page.tsx`
- [ ] `src/app/property/[id]/apply/page.tsx`
- [ ] `src/components/media/MediaSelector.tsx`
- [ ] `src/components/media/MediaUpload.tsx`
- [ ] `src/contexts/ChatContext.tsx`

### Medium Priority (Core Infrastructure)
- [ ] `src/contexts/AuthContext.tsx` (partially done)
- [ ] `src/lib/auth-bridge.ts`
- [ ] `src/lib/cache.ts`
- [ ] `src/lib/utils/chat.ts`

### Low Priority (Already Centralized)
- ✅ `src/lib/graphql-client.ts` (this is the centralized client)
- ✅ `src/app/landlord/media/page.tsx` (already migrated)

## Quick Reference

### Method Selection Guide

| Use Case | Method | Example |
|----------|--------|---------|
| User must be logged in | `executeAuthenticated` | Update profile, create property |
| Public access only | `executePublic` | Browse properties, view listings |
| Try auth, fall back to public | `execute` | View property details |
| Need subscriptions | `getRawClient()` | Real-time chat, notifications |

### Type Safety Example

```typescript
// Define your expected response type
interface GetPropertyResponse {
  getProperty: Property;
}

// Use it with the client
const data = await GraphQLClient.executeAuthenticated<GetPropertyResponse>(
  getProperty,
  { propertyId }
);

// Now TypeScript knows the structure
const property = data.getProperty; // Type: Property
```

## Testing After Migration

1. **Test authenticated operations**: Log in and perform user-specific actions
2. **Test public operations**: Log out and browse public content
3. **Test error handling**: Try operations without auth when required
4. **Check console**: Ensure no GraphQL errors are logged

## Common Pitfalls

### ❌ Don't Do This
```typescript
// Don't create new client instances
const client = generateClient();
```

### ✅ Do This Instead
```typescript
// Use the centralized client
import { GraphQLClient } from '@/lib/graphql-client';
```

### ❌ Don't Do This
```typescript
// Don't manually check for errors
if (response.errors) { ... }
```

### ✅ Do This Instead
```typescript
// Let the client handle errors
try {
  const data = await GraphQLClient.executeAuthenticated(...);
} catch (error) {
  // Handle the error
}
```

## Need Help?

If you encounter issues during migration:
1. Check the method you're using matches your auth requirements
2. Verify your query/mutation is imported correctly
3. Ensure your type definitions match the GraphQL schema
4. Look at already-migrated files for examples (e.g., `AuthContext.tsx`, `landlord/media/page.tsx`)
