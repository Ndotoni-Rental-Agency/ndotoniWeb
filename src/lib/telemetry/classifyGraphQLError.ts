import { GraphQLRequestError } from './graphqlRequestError';

const GENERIC_MESSAGES = new Set([
  'Something went wrong. Please try again later.',
  'Something went wrong. Please try again.',
]);

export type GraphQLErrorClassification =
  | 'skip'
  | 'expected'
  | 'unexpected';

export function classifyGraphQLError(error: unknown): GraphQLErrorClassification {
  if (error instanceof Error) {
    if (error.name === 'AbortError') return 'skip';
    const msg = error.message.toLowerCase();
    if (msg.includes('authentication required') || msg.includes('authentication failed')) {
      return 'skip';
    }
    if (error.name === 'UserUnAuthenticatedError') return 'skip';
  }

  const gql =
    error instanceof GraphQLRequestError
      ? error
      : error instanceof Error
        ? new GraphQLRequestError(error.message, { errorType: error.name })
        : null;

  if (!gql) return 'unexpected';

  if (gql.errorType === 'NdotoniError') return 'expected';

  if (gql.errorType && gql.errorType !== 'NdotoniError') {
    if (gql.httpStatus && gql.httpStatus >= 500) return 'unexpected';
    if (gql.errorType !== 'UnauthorizedException') return 'unexpected';
  }

  if (GENERIC_MESSAGES.has(gql.message)) return 'unexpected';

  if (!gql.errorType && gql.message) return 'unexpected';

  return 'expected';
}
