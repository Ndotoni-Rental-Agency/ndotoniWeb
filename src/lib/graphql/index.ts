import { generateClient } from 'aws-amplify/api';

// Create GraphQL client
export const client = generateClient();

// Re-export all queries and mutations
export * from './queries/index';
export * from './mutations/index';
export * from './subscriptions/index';