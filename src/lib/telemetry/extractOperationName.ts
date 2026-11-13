const OPERATION_RE = /(?:query|mutation)\s+(\w+)/i;

export function extractOperationName(query: string): string | undefined {
  const match = query.match(OPERATION_RE);
  return match?.[1];
}
