# GraphQL Client Centralization - Documentation Index

## 🎯 Start Here

New to this centralization effort? Start with these documents in order:

1. **[CENTRALIZATION_SUMMARY.md](./CENTRALIZATION_SUMMARY.md)** - Complete overview of what we've done and why
2. **[README_GRAPHQL_CLIENT.md](./README_GRAPHQL_CLIENT.md)** - Quick start guide and best practices
3. **[MIGRATION_EXAMPLE.md](./MIGRATION_EXAMPLE.md)** - Real-world before/after examples

## 📚 Documentation

### Overview & Getting Started
- **[CENTRALIZATION_SUMMARY.md](./CENTRALIZATION_SUMMARY.md)**
  - What we've built
  - Current status (3/12 files, 25% complete)
  - Benefits and metrics
  - Next steps

- **[README_GRAPHQL_CLIENT.md](./README_GRAPHQL_CLIENT.md)**
  - Quick start for new code
  - Available methods reference
  - Best practices
  - Troubleshooting guide

### Migration Guides
- **[MIGRATION_EXAMPLE.md](./MIGRATION_EXAMPLE.md)**
  - Real file before/after comparison
  - Common patterns
  - Code reduction examples (73% less code!)

- **[GRAPHQL_CLIENT_MIGRATION.md](./GRAPHQL_CLIENT_MIGRATION.md)**
  - Step-by-step migration instructions
  - Method selection guide
  - Type safety examples

- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)**
  - Prioritized list of files to migrate
  - Progress tracking
  - Testing checklist

## 🛠️ Tools

### Audit Script
**Location**: `scripts/audit-graphql-usage.sh`

**Purpose**: Check which files need migration

**Usage**:
```bash
cd ndotoniWeb
./scripts/audit-graphql-usage.sh
```

**Output**:
- Files using `generateClient()`
- Files using `client.graphql()`
- Files already using `GraphQLClient`
- Summary statistics

### VS Code Snippets
**Location**: `.vscode/graphql-client.code-snippets`

**Available Snippets**:
- `gqlauth` - Authenticated GraphQL call
- `gqlpublic` - Public GraphQL call
- `gqlauto` - Auto-detect GraphQL call
- `impgql` - Import GraphQLClient
- `gqlfetch` - Complete fetch pattern with loading/error handling
- `gqlsubmit` - Complete submit pattern with loading/error handling

**Usage**: Type the prefix and press Tab in any TypeScript/React file

## 🔧 Implementation

### Core Client
**Location**: `src/lib/graphql-client.ts`

**Methods**:
- `executeAuthenticated<T>()` - Requires user authentication
- `executePublic<T>()` - Public access with API Key
- `execute<T>()` - Auto-detects authentication
- `getRawClient()` - For subscriptions and advanced use

## 📊 Current Status

### Progress: 3/12 files (25%)

#### ✅ Completed
- `src/contexts/AuthContext.tsx` (partial)
- `src/app/landlord/media/page.tsx` (full)
- `src/contexts/CognitoAuthContext.tsx` (already centralized)

#### 🔴 High Priority (5 files)
User-facing features that should be migrated first

#### 🟡 Medium Priority (4 files)
Infrastructure and core functionality

#### 🟢 Low Priority (1 file)
Optimization layers

See [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) for details.

## 🚀 Quick Reference

### For Writing New Code

```typescript
import { GraphQLClient } from '@/lib/graphql-client';

// Authenticated operation
const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
  getProperty,
  { propertyId }
);

// Public operation
const data = await GraphQLClient.executePublic<{ listProperties: Property[] }>(
  listProperties,
  { limit: 10 }
);
```

### For Migrating Existing Code

1. Remove: `import { generateClient } from 'aws-amplify/api';`
2. Remove: `const client = generateClient();`
3. Add: `import { GraphQLClient } from '@/lib/graphql-client';`
4. Replace: `client.graphql({...})` with `GraphQLClient.executeAuthenticated<T>(...)`
5. Remove: Manual error checking
6. Test!

## 📖 Learning Path

### Day 1: Understanding
1. Read [CENTRALIZATION_SUMMARY.md](./CENTRALIZATION_SUMMARY.md)
2. Read [README_GRAPHQL_CLIENT.md](./README_GRAPHQL_CLIENT.md)
3. Run `./scripts/audit-graphql-usage.sh`

