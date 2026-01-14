/**
 * Authentication Bridge
 * Mixed approach: Custom signUp + Amplify signIn
 */

import { GraphQLClient } from '@/lib/graphql-client';
import { signIn as cognitoSignIn, signOut as cognitoSignOut, getCurrentUser } from 'aws-amplify/auth';
import { getMe } from '@/graphql/queries';
import { signUp as signUpMutation } from '@/graphql/mutations';

export class AuthBridge {
  /**
   * Sign up using custom GraphQL mutation (creates user in both systems)
   */
  static async signUpWithCustom(input: any) {
    try {
      // Use custom GraphQL mutation for sign up
      const data = await GraphQLClient.executePublic<{ signUp: any }>(
        signUpMutation,
        { input }
      );

      if (!data.signUp) {
        throw new Error('Invalid response from server');
      }

      return data.signUp;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign in using Amplify Cognito, then fetch user profile from custom backend
   */
  static async signInWithAmplify(email: string, password: string) {
    try {
      // Step 1: Authenticate with Cognito (primary authentication)
      await cognitoSignIn({
        username: email,
        password,
      });

      // Step 2: Get user profile from your custom backend using Cognito auth
      const data = await GraphQLClient.executeAuthenticated<{ getMe: any }>(
        getMe
      );

      if (!data.getMe) {
        throw new Error('User profile not found');
      }

      // Return user data in the expected format
      return {
        accessToken: 'COGNITO_MANAGED', // Cognito manages tokens
        refreshToken: 'COGNITO_MANAGED', // Cognito manages tokens
        user: data.getMe
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign out from Cognito
   */
  static async signOutFromBridge() {
    try {
      // Sign out from Cognito
      await cognitoSignOut();
    } catch (error) {
      console.warn('Cognito sign-out failed:', error);
    }

    // Clear custom auth data
    localStorage.removeItem('user');
  }

  /**
   * Check if user has valid Cognito session
   */
  static async hasCognitoSession(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get auth mode based on authentication state
   */
  static async getAuthMode(): Promise<'userPool' | 'apiKey'> {
    try {
      await getCurrentUser();
      return 'userPool'; // User is authenticated with Cognito
    } catch {
      return 'apiKey'; // Guest mode - use API Key
    }
  }

  /**
   * Get current user from Cognito
   */
  static async getCurrentCognitoUser() {
    try {
      return await getCurrentUser();
    } catch (error) {
      throw new Error('No authenticated user');
    }
  }
}