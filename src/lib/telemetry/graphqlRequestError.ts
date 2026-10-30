import { extractOperationName } from './extractOperationName';

export class GraphQLRequestError extends Error {
  readonly errorType?: string;
  readonly httpStatus?: number;
  readonly operationName?: string;
  /** Raw GraphQL errors and partial data, kept for callers that inspect them (e.g. referral submit). */
  readonly errors?: Array<{ message?: string; errorType?: string }>;
  readonly data?: unknown;

  constructor(
    message: string,
    options: {
      errorType?: string;
      httpStatus?: number;
      operationName?: string;
      errors?: Array<{ message?: string; errorType?: string }>;
      data?: unknown;
    } = {}
  ) {
    super(message);
    this.name = 'GraphQLRequestError';
    this.errorType = options.errorType;
    this.httpStatus = options.httpStatus;
    this.operationName = options.operationName;
    this.errors = options.errors;
    this.data = options.data;
  }
}

export function toGraphQLRequestError(
  error: unknown,
  query: string,
  httpStatus?: number
): GraphQLRequestError {
  if (error instanceof GraphQLRequestError) {
    return error;
  }

  const operationName = extractOperationName(query);

  if (error && typeof error === 'object') {
    const errObj = error as {
      message?: string;
      name?: string;
      errors?: Array<{ message?: string; errorType?: string }>;
      data?: unknown;
      $metadata?: { httpStatusCode?: number };
    };

    const gqlErrors = errObj.errors;
    if (gqlErrors?.length) {
      const first = gqlErrors[0];
      return new GraphQLRequestError(first.message ?? errObj.message ?? 'GraphQL request failed', {
        errorType: first.errorType,
        httpStatus: httpStatus ?? errObj.$metadata?.httpStatusCode,
        operationName,
        errors: gqlErrors,
        data: errObj.data,
      });
    }

    if (typeof errObj.message === 'string') {
      return new GraphQLRequestError(errObj.message, {
        errorType: errObj.name,
        httpStatus: httpStatus ?? errObj.$metadata?.httpStatusCode,
        operationName,
      });
    }
  }

  if (error instanceof Error) {
    return new GraphQLRequestError(error.message, {
      errorType: error.name,
      httpStatus,
      operationName,
    });
  }

  return new GraphQLRequestError('GraphQL request failed', { httpStatus, operationName });
}