### Day 2: Examples
1. Read [MIGRATION_EXAMPLE.md](./MIGRATION_EXAMPLE.md)
2. Study migrated files:
   - `src/app/landlord/media/page.tsx`
   - `src/contexts/AuthContext.tsx`
3. Try VS Code snippets

### Day 3: Practice
1. Pick one high-priority file
2. Follow [GRAPHQL_CLIENT_MIGRATION.md](./GRAPHQL_CLIENT_MIGRATION.md)
3. Migrate the file
4. Test thoroughly
5. Update [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

### Week 2+: Migration
1. Continue with high-priority files
2. Move to medium-priority files
3. Finish with low-priority files
4. Celebrate! 🎉

## 🎯 Goals & Benefits

### Goals
- ✅ Single source of truth for GraphQL operations
- ✅ Reduce boilerplate code by ~70%
- ✅ Improve type safety
- ✅ Consistent error handling
- ✅ Easier maintenance

### Benefits Achieved
- **Code Reduction**: 15 lines → 4 lines per call (73% reduction)
- **Type Safety**: Full TypeScript support with generics
- **Consistency**: Same pattern everywhere
- **Maintainability**: Change auth logic in one place
- **Developer Experience**: VS Code snippets, better IntelliSense

## 🔍 Finding Information

### "How do I...?"

| Question | Document | Section |
|----------|----------|---------|
| Get started with new code? | README_GRAPHQL_CLIENT.md | Quick Start |
| Migrate existing code? | MIGRATION_EXAMPLE.md | Real-World Examples |
| Choose the right method? | GRAPHQL_CLIENT_MIGRATION.md | Method Selection Guide |
| Track migration progress? | MIGRATION_CHECKLIST.md | Checklist |
| Understand the benefits? | CENTRALIZATION_SUMMARY.md | Benefits |
| Use VS Code snippets? | This file | Tools → VS Code Snippets |
| Check what needs migration? | Run audit script | `./scripts/audit-graphql-usage.sh` |

### "What is...?"

| Term | Meaning |
|------|---------|
| `executeAuthenticated` | Method requiring user to be logged in |
| `executePublic` | Method for public/guest access |
| `execute` | Method that auto-detects auth status |
| `getRawClient` | Access to underlying Amplify client |
| Centralization | Using one client instead of many |
| Migration | Converting old code to new pattern |

## 📞 Support

### Troubleshooting
See [README_GRAPHQL_CLIENT.md](./README_GRAPHQL_CLIENT.md#-troubleshooting)

### Examples
See [MIGRATION_EXAMPLE.md](./MIGRATION_EXAMPLE.md)

### Common Issues
1. **"Authentication required"** → Use `execute` or `executePublic` instead
2. **Type errors** → Check your generic type matches GraphQL schema
3. **Can't find data** → Don't access `.data`, it's returned directly

## 📈 Metrics

Track your progress:
- Files migrated: 3/12 (25%)
- Code reduction: ~73% per GraphQL call
- Lines saved: ~11 lines per call × number of calls
- Developer velocity: Faster with snippets and less boilerplate

## 🎓 Additional Resources

### Code Examples
- Migrated files in `src/`
- VS Code snippets in `.vscode/`
- Examples in documentation

### Tools
- Audit script: `scripts/audit-graphql-usage.sh`
- VS Code snippets: Type `gql` + Tab
- TypeScript: Full IntelliSense support

### Documentation
All markdown files in `ndotoniWeb/` directory

---

## Quick Links

- [📋 Summary](./CENTRALIZATION_SUMMARY.md)
- [🚀 Quick Start](./README_GRAPHQL_CLIENT.md)
- [📝 Examples](./MIGRATION_EXAMPLE.md)
- [📖 Migration Guide](./GRAPHQL_CLIENT_MIGRATION.md)
- [✅ Checklist](./MIGRATION_CHECKLIST.md)
- [🔧 Implementation](./src/lib/graphql-client.ts)

---

**Last Updated**: January 2026  
**Status**: Ready for migration  
**Progress**: 3/12 files (25%)  
**Next**: Migrate high-priority user-facing files
