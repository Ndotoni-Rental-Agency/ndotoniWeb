# Authentication & Profile Components

This directory contains components for authentication and user profile management in the nest application.

## Authentication Components

### AuthModal
- Main authentication modal with multiple modes (signin, signup, forgot password, etc.)
- Handles social authentication (Google, Facebook)
- Form validation and error handling

### Form Components
- **SignInForm**: User sign-in with email/password
- **SignUpForm**: User registration with validation
- **ForgotPasswordForm**: Password reset request
- **VerifyEmailForm**: Email verification with code
- **ResetPasswordForm**: Password reset with verification code
- **SocialAuthButtons**: Google and Facebook authentication

### BecomeLandlordModal
- Landlord application form
- Document upload and verification

## Profile Components

### ProfileForm
- Handles user profile information editing (name, phone, business name for landlords)
- Includes form validation and error handling
- Updates user data through GraphQL mutation

### AccountSettings
- Displays account information and settings
- Language and currency preferences
- Account status and metadata
- Danger zone with sign out functionality

### ProfileAvatar
- Reusable avatar component with initials fallback
- Supports profile images when available

## Features

- **Real-time Updates**: All changes are immediately reflected in the UI
- **Form Validation**: Client-side validation with helpful error messages
- **Loading States**: Visual feedback during API calls
- **Success/Error Messages**: Clear feedback for user actions
- **Responsive Design**: Works on all device sizes
- **Type Safety**: Full TypeScript support with proper interfaces

## Usage

```tsx
import { AuthModal, ProfileForm, AccountSettings, ProfileAvatar } from '@/components/auth';

// Authentication
<AuthModal isOpen={isOpen} onClose={onClose} initialMode="signin" />

// Profile management
<ProfileForm user={user} />
<AccountSettings user={user} />
<ProfileAvatar user={user} size="lg" />
```

## Authentication

All profile components require an authenticated user. The profile page includes route protection to redirect unauthenticated users.

## GraphQL Integration

Components use mutations from the AuthContext to persist changes to the backend:
- `signIn`, `signUp` for authentication
- `updateUser` for profile updates
- `verifyEmail`, `resetPassword` for account verification