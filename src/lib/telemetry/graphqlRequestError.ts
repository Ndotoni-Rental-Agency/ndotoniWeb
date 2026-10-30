import { extractOperationName } from './extractOperationName';

export class GraphQLRequestError extends Error {
  readonly errorType?: string;
  readonly httpStatus?: number;
  readonly operationName?: string;

  constructor(
    message: string,
    options: { errorType?: string; httpStatus?: number; operationName?: string } = {}
  ) {
    super(message);
    this.name = 'GraphQLRequestError';
    this.errorType = options.errorType;
    this.httpStatus = options.httpStatus;
    this.operationName = options.operationName;
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
      $metadata?: { httpStatusCode?: number };
    };

    const gqlErrors = errObj.errors;
    if (gqlErrors?.length) {
      const first = gqlErrors[0];
      return new GraphQLRequestError(first.message ?? errObj.message ?? 'GraphQL request failed', {
        errorType: first.errorType,
        httpStatus: httpStatus ?? errObj.$metadata?.httpStatusCode,
        operationName,
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
