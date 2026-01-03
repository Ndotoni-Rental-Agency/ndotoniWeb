# React Hooks

This directory contains custom React hooks organized by functionality and purpose.

## Hook Organization

### Authentication Hooks
- **`useAuthModal.ts`** - UI state management for authentication modals and forms
  - Handles modal modes, form validation, error states
  - Used in: Authentication modals, sign-in/sign-up forms

### Property Hooks
- **`useCreatePropertyForm.ts`** - Complex form state management for property creation
  - Handles nested form data, validation, section updates
  - Used in: Property creation wizard, property editing forms

- **`useProperty.ts`** - General property operations (4 hooks in one file)
  - `usePropertyFavorites` - Favorite properties management
  - `usePropertyFilters` - Search filters with location dependencies
  - `usePropertySearch` - Property search functionality
  - `usePropertyCards` - Property data fetching with GraphQL/JSON fallback
  - Used in: Property listings, search pages, home page

- **`usePropertySubscriptions.ts`** - Real-time property updates via WebSocket
  - Manages subscription connections, handles real-time events
  - Used in: Property detail pages, live property updates

### UI Hooks
- **`useScrollPosition.ts`** - Scroll position tracking for UI changes
  - Tracks scroll threshold for sticky headers, scroll-to-top buttons
  - Used in: Headers, navigation components

## Design Principles

### Why Hooks Are Separated

1. **Single Responsibility**: Each hook has a clear, focused purpose
2. **Different Lifecycles**: Form hooks vs. data hooks vs. real-time hooks
3. **Bundle Optimization**: Import only what you need
4. **Maintainability**: Easier to test and modify individual concerns

### Hook Categories

| Category | Purpose | Lifecycle | Usage Pattern |
|----------|---------|-----------|---------------|
| **Form Hooks** | State management for complex forms | Component session | Form components |
| **Data Hooks** | API calls, caching, data operations | Page/component lifecycle | Multiple components |
| **Real-time Hooks** | WebSocket, subscriptions | Connection-based | Specific features |
| **UI Hooks** | User interface state and behavior | Component lifecycle | UI components |

## Usage Examples

### Property Operations
```typescript
// Data fetching and management
const { properties, fetchProperties } = usePropertyCards();
const { toggleFavorite, isFavorited } = usePropertyFavorites();
const { filters, updateFilter } = usePropertyFilters();

// Form management
const { formData, updateSection } = useCreatePropertyForm();

// Real-time updates
const { subscribeToProperty } = usePropertySubscriptions({
  onPropertyUpdate: (update) => console.log('Property updated:', update)
});
```

### Authentication
```typescript
// Global auth state
const { user, signIn, signOut } = useAuth();

// Modal UI state
const { mode, loading, error, handleSignIn, switchMode } = useAuthModal();
```

## Best Practices

1. **Keep hooks focused** - One responsibility per hook
2. **Use descriptive names** - Clear what the hook does
3. **Handle loading and error states** - Provide good UX
4. **Optimize with useCallback/useMemo** - Prevent unnecessary re-renders
5. **Clean up side effects** - Prevent memory leaks

## When to Create New Hooks

Create a new hook when you have:
- **Reusable stateful logic** across multiple components
- **Complex state management** that would clutter components
- **Side effects** that need cleanup (subscriptions, timers)
- **API calls** with loading/error states

## When NOT to Create Hooks

Don't create hooks for:
- **Simple state** that's only used in one component
- **One-time operations** without reusability
- **Pure functions** without state or effects
- **Component-specific logic** that won't be reused