'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { client } from '@/lib/graphql';
import { 
  signIn as signInMutation, 
  signUp as signUpMutation, 
  socialSignIn as socialSignInMutation, 
  socialSignUp as socialSignUpMutation, 
  verifyEmail as verifyEmailMutation, 
  forgotPassword as forgotPasswordMutation, 
  resetPassword as resetPasswordMutation, 
  resendVerificationCode as resendVerificationCodeMutation 
} from '@/lib/graphql/mutations/auth';
import { 
  updateUser as updateUserMutation, 
  submitLandlordApplication as submitLandlordApplicationMutation 
} from '@/lib/graphql/mutations/user';
import { getUser } from '@/lib/graphql/queries/user';
import { User, UserType, AccountStatus } from '@/types';
import type { ApplicationResponse } from '@/types';
import { extractErrorMessage } from '@/lib/utils/errorUtils';
import { setCookie, deleteCookie } from '@/lib/utils/cookies';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signInWithSocial: (provider: 'google' | 'facebook') => Promise<void>;
  signUpWithSocial: (provider: 'google' | 'facebook', userType?: UserType) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  updateUser: (input: UpdateUserInput) => Promise<User>;
  submitLandlordApplication: (applicationData: any) => Promise<ApplicationResponse>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
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

  // Helper function to store auth data
  const storeAuthData = (accessToken: string, refreshToken: string, user: User) => {
    // Store in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Store tokens in cookies for middleware access (7 days)
    setCookie('accessToken', accessToken, 7);
    setCookie('refreshToken', refreshToken, 7);
    
    // Update state
    setAuthState({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          accessToken: storedToken,
          refreshToken: storedRefreshToken,
          isAuthenticated: true,
        });
        setIsLoading(false);

        // Optionally refresh user data from server
        await refreshUserData(user.userId);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear invalid stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  };

  const refreshUserData = async (userId: string) => {
    try {
      const response = await client.graphql({
        query: getUser,
        variables: { userId },
      });

      const userData = (response as any).data?.getUser;
      if (userData) {
        const user: User = {
          userId: userData.userId || '',
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          userType: userData.userType || 'TENANT',
          accountStatus: userData.accountStatus || 'ACTIVE',
          isEmailVerified: userData.isEmailVerified || false,
          phoneNumber: userData.phoneNumber || '',
          profileImage: userData.profileImage,
          language: userData.language || 'en',
          currency: userData.currency || 'USD',
          emailNotifications: userData.emailNotifications ?? true,
          smsNotifications: userData.smsNotifications ?? true,
          pushNotifications: userData.pushNotifications ?? true,
          businessName: userData.businessName,
          permissions: userData.permissions,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt,
        };

        setAuthState(prev => ({ ...prev, user }));
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await client.graphql({
        query: signInMutation,
        variables: { email, password },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Sign in failed');
        throw new Error(errorMessage);
      }

      const authData = (response as any).data?.signIn;
      if (!authData) {
        throw new Error('Invalid response from server');
      }

      const user: User = {
        userId: authData.user.userId || '',
        email: authData.user.email || '',
        firstName: authData.user.firstName || '',
        lastName: authData.user.lastName || '',
        userType: authData.user.userType || 'TENANT',
        accountStatus: authData.user.accountStatus || 'ACTIVE',
        isEmailVerified: authData.user.isEmailVerified || false,
        phoneNumber: authData.user.phoneNumber || '',
        profileImage: authData.user.profileImage,
        language: authData.user.language || 'en',
        currency: authData.user.currency || 'USD',
        emailNotifications: authData.user.emailNotifications ?? true,
        smsNotifications: authData.user.smsNotifications ?? true,
        pushNotifications: authData.user.pushNotifications ?? true,
        businessName: authData.user.businessName,
        permissions: authData.user.permissions,
        createdAt: authData.user.createdAt || new Date().toISOString(),
        updatedAt: authData.user.updatedAt,
      };

      storeAuthData(authData.accessToken, authData.refreshToken, user);
    } catch (error) {
      // Extract and re-throw with proper error message
      const errorMessage = extractErrorMessage(error, 'Sign in failed');
      throw new Error(errorMessage);
    }
  };

  const signUp = async (input: SignUpInput) => {
    try {
      const response = await client.graphql({
        query: signUpMutation,
        variables: { input },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Sign up failed');
        throw new Error(errorMessage);
      }

    const authData = (response as any).data?.signUp;
    if (!authData) {
      throw new Error('Invalid response from server');
    }

    // For signup, tokens might be "VERIFICATION_REQUIRED"
    if (authData.accessToken === 'VERIFICATION_REQUIRED') {
      // Don't store tokens, user needs to verify email first
      return;
    }

    const user: User = {
      userId: authData.user.userId || '',
      email: authData.user.email || '',
      firstName: authData.user.firstName || '',
      lastName: authData.user.lastName || '',
      userType: authData.user.userType || 'TENANT',
      accountStatus: authData.user.accountStatus || 'ACTIVE',
      isEmailVerified: authData.user.isEmailVerified || false,
      phoneNumber: authData.user.phoneNumber || '',
      profileImage: authData.user.profileImage,
      language: authData.user.language || 'en',
      currency: authData.user.currency || 'USD',
      emailNotifications: authData.user.emailNotifications ?? true,
      smsNotifications: authData.user.smsNotifications ?? true,
      pushNotifications: authData.user.pushNotifications ?? true,
      businessName: authData.user.businessName,
      permissions: authData.user.permissions,
      createdAt: authData.user.createdAt || new Date().toISOString(),
      updatedAt: authData.user.updatedAt,
    };

    storeAuthData(authData.accessToken, authData.refreshToken, user);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Sign up failed');
      throw new Error(errorMessage);
    }
  };

  const signOut = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cookies
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
      // Get social access token from the provider
      const socialToken = await getSocialAccessToken(provider);
      
      const response = await client.graphql({
        query: socialSignInMutation,
        variables: { provider, accessToken: socialToken },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Social sign in failed');
        throw new Error(errorMessage);
      }

    const authData = (response as any).data?.socialSignIn;
    if (!authData) {
      throw new Error('Invalid response from server');
    }

    const user: User = {
      userId: authData.user.userId || '',
      email: authData.user.email || '',
      firstName: authData.user.firstName || '',
      lastName: authData.user.lastName || '',
      userType: authData.user.userType || 'TENANT',
      accountStatus: authData.user.accountStatus || 'ACTIVE',
      isEmailVerified: authData.user.isEmailVerified || false,
      phoneNumber: authData.user.phoneNumber || '',
      profileImage: authData.user.profileImage,
      language: authData.user.language || 'en',
      currency: authData.user.currency || 'USD',
      emailNotifications: authData.user.emailNotifications ?? true,
      smsNotifications: authData.user.smsNotifications ?? true,
      pushNotifications: authData.user.pushNotifications ?? true,
      businessName: authData.user.businessName,
      permissions: authData.user.permissions,
      createdAt: authData.user.createdAt || new Date().toISOString(),
      updatedAt: authData.user.updatedAt,
    };

    storeAuthData(authData.accessToken, authData.refreshToken, user);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Social sign in failed');
      throw new Error(errorMessage);
    }
  };

  const signUpWithSocial = async (provider: 'google' | 'facebook', userType: UserType = 'TENANT') => {
    try {
      // Get social access token from the provider
      const socialToken = await getSocialAccessToken(provider);
      
      const response = await client.graphql({
        query: socialSignUpMutation,
        variables: { provider, accessToken: socialToken, userType },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Social sign up failed');
        throw new Error(errorMessage);
      }

    const authData = (response as any).data?.socialSignUp;
    if (!authData) {
      throw new Error('Invalid response from server');
    }

    const user: User = {
      userId: authData.user.userId || '',
      email: authData.user.email || '',
      firstName: authData.user.firstName || '',
      lastName: authData.user.lastName || '',
      userType: authData.user.userType || 'TENANT',
      accountStatus: authData.user.accountStatus || 'ACTIVE',
      isEmailVerified: authData.user.isEmailVerified || false,
      phoneNumber: authData.user.phoneNumber || '',
      profileImage: authData.user.profileImage,
      language: authData.user.language || 'en',
      currency: authData.user.currency || 'USD',
      emailNotifications: authData.user.emailNotifications ?? true,
      smsNotifications: authData.user.smsNotifications ?? true,
      pushNotifications: authData.user.pushNotifications ?? true,
      businessName: authData.user.businessName,
      permissions: authData.user.permissions,
      createdAt: authData.user.createdAt || new Date().toISOString(),
      updatedAt: authData.user.updatedAt,
    };

    storeAuthData(authData.accessToken, authData.refreshToken, user);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Social sign up failed');
      throw new Error(errorMessage);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await client.graphql({
        query: verifyEmailMutation,
        variables: { email, code },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Email verification failed');
        throw new Error(errorMessage);
      }

      const result = (response as any).data?.verifyEmail;
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
      const response = await client.graphql({
        query: resendVerificationCodeMutation,
        variables: { email },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Failed to resend verification code');
        throw new Error(errorMessage);
      }

      const result = (response as any).data?.resendVerificationCode;
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
      const response = await client.graphql({
        query: forgotPasswordMutation,
        variables: { email },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Failed to send reset email');
        throw new Error(errorMessage);
      }

      const result = (response as any).data?.forgotPassword;
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
      const response = await client.graphql({
        query: resetPasswordMutation,
        variables: { email, confirmationCode: code, newPassword },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Password reset failed');
        throw new Error(errorMessage);
      }

      const result = (response as any).data?.resetPassword;
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
      const response = await client.graphql({
        query: submitLandlordApplicationMutation,
        variables: { input: applicationData },
      });

      console.log('Response:', response)

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Failed to submit application');
        throw new Error(errorMessage);
      }

      const result = (response as any).data?.submitLandlordApplication;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to submit application');
      }

      // If auto-approved, refresh user data to update the UI immediately
      if (result.status === 'APPROVED') {
        await refreshUserData(applicationData.userId);
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
      const response = await client.graphql({
        query: updateUserMutation,
        variables: { userId: authState.user.userId, input },
      });

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = extractErrorMessage(response, 'Failed to update user');
        throw new Error(errorMessage);
      }

      const userData = (response as any).data?.updateUser;
      if (!userData) {
        throw new Error('Invalid response from server');
      }

    const updatedUser: User = {
      userId: userData.userId || authState.user.userId,
      email: userData.email || authState.user.email,
      firstName: userData.firstName || authState.user.firstName,
      lastName: userData.lastName || authState.user.lastName,
      userType: userData.userType || authState.user.userType,
      accountStatus: userData.accountStatus || authState.user.accountStatus,
      isEmailVerified: userData.isEmailVerified ?? authState.user.isEmailVerified,
      phoneNumber: userData.phoneNumber || authState.user.phoneNumber,
      profileImage: userData.profileImage || authState.user.profileImage,
      language: userData.language || authState.user.language,
      currency: userData.currency || authState.user.currency,
      emailNotifications: userData.emailNotifications ?? authState.user.emailNotifications,
      smsNotifications: userData.smsNotifications ?? authState.user.smsNotifications,
      pushNotifications: userData.pushNotifications ?? authState.user.pushNotifications,
      businessName: userData.businessName || (authState.user as any).businessName,
      permissions: userData.permissions || (authState.user as any).permissions,
      createdAt: userData.createdAt || authState.user.createdAt,
      updatedAt: userData.updatedAt || authState.user.updatedAt,
    };

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));

    return updatedUser;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Failed to update user');
      throw new Error(errorMessage);
    }
  };

  const refreshUser = async () => {
    if (authState.user) {
      await refreshUserData(authState.user.userId);
    }
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
    resendVerificationCode
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}