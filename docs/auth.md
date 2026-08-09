# Auth

AWS Cognito via AWS Amplify v6 — **the same user pool as the sister `ndotoniStays`
(ndotonistays.com) app**. A user account works on both sites.

## Key files

- `src/lib/amplify.ts` — configures Cognito user pool + Hosted UI OAuth (Google/Facebook/Apple).
- `src/lib/auth-bridge.ts` (`AuthBridge`) — the actual glue, and it's deliberately
  **mixed**: sign-**up** goes through a custom backend GraphQL mutation
  (`AuthBridge.signUpWithCustom`), while sign-**in** goes through Amplify/Cognito directly
  (`AuthBridge.signInWithAmplify` → Cognito sign-in → `getMe` query to fetch the app-side
  profile). This split is intentional per the file's own header comment, not an
  inconsistency to "fix."
- `src/contexts/AuthContext.tsx` — `AuthProvider`/`useAuth()`. On mount: checks
  `AuthBridge.hasCognitoSession()`, loads a cached `user` from `localStorage['user']` for
  instant paint, refetches via `getMe`. Exposes `signIn`, `signUp`, `signInWithSocial`,
  `signUpWithSocial`, `verifyEmail`, `resendVerificationCode`, `forgotPassword`,
  `resetPassword`, `updateUser`, `submitLandlordApplication`, `signOut`, `refreshUser`,
  `setLocalUser`. **Note**: `accessToken`/`refreshToken` fields on the auth state are
  literally the placeholder string `'COGNITO_MANAGED'` — real tokens live in Amplify's own
  storage, not in this context's state. Don't try to read a real JWT out of `AuthContext`.

## Route protection: `middleware.ts` is not actually protecting anything

`middleware.ts` looks like edge-based route protection (`['/profile','/landlord','/admin','/stays','/favorites']`,
checks for an `accessToken` cookie, redirects to `/?redirect=<path>&auth=required` if
missing) — **but nothing in the codebase ever sets that cookie.** Amplify stores Cognito
session data in its own localStorage keys, not this cookie, so the middleware's check is
effectively always "not authenticated." It has been quietly not-protecting these routes.
Two more issues if you go looking at it: the protected-route list has `/landlord` (the
public marketing page) instead of `/host` (the real dashboard) — likely stale from a
rename — and the `auth=required`/`redirect` query params it appends aren't consumed
anywhere except inside `AuthGuard.tsx`, which only runs on pages that already mount it
(not on the homepage the middleware redirects to).

**Don't extend the middleware assuming it works.** If you need real route protection, the
pattern that's actually load-bearing today is client-side `AuthGuard` (next section). If
you're asked to fix middleware-based auth, that's effectively new work, not a small patch
— decide deliberately whether server-side protection is worth adding rather than assuming
the existing middleware just needs a one-line fix.

## Real protection: client-side `AuthGuard`

`src/components/auth/AuthGuard.tsx` — checks `useAuth()` (`isAuthenticated`,
`user.userType`) once the Amplify session resolves; shows a sign-in modal or redirects,
and does role-based redirects (`requiredRole`): ADMIN → `/admin`, landlords → `/host`,
others → `/`. Used in:

- `admin/layout.tsx` — `requiredRole={UserType.ADMIN}`.
- `host/layout.tsx` — `requiredRole={[TENANT, LANDLORD, AGENT, ADMIN]}`.
- Inline in `stays/page.tsx`.

`profile/page.tsx` and `favorites/page.tsx` deliberately **don't** use `AuthGuard` — they
do their own inline `isAuthenticated` checks (profile shows a "please sign in" state;
favorites just renders empty for guests) rather than hard-redirecting.

## Sign-in/up UI

`src/components/auth/` — `AuthModal.tsx` (multi-mode modal), `SignInForm.tsx`,
`SignUpForm.tsx`, `ForgotPasswordForm.tsx`, `SocialAuthButtons.tsx`, `ProfileForm.tsx`,
`AccountSettings.tsx`, `ProfileAvatar.tsx`, `useAuthModal.ts` (modal state/validation).
`src/app/auth/callback/page.tsx` handles the OAuth redirect (`refreshUser()` then route
onward).
