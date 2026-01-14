# Real-World Migration Example

This document shows a complete before/after example of migrating a real file from the codebase.

## Example: Property Edit Page

### Before Migration

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { getProperty } from '@/graphql/queries';
import { updateProperty } from '@/graphql/mutations';
import { Property, UpdatePropertyInput } from '@/API';

const client = generateClient();

export default function EditPropertyPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const propertyId = params.id as string;

  const fetchProperty = async () => {
    try {
      const response = await client.graphql({
        query: getProperty,
        variables: { propertyId }
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        throw new Error((response as any).errors[0].message);
      }

      const data = (response as any).data?.getProperty;
      if (!data) {
        throw new Error('Property not found');
      }

      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: UpdatePropertyInput) => {
    try {
      setLoading(true);

      await client.graphql({
        query: updateProperty,
        variables: {
          propertyId,
          input: formData
        }
      });

      alert('Property updated successfully!');
      router.push('/landlord/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  // ... rest of component
}
```

### After Migration

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { updateProperty } from '@/graphql/mutations';
import { Property, UpdatePropertyInput } from '@/API';

export default function EditPropertyPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const propertyId = params.id as string;

  const fetchProperty = async () => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
        getProperty,
        { propertyId }
      );

      if (!data.getProperty) {
        throw new Error('Property not found');
      }

      setProperty(data.getProperty);
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: UpdatePropertyInput) => {
    try {
      setLoading(true);

      await GraphQLClient.executeAuthenticated<{ updateProperty: Property }>(
        updateProperty,
        {
          propertyId,
          input: formData
        }
      );

      alert('Property updated successfully!');
      router.push('/landlord/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  // ... rest of component
}
```

## Key Changes Explained

### 1. Import Changes
```diff
- import { generateClient } from 'aws-amplify/api';
+ import { GraphQLClient } from '@/lib/graphql-client';
```

### 2. Remove Client Instance
```diff
- const client = generateClient();
```
No longer needed! The centralized client is used directly.

### 3. Simplified API Calls
```diff
- const response = await client.graphql({
-   query: getProperty,
-   variables: { propertyId }
- });
- 
- // Check for GraphQL errors
- if ((response as any).errors && (response as any).errors.length > 0) {
-   throw new Error((response as any).errors[0].message);
- }
- 
- const data = (response as any).data?.getProperty;

+ const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
+   getProperty,
+   { propertyId }
+ );
+ const property = data.getProperty;
```

**Benefits:**
- No manual error checking needed
- Type-safe response with generics
- Automatic authentication handling
- Cleaner, more readable code

### 4. Lines of Code Comparison

**Before:** ~15 lines for a GraphQL call (with error handling)
**After:** ~4 lines for the same call

**Reduction:** ~73% less boilerplate code!

## Another Example: Public vs Authenticated

### Scenario: Property Listing (Public)

```typescript
// BEFORE - Manual auth detection
let authMode: 'userPool' | 'apiKey' = 'apiKey';
try {
  await getCurrentUser();
  authMode = 'userPool';
} catch {}

const response = await client.graphql({
  query: listProperties,
  variables: { limit: 20 },
  authMode,
});

// AFTER - Automatic auth detection
const data = await GraphQLClient.execute<{ listProperties: Property[] }>(
  listProperties,
  { limit: 20 }
);
```

### Scenario: User Profile (Authenticated Only)

```typescript
// BEFORE - Manual auth mode
const response = await client.graphql({
  query: getMe,
  authMode: 'userPool',
});

// AFTER - Explicit authentication requirement
const data = await GraphQLClient.executeAuthenticated<{ getMe: UserProfile }>(
  getMe
);
```

## Common Patterns

### Pattern 1: Fetch Data on Mount

```typescript
// BEFORE
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await client.graphql({
        query: myQuery,
        variables: { id }
      });
      const data = (response as any).data?.myQuery;
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, [id]);

// AFTER
useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await GraphQLClient.executeAuthenticated<{ myQuery: MyType }>(
        myQuery,
        { id }
      );
      setData(result.myQuery);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, [id]);
```

### Pattern 2: Form Submission

```typescript
// BEFORE
const handleSubmit = async (formData: FormData) => {
  try {
    const response = await client.graphql({
      query: createItem,
      variables: { input: formData }
    });
    
    if ((response as any).errors) {
      throw new Error('Failed to create item');
    }
    
    const item = (response as any).data?.createItem;
    return item;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// AFTER
const handleSubmit = async (formData: FormData) => {
  try {
    const result = await GraphQLClient.executeAuthenticated<{ createItem: Item }>(
      createItem,
      { input: formData }
    );
    return result.createItem;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

### Pattern 3: Conditional Rendering Based on Data

```typescript
// BEFORE
const [data, setData] = useState<MyType | null>(null);

useEffect(() => {
  const fetch = async () => {
    const response = await client.graphql({ query: myQuery });
    const result = (response as any).data?.myQuery;
    setData(result);
  };
  fetch();
}, []);

// AFTER
const [data, setData] = useState<MyType | null>(null);

useEffect(() => {
  const fetch = async () => {
    const result = await GraphQLClient.execute<{ myQuery: MyType }>(myQuery);
    setData(result.myQuery);
  };
  fetch();
}, []);
```

## Benefits Summary

1. **Less Code**: ~70% reduction in boilerplate
2. **Type Safety**: Generic types provide better IntelliSense
3. **Consistency**: Same pattern everywhere
4. **Maintainability**: Change auth logic in one place
5. **Error Handling**: Automatic and consistent
6. **Readability**: Intent is clearer (executeAuthenticated vs manual authMode)

## Next Steps

1. Pick a file from the migration checklist
2. Follow this pattern
3. Test thoroughly
4. Move to the next file

See `MIGRATION_CHECKLIST.md` for the full list of files to migrate.
