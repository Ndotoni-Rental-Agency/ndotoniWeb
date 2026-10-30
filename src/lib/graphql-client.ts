import { syncReferral } from '@/lib/referral/attribution';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { classifyGraphQLError } from '@/lib/telemetry/classifyGraphQLError';
import { extractOperationName } from '@/lib/telemetry/extractOperationName';
import { toGraphQLRequestError } from '@/lib/telemetry/graphqlRequestError';

// Lazy client initialization with explicit any to avoid excessive stack depth
let client: any = null;

function getClient(): any {
  if (!client) {
    if (typeof window !== 'undefined') {
      require('@/lib/amplify');
    }
    client = generateClient() as any;
  }
  return client as any;
}

function isTelemetryOperation(query: string): boolean {
  const name = extractOperationName(query);
  return name?.toLowerCase() === 'reportclienttelemetry';
}

function shouldSkipGraphQLTelemetry(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.name === 'AbortError') return true;
    const msg = error.message.toLowerCase();
    if (msg.includes('authentication required') || msg.includes('authentication failed')) {
      return true;
    }
    if (error.name === 'UserUnAuthenticatedError') return true;
  }
  return classifyGraphQLError(error) === 'skip';
}

async function executeGraphQLRequest<T>(
  query: string,
  variables: Record<string, any> | undefined,
  authMode: 'userPool' | 'apiKey'
): Promise<T> {
  const clientInstance = getClient();
  const operationName = extractOperationName(query) ?? 'unknown';

  if (authMode === 'userPool' && /mutation[\s\S]*create(?:Property|ShortTermProperty)/i.test(query)) {
    await syncReferral((q, v) => clientInstance.graphql({ query: q, variables: v, authMode: 'userPool' }));
  }

  try {
    const result = (await clientInstance.graphql({
      query,
      variables,
      authMode,
    })) as GraphQLResult<any>;

    if (result.errors?.length) {
      throw toGraphQLRequestError({ errors: result.errors, message: result.errors[0]?.message }, query);
    }

    return result.data as T;
  } catch (error) {
    const normalized = toGraphQLRequestError(error, query);
    console.error('GraphQL Error:', normalized);

    if (
      typeof window !== 'undefined' &&
      !isTelemetryOperation(query) &&
      !shouldSkipGraphQLTelemetry(normalized)
    ) {
      void import('@/lib/telemetry/reportClientEvent').then(({ reportClientEvent }) => {
        reportClientEvent(
          {
            type: 'GRAPHQL_ERROR',
            operationName,
            httpStatus: normalized.httpStatus,
            errorCode: normalized.errorType ?? normalized.name,
          },
          normalized
        );
      });
    }

    throw normalized;
  }
}

/**
 * Centralized GraphQL client for all API calls
 */
export class GraphQLClient {
  static async execute<T = any>(
    query: string,
    variables?: Record<string, any>,
    forceApiKey = false
  ): Promise<T> {
    let authMode: 'userPool' | 'apiKey' = 'apiKey';

    if (!forceApiKey) {
      try {
        await getCurrentUser();
        authMode = 'userPool';
      } catch {
        authMode = 'apiKey';
      }
    }

    return executeGraphQLRequest<T>(query, variables, authMode);
  }

  static async executeAuthenticated<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      await getCurrentUser();
    } catch {
      throw new Error('Authentication required for this operation');
    }
    return executeGraphQLRequest<T>(query, variables, 'userPool');
  }

  static async executePublic<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return executeGraphQLRequest<T>(query, variables, 'apiKey');
  }

  static getRawClient() {
    return getClient();
  }
}

export default GraphQLClient;

export const graphqlClient = {
  graphql: (options: any) => {
    const clientInstance = GraphQLClient.getRawClient();
    return clientInstance.graphql(options);
  },
};
