'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  verifyEmail as verifyEmailMutation, 
  forgotPassword as forgotPasswordMutation, 
  resetPassword as resetPasswordMutation, 
  resendVerificationCode as resendVerificationCodeMutation,
  updateUser as updateUserMutation, 
  submitLandlordApplication as submitLandlordApplicationMutation
} from '@/graphql/mutations';
import { getMe } from '@/graphql/queries';
import { 
  UserProfile, 
  UserType, 
  ApplicationResponse
} from '@/API';
import { GraphQLClient } from '@/lib/graphql-client';
import { extractErrorMessage } from '@/lib/utils/errorUtils';
import { deleteCookie } from '@/lib/utils/cookies';

// Type alias for convenience
type User = UserProfile;

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ requiresVerification?: boolean }>;
  signInWithSocial: (provider: 'google' | 'facebook') => Promise<void>;
  signUpWithSocial: (provider: 'google' | 'facebook', userType?: UserType) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  updateUser: (input: UpdateUserInput) => Promise<UserProfile>;
  submitLandlordApplication: (applicationData: any) => Promise<ApplicationResponse>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  setLocalUser: (patch: Partial<UserProfile>) => void;
}

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  language?: string;
  currency?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  businessName?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get social access token
const getSocialAccessToken = async (provider: 'google' | 'facebook'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (provider === 'google') {
      // Google OAuth implementation
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        reject(new Error('Google Client ID not configured'));
        return;
      }
      
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
      const scope = encodeURIComponent('openid email profile');
      const responseType = 'token';
      const state = 'google';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}&include_granted_scopes=true`;
      
      // Open popup window
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        reject(new Error('Failed to open authentication popup. Please allow popups for this site.'));
        return;
      }
      
      // Listen for popup messages
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          popup?.close();
          resolve(event.data.accessToken);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          popup?.close();
          reject(new Error(event.data.error || 'Google authentication failed'));
        }
      };
      
      window.addEventListener('message', messageListener);
      
      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
      
    } else if (provider === 'facebook') {
      // Facebook OAuth implementation
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
      if (!appId) {
        reject(new Error('Facebook App ID not configured'));
        return;
      }
      
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
      const scope = encodeURIComponent('email,public_profile');
      const state = 'facebook';
      
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&state=${state}`;
      
      // Open popup window
      const popup = window.open(authUrl, 'facebook-auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        reject(new Error('Failed to open authentication popup. Please allow popups for this site.'));
        return;
      }
      
      // Listen for popup messages
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          popup?.close();
          resolve(event.data.accessToken);
        } else if (event.data.type === 'FACEBOOK_AUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          popup?.close();
          reject(new Error(event.data.error || 'Facebook authentication failed'));
        }
      };
      
      window.addEventListener('message', messageListener);
      
      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
    } else {
      reject(new Error('Unsupported provider'));
    }
  });
};

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to store auth data (Cognito manages tokens)
  const storeAuthData = (user: UserProfile) => {
    // Only store user data - Cognito manages tokens internally
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update state (tokens are managed by Cognito)
    setAuthState({
      user,
      accessToken: 'COGNITO_MANAGED', // Placeholder - Cognito handles this
      refreshToken: 'COGNITO_MANAGED', // Placeholder - Cognito handles this
      isAuthenticated: true,
    });
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user has valid Cognito session
      const { AuthBridge } = await import('@/lib/auth-bridge');
      const hasCognitoSession = await AuthBridge.hasCognitoSession();
      
      if (hasCognitoSession) {
        // Get user data from localStorage or fetch from backend
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            accessToken: 'COGNITO_MANAGED',
            refreshToken: 'COGNITO_MANAGED',
            isAuthenticated: true,
          });
        } else {
          // Fetch user profile from backend
          await refreshUserFromBackend();
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear invalid stored data
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  };

  const refreshUserFromBackend = async () => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{ getMe: UserProfile }>(
        getMe
      );

      if (data.getMe) {
        setAuthState({
          user: data.getMe,
          accessToken: 'COGNITO_MANAGED',
          refreshToken: 'COGNITO_MANAGED',
          isAuthenticated: true,
        });
        localStorage.setItem('user', JSON.stringify(data.getMe));
      }
    } catch (error) {
      console.error('Error fetching user from backend:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{ getMe: UserProfile }>(
        getMe
      );

      if (data.getMe) {
        setAuthState(prev => ({ ...prev, user: data.getMe }));
        localStorage.setItem('user', JSON.stringify(data.getMe));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Use Amplify signIn via auth bridge
      const { AuthBridge } = await import('@/lib/auth-bridge');
      const authData = await AuthBridge.signInWithAmplify(email, password);

      const user = authData.user;
      storeAuthData(user);
    } catch (error) {
      // Re-throw the original error to preserve its structure (name, message, etc.)
      // This allows proper error detection in useAuthModal
      throw error;
    }
  };

  const signUp = async (input: SignUpInput): Promise<{ requiresVerification?: boolean }> => {
    try {
      // Use custom GraphQL mutation for sign up
      const { AuthBridge } = await import('@/lib/auth-bridge');
      const authData = await AuthBridge.signUpWithCustom(input);

      // Check for GraphQL errors
      if (!authData) {
        throw new Error('Invalid response from server');
      }

      // Backend returns { success: true, message: "..." } for successful signup
      // Since Cognito requires email verification by default, successful signup means verification is required
      if (authData.success) {
        return { requiresVerification: true };
      }

      // If success is false or undefined, something went wrong
      throw new Error(authData.message || 'Sign up failed');
    } catch (error) {
      // Re-throw the original error to preserve its structure
      throw error;
    }
  };

  const signOut = () => {
    // Use the auth bridge to sign out from Cognito
    import('@/lib/auth-bridge').then(({ AuthBridge }) => {
      AuthBridge.signOutFromBridge();
    });
    
    // Clear localStorage
    localStorage.removeItem('user');
    
    // Clear cookies (if any)
    deleteCookie('accessToken');
    deleteCookie('refreshToken');

    // Reset state
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  };

  const signInWithSocial = async (provider: 'google' | 'facebook') => {
    try {
      // Use Cognito's built-in social sign-in via AuthBridge
      const { AuthBridge } = await import('@/lib/auth-bridge');
      
      if (provider === 'google') {
        await AuthBridge.signInWithGoogle();
      } else {
        await AuthBridge.signInWithFacebook();
      }
      
      // The redirect will happen automatically, no need to update state here
      
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Social sign in failed');
      throw new Error(errorMessage);
    }
  };

  const signUpWithSocial = async (provider: 'google' | 'facebook', _userType: UserType = UserType.TENANT) => {
    try {
      // For social sign-up, we use the same flow as sign-in
      // The post-confirmation trigger will create the user automatically
      await signInWithSocial(provider);
      
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Social sign up failed');
      throw new Error(errorMessage);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const data = await GraphQLClient.executePublic<{ verifyEmail: any }>(
        verifyEmailMutation,
        { email, code }
      );

      const result = data.verifyEmail;
      if (!result?.success) {
        throw new Error(result?.message || 'Email verification failed');
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Email verification failed');
      throw new Error(errorMessage);
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      const data = await GraphQLClient.executePublic<{ resendVerificationCode: any }>(
        resendVerificationCodeMutation,
        { email }
      );

      const result = data.resendVerificationCode;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to resend verification code');
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Failed to resend verification code');
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const data = await GraphQLClient.executePublic<{ forgotPassword: any }>(
        forgotPasswordMutation,
        { email }
      );

      const result = data.forgotPassword;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to send reset email');
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Failed to send reset email');
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const data = await GraphQLClient.executePublic<{ resetPassword: any }>(
        resetPasswordMutation,
        { email, confirmationCode: code, newPassword }
      );

      const result = data.resetPassword;
      if (!result?.success) {
        throw new Error(result?.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Password reset failed');
      throw new Error(errorMessage);
    }
  };

  const submitLandlordApplication = async (applicationData: any) => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{ submitLandlordApplication: ApplicationResponse }>(
        submitLandlordApplicationMutation,
        { input: applicationData }
      );

      console.log('Response:', data);

      const result = data.submitLandlordApplication;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to submit application');
      }

      // If auto-approved, refresh user data to update the UI immediately
      if (result.status === 'APPROVED') {
        await refreshUserData();
      }

      return result;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Failed to submit application');
      throw new Error(errorMessage);
    }
  };

  const updateUser = async (input: UpdateUserInput) => {
    if (!authState.user) {
      throw new Error('User not authenticated');
    }

    try {
      const data = await GraphQLClient.executeAuthenticated<{ 
        updateUser: { success: boolean; message: string } 
      }>(
        updateUserMutation,
        { input }
      );

      const result = data.updateUser;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to update user');
      }

      // Refresh user data from backend to get updated profile
      await refreshUserData();

      return authState.user!;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Failed to update user');
      throw new Error(errorMessage);
    }
  };

  const refreshUser = async () => {
    if (authState.user) {
      await refreshUserData();
    }
  };

  const setLocalUser = (patch: Partial<UserProfile>) => {
    setAuthState(prev => {
      const updatedUser = prev.user ? { ...prev.user, ...patch } : null;
      if (updatedUser) {
        try {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Failed to persist local user update:', e);
        }
      }
      return { ...prev, user: updatedUser };
    });
  };

  const contextValue: AuthContextType = {
    ...authState,
    isLoading,
    signIn,
    signUp,
    signInWithSocial,
    signUpWithSocial,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateUser,
    submitLandlordApplication,
    signOut,
    refreshUser,
    resendVerificationCode,
    setLocalUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During SSR or before provider is mounted, return default values
    if (typeof window === 'undefined') {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
        signIn: async () => {},
        signUp: async () => ({ requiresVerification: false }),
        signInWithSocial: async () => {},
        signUpWithSocial: async () => {},
        verifyEmail: async () => {},
        resendVerificationCode: async () => {},
        forgotPassword: async () => {},
        resetPassword: async () => {},
        updateUser: async () => ({} as UserProfile),
        submitLandlordApplication: async () => ({} as ApplicationResponse),
        signOut: () => {},
        refreshUser: async () => {},
        setLocalUser: () => {},
      } as AuthContextType;
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}