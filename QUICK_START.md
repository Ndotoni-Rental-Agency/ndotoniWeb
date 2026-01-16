# Frontend Deployment Quick Start

## TL;DR - Deploy to Vercel in 5 Steps

### 1. Get Backend Configuration

After deploying your backend, run:

```bash
cd ndotoniWeb
./get-backend-config.sh beta
```

This outputs the values you need for Vercel.

### 2. Connect to Vercel

1. Go to https://vercel.com/new
2. Import: `Ndotoni-Rental-Agency/ndotoniBackend`
3. Set Root Directory: `ndotoniWeb`
4. Click Deploy

### 3. Add Custom Domains

In Vercel Project Settings → Domains:

- **Production**: `ndotoni.com`, `www.ndotoni.com`
- **Beta**: `beta.ndotoni.com` (assign to Preview)
- **Dev**: `dev.ndotoni.com` (assign to Preview)

### 4. Configure Environment Variables

In Vercel Project Settings → Environment Variables:

**For Production** (select "Production" environment):
```bash
NEXT_PUBLIC_USER_POOL_ID=<from step 1>
NEXT_PUBLIC_USER_POOL_CLIENT_ID=<from step 1>
NEXT_PUBLIC_COGNITO_DOMAIN=<from step 1>
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://ndotoni.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://ndotoni.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=<from step 1>
NEXT_PUBLIC_GRAPHQL_REGION=af-south-1
NEXT_PUBLIC_API_KEY=<from step 1>
```

**For Beta** (select "Preview" environment):
```bash
NEXT_PUBLIC_USER_POOL_ID=us-west-2_7wcOXxOs5
NEXT_PUBLIC_USER_POOL_CLIENT_ID=7lp18reb2k0kpv6bp6oskdc2mp
NEXT_PUBLIC_COGNITO_DOMAIN=rental-app-dev-055929692194.auth.us-west-2.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://beta.ndotoni.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://beta.ndotoni.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://wkayzoj7qzcttar73wgh5cx2le.appsync-api.us-west-2.amazonaws.com/graphql
NEXT_PUBLIC_GRAPHQL_REGION=us-west-2
NEXT_PUBLIC_API_KEY=da2-soqyespwfve3povw56yjmaw6de
```

**For Dev** (select "Preview" environment):
```bash
# Same as beta but with dev URLs
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://dev.ndotoni.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://dev.ndotoni.com
# ... other values from dev backend
```

### 5. Deploy

Push to main branch:
```bash
git add .
git commit -m "Configure multi-environment deployment"
git push origin main
```

Vercel will automatically deploy to all environments!

## Testing

- **Dev**: https://dev.ndotoni.com
- **Beta**: https://beta.ndotoni.com  
- **Production**: https://ndotoni.com

## Local Development

```bash
cd ndotoniWeb
npm install
npm run dev
```

Your `.env.local` file is already configured for local development.

## Need Help?

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.
