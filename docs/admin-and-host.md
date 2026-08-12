# Admin Panel & Host Dashboard

Two separate authenticated areas, both role-gated via `AuthGuard` (see [auth.md](./auth.md)).
Easy to conflate by name — `/landlord` is a public marketing page, `/host` is the real
authenticated dashboard.

## Host dashboard (`/host/*`)

For landlords/agents. Gated to roles `TENANT | LANDLORD | AGENT | ADMIN` via
`host/layout.tsx`'s `AuthGuard`.

| Route | What it is |
|---|---|
| `/host` | Overview |
| `/host/properties` | List/create/edit landlord's own properties, including drafts (`/host/properties/create`, `/host/properties/draft`, `/host/properties/[id]/edit`, `/host/properties/[id]/calendar`) |
| `/host/calendar` | Availability calendar |
| `/host/inbox` | Messages (chat) |
| `/host/media` | Media library |
| `/host/subscription` | Listing plans / subscription payment |
| `/host/whatsapp` | WhatsApp number association |
| `/host/[landlordId]` | The landlord/agent's own **public** profile page (same underlying data as `/agent/[phone]`) |
| `/host/create` | Redirects to `/become-host`-equivalent property creation flow |

`AuthGuard` in `host/layout.tsx` handles the loading state (skeleton while the Amplify
session resolves) and shows a sign-in modal for unauthenticated users rather than a hard
redirect on the dashboard shell itself.

## Admin panel (`/admin/*`)

Internal-only, gated to `UserType.ADMIN` via `admin/layout.tsx`'s `AuthGuard`. Full
platform oversight:

| Route | What it is |
|---|---|
| `/admin` | Dashboard/overview |
| `/admin/properties` | Property CRUD + bulk import |
| `/admin/users` | User management |
| `/admin/applications` | Rental applications |
| `/admin/landlord-applications` | Landlord onboarding applications |
| `/admin/landlord-leads` | Prospective landlord leads (pre-application) |
| `/admin/property-owners` | Property owner profiles |
| `/admin/housing-requests` | Tenant housing requests (captured via the WhatsApp bot on the backend) |
| `/admin/inquiries` | Contact-us form submissions |
| `/admin/availability` | Property availability oversight |
| `/admin/referrals` | Referral program submissions |
| `/admin/whatsapp-conversations` | Read-only viewer into WhatsApp bot conversation history |

This panel is a direct GraphQL client onto the backend's `admin` Lambda — see the backend
repo's
[`docs/services/notifications-and-admin.md`](https://github.com/Ndotoni-Rental-Agency/ndotoniBackend/blob/main/docs/services/notifications-and-admin.md)
for what each of these areas does server-side (most of it is straightforward CRUD over the
tables listed in the backend's `docs/database.md`).

## Working on either

- Both use the same `AuthGuard` pattern — copy the existing `layout.tsx` in either folder
  as the template for a new gated sub-area, rather than inventing a new protection
  mechanism.
- Both are heavy consumers of `recharts` for dashboard visualizations (earnings, stats).
- Data fetching in these areas mostly goes through the query cache
  (`cachedGraphQL`), not the CloudFront feeds — see
  [graphql-and-caching.md](./graphql-and-caching.md). CloudFront feeds are for
  high-traffic *public* pages (homepage, search), not admin/host screens.
