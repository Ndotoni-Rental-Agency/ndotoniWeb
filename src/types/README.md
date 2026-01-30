# TypeScript Types

This directory contains TypeScript type definitions for the application.

## Profile Types (`profile.ts`)

Contains properly typed interfaces for profile-related functionality:

- `ProfileFormData`: Interface for profile form data with all user fields
- `LocationChangeData`: Interface for location updates
- `ProfileUpdateResult`: Interface for profile update responses
- Type guards: `isTenant`, `isLandlord`, `isAdmin`, `isAgent`
- Helper functions: `createFormDataFromUser`, `convertFormDataToUpdateInput`

## Usage

Import types from this directory instead of using `any` types:

```typescript
import { ProfileFormData, UserProfile } from '@/types/profile';
import { UpdateUserInput } from '@/API';

// Good - properly typed
const formData: ProfileFormData = createFormDataFromUser(user);
const updateInput: UpdateUserInput = convertFormDataToUpdateInput(formData);

// Bad - avoid any types
const formData: any = { ... };
```

## Generated Types

The main GraphQL types are generated in `src/API.ts` from the GraphQL schema. Always prefer using these generated types over custom interfaces when possible.