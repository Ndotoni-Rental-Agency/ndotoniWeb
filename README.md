# Ndotoni Web

Next.js frontend for **ndotoni.com** — the long-term property rental product (the
platform's original/core product), plus an internal admin panel and the authenticated
landlord/agent dashboard. Talks to the shared AWS backend
([`ndotoniBackend`](https://github.com/Ndotoni-Rental-Agency/ndotoniBackend)) via AppSync
GraphQL, and shares its Cognito user pool with the sister short-term-stays frontend
([`ndotoniStays`](https://github.com/Ndotoni-Rental-Agency/ndotoniStays), ndotonistays.com)
— the same account works on both sites.

**→ For architecture, the data layer/caching, auth, and the admin/host dashboard, see
[`docs/README.md`](./docs/README.md).** This file only covers local setup.

## Prerequisites

- Node.js (Next.js 14 / React 18)
- **pnpm** — this repo has both `pnpm-lock.yaml` and a stray `package-lock.json`
  committed with no `packageManager` field pinned; use **pnpm**, since every custom
  script (`amplify codegen`, `schema:clean`, etc.) invokes it internally. Don't run `npm
  install` — you'll get a second, possibly divergent lockfile.
- AWS CLI with credentials, **only if** you need to regenerate `schema.graphql`/generated
  types against the live AppSync API, or run `get-backend-config.sh`/`get-cognito-domain.sh`.

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                      # runs on http://localhost:3000
```

### Environment variables

```
NEXT_PUBLIC_USER_POOL_ID=
NEXT_PUBLIC_USER_POOL_CLIENT_ID=
NEXT_PUBLIC_COGNITO_DOMAIN=
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=
NEXT_PUBLIC_GRAPHQL_REGION=us-west-2
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=
NEXT_PUBLIC_HOMEPAGE_CACHE_URL=
NEXT_PUBLIC_WHATSAPP_API_URL=
ANTHROPIC_API_KEY=              # server-only, used by /api/ai/* route handlers
NEXT_PUBLIC_ENABLE_SHORT_TERM_STAYS=false   # see docs/architecture.md — leave off unless you're specifically working on the dark in-app short-stay feature
NEXT_PUBLIC_ENABLE_GRAPHQL_FALLBACK=true
NEXT_PUBLIC_ENABLE_PROPERTY_SUBSCRIPTIONS=true
```

`get-backend-config.sh` and `get-cognito-domain.sh` (repo root) can pull the Cognito/AppSync
values above from the backend's deployed CloudFormation stacks if you have AWS access and
a sibling `ndotoniBackend` checkout — see their contents for the exact assumptions.

## Local development

No full local backend emulation — this app talks to a real deployed AppSync API.

```bash
pnpm dev      # next dev (port 3000)
pnpm build    # production build
pnpm start    # serve a production build locally
pnpm lint     # next lint
```

No test framework is configured in this repo (no jest/vitest/playwright, no test script).

## Regenerating GraphQL types

If the backend schema changed:

```bash
pnpm schema:update
```

See [docs/graphql-and-caching.md](./docs/graphql-and-caching.md) — there are two codegen
pipelines configured here and only one is actually used; don't run the wrong one.

## Deployment

Deploys via **Vercel**, off the `main` branch, to three domains
(`ndotoni.com` production, `dev.ndotoni.com`/`beta.ndotoni.com` as preview deployments —
no separate git branches per environment). No `vercel.json` and no CI workflow in this
repo; configuration lives in the Vercel project dashboard. `setup-vercel-env.sh <stage>
<vercel-env>` automates pulling env values from the backend's CloudFormation outputs and
pushing them to Vercel via `vercel env add`.

## Where to go next

[`docs/README.md`](./docs/README.md) — architecture, the route map (this is a much bigger
app than it looks: long-term rentals, a full admin panel, a landlord/agent dashboard, and
a feature-flagged short-term-stays implementation), the data/caching layer, and auth.
