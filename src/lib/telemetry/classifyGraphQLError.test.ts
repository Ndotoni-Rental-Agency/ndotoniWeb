import { describe, expect, it } from 'vitest';
import { classifyGraphQLError } from './classifyGraphQLError';
import { GraphQLRequestError } from './graphqlRequestError';

describe('classifyGraphQLError', () => {
  it('skips AbortError', () => {
    const err = new Error('Aborted');
    err.name = 'AbortError';
    expect(classifyGraphQLError(err)).toBe('skip');
  });

  it('skips authentication required messages', () => {
    expect(classifyGraphQLError(new Error('Authentication required for this operation'))).toBe(
      'skip'
    );
  });

  it('treats NdotoniError as expected (counter only)', () => {
    const err = new GraphQLRequestError('Listing not found', { errorType: 'NdotoniError' });
    expect(classifyGraphQLError(err)).toBe('expected');
  });

  it('treats non-Ndotoni AppSync error types as unexpected', () => {
    const err = new GraphQLRequestError('Something went wrong', {
      errorType: 'Lambda:Unhandled',
    });
    expect(classifyGraphQLError(err)).toBe('unexpected');
  });

  it('treats generic sanitized messages as unexpected', () => {
    const err = new GraphQLRequestError('Something went wrong. Please try again later.', {});
    expect(classifyGraphQLError(err)).toBe('unexpected');
  });

  it('treats HTTP 5xx as unexpected when errorType is set', () => {
    const err = new GraphQLRequestError('Server error', {
      errorType: 'InternalError',
      httpStatus: 502,
    });
    expect(classifyGraphQLError(err)).toBe('unexpected');
  });

  it('treats unknown non-Error values as unexpected', () => {
    expect(classifyGraphQLError('network down')).toBe('unexpected');
  });
});
