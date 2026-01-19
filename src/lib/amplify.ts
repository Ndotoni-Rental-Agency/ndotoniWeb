import { Amplify } from 'aws-amplify';
import type { ResourcesConfig } from 'aws-amplify';

// Environment-based configuration
// Vercel automatically sets VERCEL_ENV to 'production', 'preview', or 'development'
const getConfig = (): ResourcesConfig => {
  // Use environment variables - ensure these are set in .env.local
  const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID;
  const userPoolClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const redirectSignIn = process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN;
  const redirectSignOut = process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT;
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  const graphqlRegion = process.env.NEXT_PUBLIC_GRAPHQL_REGION;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Validate required environment variables
  if (!userPoolId || !userPoolClientId || !cognitoDomain || !redirectSignIn || !redirectSignOut || !graphqlEndpoint || !graphqlRegion || !apiKey) {
    throw new Error(
      'Missing required environment variables. Please check your .env.local file. ' +
      'Required: NEXT_PUBLIC_USER_POOL_ID, NEXT_PUBLIC_USER_POOL_CLIENT_ID, ' +
      'NEXT_PUBLIC_COGNITO_DOMAIN, NEXT_PUBLIC_REDIRECT_SIGN_IN, NEXT_PUBLIC_REDIRECT_SIGN_OUT, ' +
      'NEXT_PUBLIC_GRAPHQL_ENDPOINT, NEXT_PUBLIC_GRAPHQL_REGION, NEXT_PUBLIC_API_KEY'
    );
  }

  return {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          oauth: {
            domain: cognitoDomain,
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: [redirectSignIn],
            redirectSignOut: [redirectSignOut],
            responseType: 'code'
          }
        }
      }
    },
    API: {
      GraphQL: {
        endpoint: graphqlEndpoint,
        region: graphqlRegion,
        defaultAuthMode: 'apiKey' as const,
        apiKey
      }
    }
  };
};

// Configure Amplify
Amplify.configure(getConfig());

export default Amplify;