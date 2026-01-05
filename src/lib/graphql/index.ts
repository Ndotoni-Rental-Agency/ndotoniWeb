import { generateClient } from 'aws-amplify/api';

// Create GraphQL client
export const client = generateClient();

// Export cached GraphQL client for better performance
export { cachedGraphQL } from './cache';

// Export all GraphQL operations from consolidated files
export * from './queries';
export * from './mutations';
export * from './subscriptions';
export * from './subscriptions';