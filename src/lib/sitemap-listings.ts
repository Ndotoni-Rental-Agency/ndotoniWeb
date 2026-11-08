import 'server-only';

export type SitemapListing = { propertyId: string; updatedAt?: string | null };
async function query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/graphql';
  const key = process.env.NEXT_PUBLIC_API_KEY;
  if (!endpoint || !key) throw new Error('Public inventory API is not configured');
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': key },
    body: JSON.stringify({ query, variables }), next: { revalidate: 3600 }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Inventory API returned ${response.status}`);
  const result = await response.json();
  if (result.errors?.length || !result.data) throw new Error('Inventory API could not load the catalog');
  return result.data;
}

export async function getSitemapListings(): Promise<SitemapListing[]> {
  const data = await query<{ getRegions: { name: string }[] }>('query SitemapRegions { getRegions { name } }');
  if (!Array.isArray(data.getRegions) || !data.getRegions.length) throw new Error('Inventory region list is empty');
  // The administrative directory omits the legacy Zanzibar label. The public
  // browse endpoint groups that label with the island regions, including legacy listings.
  const regions = Array.from(new Set([...data.getRegions.map(r => r.name).filter(Boolean), 'Zanzibar']));
  const listings = new Map<string, SitemapListing>();
  // Bound concurrency while discovering every configured region, including the islands.
  for (let offset = 0; offset < regions.length; offset += 4) {
    await Promise.all(regions.slice(offset, offset + 4).map(async region => {
      let nextToken: string | undefined;
      const seenTokens = new Set<string>();
      do {
        const data = await query<{ getPropertiesByLocation: { properties: (SitemapListing & { title: string })[]; nextToken?: string | null } }>(
          `query SitemapRentals($region: String!, $nextToken: String) {
            getPropertiesByLocation(region: $region, limit: 100, nextToken: $nextToken, sortBy: PRICE_LOW_HIGH) {
              properties { propertyId title } nextToken
            }
          }`, { region, nextToken });
        // This public browsing operation returns published, available cards only.
        // Cards do not expose updatedAt; do not invent a modification date.
        const page = data.getPropertiesByLocation;
        if (!page || !Array.isArray(page.properties)) throw new Error('Invalid inventory page');
        for (const property of page.properties) {
          if (!property.propertyId || /^(?:HydraTest[-_]|test[-_])/i.test(property.title || '')) continue;
          listings.set(property.propertyId, property);
        }
        nextToken = page.nextToken || undefined;
        if (nextToken) {
          if (seenTokens.has(nextToken)) throw new Error('Inventory pagination repeated a cursor');
          seenTokens.add(nextToken);
        }
      } while (nextToken);
    }));
  }
  return Array.from(listings.values()).sort((a, b) => a.propertyId.localeCompare(b.propertyId));
}
