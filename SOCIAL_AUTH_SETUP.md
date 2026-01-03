# Social Authentication Setup Guide

This guide explains how to set up Google and Facebook authentication for the ndotoni application.

## Prerequisites

1. Copy `.env.example` to `.env.local` in the `ndotoniWeb` directory
2. Configure your social authentication providers

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Configure the authorized origins:
   - `http://localhost:3000` (for development)
   - Your production domain
6. Configure the authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
7. Copy the Client ID and add it to your `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the Facebook Login product
4. Configure the Valid OAuth Redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
5. Copy the App ID and add it to your `.env.local`:
   ```
   NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
   ```

## Backend Integration

The social authentication requires backend support for the following GraphQL mutations:

### socialSignIn
```graphql
mutation SocialSignIn($provider: String!, $accessToken: String!) {
  socialSignIn(provider: $provider, accessToken: $accessToken) {
    accessToken
    refreshToken
    user {
      # User fields based on user type (Tenant/Landlord/Admin)
    }
  }
}
```

### socialSignUp
```graphql
mutation SocialSignUp($provider: String!, $accessToken: String!, $userType: String) {
  socialSignUp(provider: $provider, accessToken: $accessToken, userType: $userType) {
    accessToken
    refreshToken
    user {
      # User fields based on user type (Tenant/Landlord/Admin)
    }
  }
}
```

## How It Works

1. User clicks "Continue with Google" or "Continue with Facebook"
2. A popup window opens with the OAuth provider's authentication page
3. User completes authentication on the provider's site
4. Provider redirects to `/auth/callback` with access token
5. Callback page sends the token back to the parent window
6. Frontend sends the token to backend via GraphQL mutation
7. Backend validates the token with the provider and creates/authenticates user
8. User is signed in and redirected to the appropriate page

## Testing

1. Make sure your environment variables are set
2. Start the development server: `npm run dev`
3. Open the authentication modal
4. Click on a social login button
5. Complete the OAuth flow in the popup
6. Verify that the user is authenticated

## Troubleshooting

- **Popup blocked**: Make sure popups are allowed for your domain
- **Invalid client ID**: Verify your environment variables are correct
- **Redirect URI mismatch**: Ensure your OAuth app is configured with the correct callback URL
- **CORS issues**: Make sure your domain is added to the OAuth app's authorized origins