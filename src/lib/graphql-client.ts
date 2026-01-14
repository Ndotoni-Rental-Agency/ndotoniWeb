import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

// Create the GraphQL client (singleton)
const client = generateClient();

/**
 * Centralized GraphQL client for all API calls
 * 
 * Benefits:
 * - Single source of truth for GraphQL operations
 * - Automatic authentication handling
 * - Consistent error handling
 * - Easy to modify behavior globally
 * 
 * Usage:
 * - Use `executeAuthenticated` for operations requiring user authentication
 * - Use `executePublic` for public/guest operations (uses API Key)
 * - Use `execute` for automatic auth mode selection
 */
export class GraphQLClient {
  /**
   * Execute a GraphQL query/mutation with automatic auth mode selection
   * Tries Cognito auth first, falls back to API Key if user not authenticated
   */
  static async execute<T = any>(
    query: string,
    variables?: Record<string, any>,
    forceApiKey = false
  ): Promise<T> {
    try {
      // Check if user is authenticated (unless forcing API key)
      let authMode: 'userPool' | 'apiKey' = 'apiKey';
      
      if (!forceApiKey) {
        try {
          await getCurrentUser();
          authMode = 'userPool'; // User is authenticated, use Cognito
        } catch {
          authMode = 'apiKey'; // User not authenticated, use API key
        }
      }

      const result = await client.graphql({
        query,
        variables,
        authMode,
      }) as GraphQLResult<any>;

      return result.data as T;
    } catch (error) {
      console.error('GraphQL Error:', error);
      throw error;
    }
  }

  /**
   * Execute query with Cognito authentication (throws if not authenticated)
   * Use this for operations that REQUIRE user authentication
   */
  static async executeAuthenticated<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      // Verify user is authenticated
      await getCurrentUser();
      
      const result = await client.graphql({
        query,
        variables,
        authMode: 'userPool',
      }) as GraphQLResult<any>;

      return result.data as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'UserUnAuthenticatedError') {
        throw new Error('Authentication required for this operation');
      }
      throw error;
    }
  }

  /**
   * Execute query with API Key (for public/guest access)
   * Use this for operations that should work without authentication
   */
  static async executePublic<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const result = await client.graphql({
      query,
      variables,
      authMode: 'apiKey',
    }) as GraphQLResult<any>;

    return result.data as T;
  }

  /**
   * Get the raw Amplify client (use sparingly, prefer the static methods above)
   * Only use this if you need direct access to subscriptions or other advanced features
   */
  static getRawClient() {
    return client;
  }
}

export default GraphQLClient;