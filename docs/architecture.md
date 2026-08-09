# Architecture

## Tech stack

- **Next.js 14, App Router** (`src/app/`), React 18, TypeScript, Tailwind CSS 3
  (`class-variance-authority` + `tailwind-merge` for variant composition).
- **Auth**: AWS Amplify v6 + Cognito — see [auth.md](./auth.md).
- **Data**: AppSync GraphQL via Amplify's `generateClient()`, layered under an
  in-memory/localStorage query cache and separate CloudFront-served pre-generated JSON
  feeds for high-traffic pages — see [graphql-and-caching.md](./graphql-and-caching.md).
- **State**: no Redux/Zustand — plain React Context (`AuthContext`, `ChatContext`,
  `LanguageContext`, `ThemeContext`, `ScrollContext`, `HousingRequestInlineContext`) plus
  ~40 custom hooks in `src/hooks/`.
- **Notable libs**: `recharts` (admin/host dashboard charts), `leaflet`/`react-leaflet`
  (maps), `fuse.js` (fuzzy search), `heic2any` (iPhone photo conversion),
  `react-phone-number-input`, `@vercel/analytics`.
- **No test framework configured** (no jest/vitest/playwright, no test files anywhere).
- Deployed on **Vercel**, no CI workflow in this repo — see the [root README](../README.md).

## Route map (`src/app/`)

### Public — long-term rentals (the core product)

| Route | What it is |
|---|---|
| `/` | Homepage — hero search, property categories, includes a `ShortStaysBanner` linking out to `ndotonistays.com` |
| `/search` | Long-term property search/filter results |
| `/property/[id]` | Property detail (SSR metadata + JSON-LD, client component for gallery/info/apply) |
| `/property/[id]/apply` | Rental application form |
| `/property/create` | Quick draft-property creation entry point |
| `/landlord` | **Public marketing page** ("become a landlord") — not the authenticated dashboard, that's `/host` |
| `/agent/[phone]` | Public agent/landlord storefront by phone number |
| `/favorites` | Saved properties (no `AuthGuard` — conditional fetch based on auth state, not a hard gate) |
| `/refer`, `/refer/submit` | Landlord referral program |
| `/about`, `/contact`, `/invest`, `/blog`, `/blog/[slug]`, `/terms`, `/privacy`, `/data-deletion` | Static/marketing/legal |
| `/edit/[token]` | Token-based property self-edit link (no login) — hits `NEXT_PUBLIC_WHATSAPP_API_URL`, not GraphQL |

### Authenticated — landlord/agent dashboard

`/host/*` — see [admin-and-host.md](./admin-and-host.md).

### Authenticated — internal admin

`/admin/*` — see [admin-and-host.md](./admin-and-host.md).

### Auth & account

| Route | What it is |
|---|---|
| `/auth/callback` | OAuth redirect landing page (Cognito Hosted UI → Google/Apple/Facebook) |
| `/profile`, `/verify-email`, `/reset-password` | Account pages |
| `/stays` | **Not the short-term-stays feature** — a "my current lease" tenant dashboard (rent due, payment status, utilities) for an existing **long-term** lease. Currently renders hardcoded placeholder data, not real API data — don't trust what it shows as ground truth for a real lease. |
| `/myProps` | `redirect('/host')` shim, kept for old links |

### Short-term stays (in-app, feature-flagged — see "known gaps" below)

`search-short-stay`, `short-property/[id]`, `booking/[propertyId]`,
`booking/confirmation/[bookingId]` — a real, working nightly-stay search/booking/payment
implementation, gated behind `featureFlags.shortTermStays`
(`NEXT_PUBLIC_ENABLE_SHORT_TERM_STAYS`, default `false`). Distinct from, and much smaller
than, the dedicated `ndotoniStays` app — this is a secondary/experimental path, not the
primary way users book short-term stays today (that's `ndotonistays.com`).

### Chat & AI

| Route | What it is |
|---|---|
| `/chat` | In-app guest↔host messaging |
| `/api/ai/generate-title`, `/api/ai/generate-description`, `/api/ai/predict-price` | Route Handlers calling Anthropic **server-side** (`ANTHROPIC_API_KEY`) to help hosts write listings |

### Dev/misc

`/test-location` — dev-only scratch page for the location selector, not linked from nav.
`robots.ts`, `sitemap.ts`, `not-found.tsx` — Next.js metadata routes.

## Known gaps / dead code

Found by direct comparison with the (now-deleted) legacy docs — worth knowing so you don't
build on something that isn't actually wired in, or waste time chasing a symptom that's
actually just unused code:

- **`middleware.ts`'s auth check is dead.** It protects `['/profile','/landlord','/admin','/stays','/favorites']`
  by checking for a cookie literally named `accessToken` — but nothing in the codebase
  ever sets that cookie (Amplify stores Cognito tokens in its own localStorage keys, not
  this cookie). The middleware's check is effectively always "unauthenticated." Real
  protection is entirely client-side (`AuthGuard`) — see [auth.md](./auth.md). Also note
  the protected-route list itself is stale: it lists `/landlord` (the public marketing
  page) instead of `/host` (the actual dashboard).
- **Property real-time subscriptions are implemented but not wired into any page.**
  `src/hooks/usePropertySubscription.ts` + `src/lib/subscriptions/PropertySubscriptionManager.ts`
  are a complete, working implementation (singleton, per-property WebSocket subscription,
  auto-reconnect) — but have zero call sites anywhere in `src/app` or `src/components`.
  If you're asked to "enable live property updates," the hook already exists; it just
  needs to be called from somewhere (most likely `/property/[id]`).
- **Per-property CloudFront cache functions are dead for long-term properties.**
  `src/lib/property-cache.ts`'s `getPropertyFromCache`/`getPropertiesFromCache` have zero
  external call sites — the real property-detail hook
  (`src/hooks/propertyDetails/usePropertyDetail.tsx`) fetches via the GraphQL query cache
  instead (see [graphql-and-caching.md](./graphql-and-caching.md)).
- **`nest-ql-schema` is an unused dependency.** Listed in `package.json`, never imported
  anywhere in `src/`. The app maintains its own generated types via Amplify codegen
  (`src/API.ts`), not via this package.
- **`ndotoni/` and `ndotoniSchemaQL/`** — empty directories at repo root, leftover from a
  past cleanup. Safe to ignore.
- **Font**: root layout actually uses Google's `DM_Sans`, not "Inter" as older docs
  claimed.
- **Package manager ambiguity**: both `pnpm-lock.yaml` and `package-lock.json` are
  committed, no `packageManager` field pinned. Use pnpm (see [root README](../README.md)).
