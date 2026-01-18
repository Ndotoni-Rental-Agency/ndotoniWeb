/**
 * GraphQL utility functions
 */

/**
 * Remove __typename and other GraphQL metadata from objects
 * This is necessary when passing fetched data back to mutations
 */
export function cleanGraphQLObject<T>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanGraphQLObject(item)) as any;
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (key === '__typename') {
        continue; // Skip __typename
      }
      cleaned[key] = cleanGraphQLObject(obj[key]);
    }
    return cleaned;
  }

  return obj;
}
