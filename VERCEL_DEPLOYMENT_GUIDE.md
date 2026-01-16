# Vercel Multi-Environment Deployment Guide

This guide explains how to deploy the Ndotoni frontend to Vercel with separate dev, beta, and production environments.

## Architecture Overview

- **Dev Environment**: `dev.ndotoni.com` → Deploys from `main` branch (preview)
- **Beta Environment**: `beta.ndotoni.com` → Deploys from `main` branch (preview)
- **Production Environment**: `ndotoni.com` → Deploys from `main` branch (production)

## Prerequisites

1. Vercel account connected to your GitHub repository
2. Custom domains configured in your DNS provider
3. Backend infrastructure deployed (Cognito, AppSync, etc.)

## Step 1: Initial Vercel Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `Ndotoni-Rental-Agency/ndotoniBackend`
4. Set **Root Directory** to `ndotoniWeb`
5. Framework Preset: Next.js (auto-detected)
6. Click "Deploy" (this creates your production environment)

## Step 2: Configure Custom Domains

### Production Domain
1. Go to Project Settings → Domains
2. Add domain: `ndotoni.com`
3. Add domain: `www.ndotoni.com`
4. Configure DNS records as instructed by Vercel

### Beta Environment
1. Go to Project Settings → Domains
2. Add domain: `beta.ndotoni.com`
3. In domain settings, assign it to **Preview** branch: `main`
4. Configure DNS: `CNAME beta.ndotoni.com → cname.vercel-dns.com`

### Dev Environment
1. Go to Project Settings → Domains
2. Add domain: `dev.ndotoni.com`
3. In domain settings, assign it to **Preview** branch: `main`
4. Configure DNS: `CNAME dev.ndotoni.com → cname.vercel-dns.com`

## Step 3: Environment Variables

You need to configure environment variables for each environment in Vercel.

### For Dev Environment

Go to Project Settings → Environment Variables, add these for **Preview** environment:

```
NEXT_PUBLIC_USER_POOL_ID=<from CDK output: RentalApp-Auth-dev>
NEXT_PUBLIC_USER_POOL_CLIENT_ID=<from CDK output: RentalApp-Auth-dev>
NEXT_PUBLIC_COGNITO_DOMAIN=rental-app-dev-055929692194.auth.us-west-2.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://dev.ndotoni.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://dev.ndotoni.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=<from CDK output: RentalApp-Service-dev>
NEXT_PUBLIC_GRAPHQL_REGION=us-west-2
NEXT_PUBLIC_API_KEY=<from CDK output: RentalApp-Service-dev>
```

### For Beta Environment

Add these for **Preview** environment (you can have multiple preview deployments):

```
NEXT_PUBLIC_USER_POOL_ID=us-west-2_7wcOXxOs5
NEXT_PUBLIC_USER_POOL_CLIENT_ID=7lp18reb2k0kpv6bp6oskdc2mp
NEXT_PUBLIC_COGNITO_DOMAIN=rental-app-dev-055929692194.auth.us-west-2.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://beta.ndotoni.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://beta.ndotoni.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://wkayzoj7qzcttar73wgh5cx2le.appsync-api.us-west-2.amazonaws.com/graphql
NEXT_PUBLIC_GRAPHQL_REGION=us-west-2
NEXT_PUBLIC_API_KEY=da2-soqyespwfve3povw56yjmaw6de
```

### For Production Environment

Add these for **Production** environment:

```
NEXT_PUBLIC_USER_POOL_ID=<from CDK output: RentalApp-Auth-prod>
NEXT_PUBLIC_USER_POOL_CLIENT_ID=<from CDK output: RentalApp-Auth-prod>
NEXT_PUBLIC_COGNITO_DOMAIN=rental-app-prod-977099001723.auth.af-south-1.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://ndotoni.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://ndotoni.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=<from CDK output: RentalApp-Service-prod>
NEXT_PUBLIC_GRAPHQL_REGION=af-south-1
NEXT_PUBLIC_API_KEY=<from CDK output: RentalApp-Service-prod>
```

## Step 4: Get CDK Output Values

After deploying your backend with CDK, get the values:

```bash
# For dev
cd packages/cdk
npx cdk deploy --all --context stage=dev --outputs-file outputs-dev.json

# For beta
npx cdk deploy --all --context stage=beta --outputs-file outputs-beta.json

# For prod
npx cdk deploy --all --context stage=prod --outputs-file outputs-prod.json
```

Look for these outputs:
- `UserPoolId`
- `UserPoolClientId`
- `CognitoDomainUrl`
- `GraphQLApiEndpoint`
- `ApiKey`

## Step 5: Domain-Based Environment Detection (Alternative)

If you want Vercel to automatically use the right environment based on domain, you can use this approach:

1. Set ALL environment variables in Vercel for ALL environments
2. Use domain detection in your code (already configured in `amplify.ts`)

The code will automatically detect which domain it's running on and use the appropriate config.

## Step 6: Deployment Workflow

### Automatic Deployments

- **Push to `main`**: Triggers deployment to all environments
  - Production: `ndotoni.com`
  - Preview deployments: `beta.ndotoni.com`, `dev.ndotoni.com`

### Manual Deployments

You can also trigger deployments manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview (beta/dev)
cd ndotoniWeb
vercel

# Deploy to production
vercel --prod
```

## Step 7: Testing

After deployment, test each environment:

1. **Dev**: https://dev.ndotoni.com
2. **Beta**: https://beta.ndotoni.com
3. **Production**: https://ndotoni.com

Test authentication flow:
- Sign up with email
- Sign in with Google
- OAuth redirects work correctly

## Troubleshooting

### OAuth Redirect Mismatch

If you get "redirect_uri_mismatch" error:
1. Check Cognito User Pool Client callback URLs include your domain
2. Verify `NEXT_PUBLIC_REDIRECT_SIGN_IN` matches exactly
3. Redeploy backend after updating callback URLs

### Environment Variables Not Working

1. Check variable names start with `NEXT_PUBLIC_`
2. Verify they're set for the correct environment (Preview vs Production)
3. Redeploy after changing environment variables

### GraphQL Errors

1. Verify API endpoint is correct
2. Check API key is valid
3. Ensure CORS is configured in AppSync

## Advanced: Branch-Based Deployments

If you want different branches for different environments:

1. Create branches: `dev`, `beta`, `main`
2. In Vercel Project Settings → Git:
   - Production Branch: `main`
   - Enable automatic deployments for `dev` and `beta` branches
3. Assign domains:
   - `dev.ndotoni.com` → `dev` branch
   - `beta.ndotoni.com` → `beta` branch
   - `ndotoni.com` → `main` branch

## Monitoring

- View deployment logs in Vercel Dashboard
- Set up Vercel Analytics for performance monitoring
- Configure error tracking (Sentry, etc.)

## Security Notes

- Never commit `.env.local` to git
- Use Vercel's encrypted environment variables
- Rotate API keys regularly
- Enable Vercel's security features (DDoS protection, etc.)
