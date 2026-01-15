'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signIn as cognitoSignIn,
  signUp as cognitoSignUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword as cognitoResetPassword,
  confirmResetPassword,
  signOut as cognitoSignOut,
  getCurrentUser,
  fetchAuthSession,
  signInWithRedirect,
  AuthUser
} from 'aws-amplify/auth';
import { GraphQLClient } from '@/lib/graphql-client';
import { getMe } from '@/graphql/queries';
import { UserProfile } from '@/API';

export interface AuthState {
  user: UserProfile | null;
  cognitoUser: AuthUser | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}

// Create context
const CognitoAuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function CognitoAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    cognitoUser: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user is authenticated with Cognito
      const cognitoUser = await getCurrentUser();
      
      if (cognitoUser) {
        // Get user profile from your backend
        const userProfile = await fetchUserProfile(cognitoUser.userId);
        
        setAuthState({
          user: userProfile,
          cognitoUser,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      // User not authenticated
      setAuthState({
        user: null,
        cognitoUser: null,
        isAuthenticated: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const result = await GraphQLClient.executeAuthenticated(getMe);
      return result.getUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { isSignedIn } = await cognitoSignIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        // Get the authenticated user
        const cognitoUser = await getCurrentUser();
        
        // Get user profile from backend
        const userProfile = await fetchUserProfile(cognitoUser.userId);
        
        setAuthState({
          user: userProfile,
          cognitoUser,
          isAuthenticated: true,
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Sign in failed');
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phoneNumber: string
  ) => {
    try {
      const { isSignUpComplete } = await cognitoSignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            phone_number: phoneNumber,
          },
        },
      });

      if (!isSignUpComplete) {
        // User needs to verify email
        console.log('Sign up successful, verification required');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Sign up failed');
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        console.log('Email verification successful');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw new Error(error.message || 'Email verification failed');
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      await resendSignUpCode({
        username: email,
      });
    } catch (error: any) {
      console.error('Resend verification code error:', error);
      throw new Error(error.message || 'Failed to resend verification code');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await cognitoResetPassword({
        username: email,
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  };

  const signOut = async () => {
    try {
      await cognitoSignOut();
      
      setAuthState({
        user: null,
        cognitoUser: null,
        isAuthenticated: false,
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Sign out failed');
    }
  };

  const refreshUser = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      
      if (cognitoUser) {
        const userProfile = await fetchUserProfile(cognitoUser.userId);
        
        setAuthState(prev => ({
          ...prev,
          user: userProfile,
          cognitoUser,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Google sign in failed');
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithRedirect({ provider: 'Facebook' });
    } catch (error: any) {
      console.error('Facebook sign in error:', error);
      throw new Error(error.message || 'Facebook sign in failed');
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    isLoading,
    signIn,
    signUp,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    signOut,
    refreshUser,
    signInWithGoogle,
    signInWithFacebook,
  };

  return (
    <CognitoAuthContext.Provider value={contextValue}>
      {children}
    </CognitoAuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useCognitoAuth() {
  const context = useContext(CognitoAuthContext);
  if (context === undefined) {
    throw new Error('useCognitoAuth must be used within a CognitoAuthProvider');
  }
  return context;
}