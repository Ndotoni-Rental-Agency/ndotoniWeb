import { describe, expect, it } from 'vitest';
import { toGraphQLRequestError } from './graphqlRequestError';

describe('toGraphQLRequestError', () => {
  it('preserves errors and partial data from Amplify-style results', () => {
    const errors = [{ message: "Can't serialize value (/submitReferral)" }];
    const data = { submitReferral: null };
    const err = toGraphQLRequestError({ errors, data }, 'mutation SubmitReferral { x }');
    expect(err.errors).toEqual(errors);
    expect(err.data).toEqual(data);
    expect(err.message).toBe(errors[0].message);
    expect(err.operationName).toBe('SubmitReferral');
  });
});
