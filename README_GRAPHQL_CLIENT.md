# GraphQL Client Centralization

## 📋 Overview

This project is migrating from direct `generateClient()` usage to a centralized `GraphQLClient` class for all GraphQL operations.

## 🎯 Goals

1. **Single Source of Truth**: All GraphQL calls go through one centralized client
2. **Reduced Boilerplate**: ~70% less code for GraphQL operations
3. **Better Type Safety**: Generic types for better TypeScript support
4. **Easier Maintenance**: Change authentication logic once, affects everywhere
5. **Consistent Error Handling**: Standardized error messages across the app

## 📊 Current Status

**Progress**: 3/12 files migrated (25%)

Run the audit script to check current status:
```bash
cd ndotoniWeb
./scripts/audit-graphql-usage.sh
```

## 🚀 Quick Start

### For New Code

Always use the centralized client:

```typescript
import { GraphQLClient } from '@/lib/graphql-client';

// For authenticated operations (user must be logged in)
const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
  getProperty,
  { propertyId }
);

// For public operations (no auth required)
const data = await GraphQLClient.executePublic<{ listProperties: Property[] }>(
  listProperties,
  { limit: 10 }
);

// For auto-detect (try auth, fall back to public)
const data = await GraphQLClient.execute<{ getProperty: Property }>(
  getProperty,
  { propertyId }
);
```

### For Existing Code

See the migration documents:
1. `MIGRATION_EXAMPLE.md` - Real-world before/after examples
2. `GRAPHQL_CLIENT_MIGRATION.md` - Detailed migration guide
3. `MIGRATION_CHECKLIST.md` - Prioritized list of files to migrate

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README_GRAPHQL_CLIENT.md` | This file - overview and quick start |
| `MIGRATION_EXAMPLE.md` | Real-world examples with before/after code |
| `GRAPHQL_CLIENT_MIGRATION.md` | Comprehensive migration guide |
| `MIGRATION_CHECKLIST.md` | Prioritized list of files needing migration |
| `src/lib/graphql-client.ts` | The centralized client implementation |

## 🛠️ Available Methods

### `GraphQLClient.executeAuthenticated<T>(query, variables?)`
- **Use when**: User MUST be authenticated
- **Examples**: Update profile, create property, submit application
- **Throws**: Error if user is not authenticated

### `GraphQLClient.executePublic<T>(query, variables?)`
- **Use when**: Operation should work without authentication
- **Examples**: Browse properties, view public listings
- **Auth**: Always uses API Key

### `GraphQLClient.execute<T>(query, variables?)`
- **Use when**: Try authenticated first, fall back to public
- **Examples**: View property details (better experience if logged in)
- **Auth**: Auto-detects user authentication status

### `GraphQLClient.getRawClient()`
- **Use when**: Need direct access for subscriptions
- **Examples**: Real-time chat, live notifications
- **Note**: Use sparingly, prefer the static methods above

## 🔍 How to Check Your Code

### Check if a file needs migration:
```bash
# Search for old pattern
grep -n "generateClient" src/your-file.tsx
grep -n "client.graphql" src/your-file.tsx
```

### Check if a file is already migrated:
```bash
# Search for new pattern
grep -n "GraphQLClient\." src/your-file.tsx
```

## ✅ Migration Checklist

### High Priority (User-Facing)
- [ ] Property edit page
- [ ] Property create page
- [ ] Application page
- [ ] Media selector
- [ ] Media upload

### Medium Priority (Infrastructure)
- [ ] Chat context (9 occurrences)
- [ ] Auth context (6 remaining)
- [ ] Auth bridge
- [ ] Chat utilities

### Low Priority (Optimization)
- [ ] Cache layer

See `MIGRATION_CHECKLIST.md` for detailed breakdown.

## 🧪 Testing After Migration

After migrating a file, verify:

1. ✅ Functionality works as before
2. ✅ Error handling is appropriate
3. ✅ Authentication is properly enforced
4. ✅ No console errors
5. ✅ TypeScript compiles without errors
6. ✅ User experience is unchanged

## 💡 Best Practices

### ✅ Do This
```typescript
// Use the centralized client
import { GraphQLClient } from '@/lib/graphql-client';

// Use type-safe calls
const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
  getProperty,
  { propertyId }
);
```

### ❌ Don't Do This
```typescript
// Don't create new client instances
import { generateClient } from 'aws-amplify/api';
const client = generateClient();

// Don't manually check for errors
if ((response as any).errors) { ... }
```

## 🐛 Troubleshooting

### "Authentication required for this operation"
- You're using `executeAuthenticated` but user is not logged in
- Solution: Use `execute` for auto-detect or `executePublic` if auth is optional

### "Property X does not exist on type Y"
- Your generic type doesn't match the GraphQL response
- Solution: Check your GraphQL schema and update the type

### "Cannot read property 'data' of undefined"
- You're still using old pattern `(response as any).data`
- Solution: The new client returns data directly, no need to access `.data`

## 📞 Need Help?

1. Check the example files that are already migrated:
   - `src/contexts/AuthContext.tsx` (partially)
   - `src/app/landlord/media/page.tsx` (fully)

2. Review the migration documents in this directory

3. Run the audit script to see what needs attention

4. Look at `MIGRATION_EXAMPLE.md` for real-world patterns

## 🎓 Learning Resources

### Understanding the Pattern

**Old Way (Scattered)**:
- Each file creates its own client
- Manual error checking everywhere
- Inconsistent auth handling
- Lots of boilerplate

**New Way (Centralized)**:
- One client for the entire app
- Automatic error handling
- Consistent auth patterns
- Minimal boilerplate

### Code Comparison

**Before**: 15 lines per GraphQL call
```typescript
const client = generateClient();
const response = await client.graphql({
  query: myQuery,
  variables: { id }
});
if ((response as any).errors) {
  throw new Error('Failed');
}
const data = (response as any).data?.myQuery;
```

**After**: 4 lines per GraphQL call
```typescript
const data = await GraphQLClient.executeAuthenticated<{ myQuery: MyType }>(
  myQuery,
  { id }
);
```

**Savings**: 73% less code! 🎉

## 🗺️ Roadmap

- [x] Create centralized GraphQLClient
- [x] Migrate AuthContext (partial)
- [x] Migrate media library page
- [ ] Migrate high-priority user-facing pages
- [ ] Migrate infrastructure files
- [ ] Migrate optimization layers
- [ ] Remove all `generateClient` imports
- [ ] Celebrate! 🎉

---

**Last Updated**: January 2026
**Status**: In Progress (25% complete)
