import { generateClient } from 'aws-amplify/api';

// Create GraphQL client
export const client = generateClient();

// Export all GraphQL operations from consolidated files
export * from './queries';
export * from './mutations';
export * from './subscriptions';