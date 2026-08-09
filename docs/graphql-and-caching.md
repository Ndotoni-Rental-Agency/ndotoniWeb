# GraphQL Data Layer & Caching

This app has more moving parts here than the sister `ndotoniStays` app — three distinct
caching mechanisms exist (one of them dead), plus two codegen pipelines (one dead).

## GraphQL client

`src/lib/amplify.ts` configures Amplify (Cognito + AppSync) with `NEXT_PUBLIC_*` env vars,
falling back to hardcoded beta-environment values if unset — imported lazily, client-side
only (`require('@/lib/amplify')` inside a browser guard in `graphql-client.ts`), no SSR
data fetching through Amplify.

`src/lib/graphql-client.ts` — `GraphQLClient` wraps `generateClient()` with `execute`
(auto-detect auth), `executeAuthenticated` (Cognito, throws if signed out), `executePublic`
(apiKey). Same shape as `ndotoniStays`' client.

## The query cache (what most of the app actually uses)

`src/lib/cache/{index,types,utils}.ts` exports `cachedGraphQL` — an in-memory +
localStorage cache sitting on top of `GraphQLClient`, with per-query-name TTLs (2 minutes
to 1 hour) and mutation→query invalidation rules (`INVALIDATION_RULES` in
`cache/utils.ts`). Only a `PERSISTENT_QUERIES` allowlist survives to localStorage; the
rest is memory-only (cleared on reload). Most hooks call this, not `GraphQLClient`
directly: `useProperty.ts`, `useCategorizedProperties.ts`, `useLandlordProperties.ts`,
`usePropertyDetail.tsx`, most admin/host pages.

**This is the cache to reach for by default** when adding a new data-fetching hook —
follow the pattern in an existing hook like `useProperty.ts` rather than calling
`GraphQLClient` raw or inventing a new caching approach.

## CloudFront pre-generated JSON feeds (separate from the query cache)

Three independent CDN-backed read paths exist for high-traffic pages, bypassing GraphQL
entirely:

- **`src/lib/homepage-cache.ts`** — single CloudFront fetch
  (`NEXT_PUBLIC_HOMEPAGE_CACHE_URL`, path defaults to
  `homepage/{env}/long-term-properties.json`), used by `useCategorizedProperties.ts` on
  every homepage load. **No GraphQL fallback** — throws on failure.
- **`src/lib/short-term-homepage-cache.ts`** — the equivalent for the in-app short-stay
  feature, `cache: 'no-store'`, returns empty arrays (not a throw) on failure. Its GraphQL
  fallback is an explicit unfinished `// TODO`.
- **`src/lib/property-cache.ts`** — district/region search feed pages
  (`getDistrictSearchFeedPage`, `getRegionSearchFeed`), used by `useDistrictSearchFeed.ts`
  and parts of `useProperty.ts`. **Its per-property functions
  (`getPropertyFromCache`/`getPropertiesFromCache`) are dead code** — see
  [architecture.md § known gaps](./architecture.md#known-gaps--dead-code).

Short-term property *detail* (`useShortTermPropertyDetail.tsx`) has yet another,
independent implementation: direct CloudFront JSON fetch with its own bespoke 5-minute
localStorage cache, not going through either `cachedGraphQL` or `property-cache.ts`.

**If a page shows stale data after a backend change**, first identify *which* of these
four mechanisms (query cache / homepage feed / search feed / short-term detail cache) is
actually in that page's request path before assuming a TTL or invalidation rule is wrong
— they don't share a cache-busting mechanism.

## Feature flags

`src/lib/feature-flags.ts` — the flags that actually exist today:

| Flag | Env var | Default |
|---|---|---|
| GraphQL fallback when a CDN feed fails | `NEXT_PUBLIC_ENABLE_GRAPHQL_FALLBACK` | `true` |
| Property subscriptions | `NEXT_PUBLIC_ENABLE_PROPERTY_SUBSCRIPTIONS` | `true` (but see [architecture.md § known gaps](./architecture.md#known-gaps--dead-code) — the hook this would enable isn't called anywhere) |
| Lazy loading | — | `true` |
| Property comparison / saved searches | — | `false`, unimplemented placeholders |

**Known drift**: `.env.example` claims `NEXT_PUBLIC_ENABLE_GRAPHQL_FALLBACK` defaults to
`false`; the actual code default is `true`. Trust the code
(`src/lib/feature-flags.ts`), not the env-example comment, if they disagree.

## Two codegen pipelines — only one is used

Same situation as `ndotoniStays`:

1. **Amplify CLI codegen** (`.graphqlconfig.yml`) — the real pipeline. Generates
   `src/API.ts` (219KB, types) and `src/graphql/{queries,mutations,subscriptions}.ts`.
   This is what the whole app imports from.
2. **`graphql-codegen`** (`codegen.yml`) — generates `src/generated/graphql.ts`. **Zero
   importers anywhere in `src/`.** Dead code.

Regenerate after a backend schema change with:

```bash
pnpm schema:update   # schema:download (AWS CLI, needs AppSync read access) → schema:clean → amplify:codegen
```

This does **not** touch `src/generated/graphql.ts` (run `pnpm codegen` separately for
that, which normally you don't need to).

`scripts/clean-schema.js` strips Amplify's placeholder `_: Boolean` fields from the
downloaded schema before codegen runs.
