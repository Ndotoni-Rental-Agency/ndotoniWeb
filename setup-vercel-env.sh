#!/bin/bash

# Script to set up Vercel environment variables from AWS CloudFormation outputs
# Usage: ./setup-vercel-env.sh <stage> <environment>
# Example: ./setup-vercel-env.sh prod production

set -e

STAGE=${1:-prod}
VERCEL_ENV=${2:-production}  # production, preview, or development

if [ -z "$STAGE" ] || [ -z "$VERCEL_ENV" ]; then
  echo "Usage: $0 <stage> <vercel-environment>"
  echo "Example: $0 prod production"
  echo "Example: $0 beta preview"
  echo "Example: $0 dev development"
  exit 1
fi

case $STAGE in
  dev)
    REGION="us-west-2"
    PROFILE="dev"
    ;;
  beta)
    REGION="us-west-2"
    PROFILE="beta"
    ;;
  prod)
    REGION="af-south-1"
    PROFILE="default"
    ;;
  *)
    echo "❌ Invalid stage. Use: dev, beta, or prod"
    exit 1
    ;;
esac

echo "🚀 Setting up Vercel environment variables"
echo "Stage: $STAGE"
echo "Vercel Environment: $VERCEL_ENV"
echo "AWS Region: $REGION"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with: npm i -g vercel"
    exit 1
fi

# Get CloudFormation outputs
echo "📋 Fetching CloudFormation outputs..."

USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name "RentalApp-Auth-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
  --output text)

USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name "RentalApp-Auth-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
  --output text)

COGNITO_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name "RentalApp-Auth-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`CognitoDomainUrl`].OutputValue' \
  --output text)

APPSYNC_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name "RentalApp-Service-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`GraphQLApiEndpoint`].OutputValue' \
  --output text)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name "RentalApp-Storage-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomain`].OutputValue' \
  --output text 2>/dev/null || echo "")

echo "✅ Retrieved configuration values"
echo ""

# Set environment variables in Vercel
echo "📤 Setting Vercel environment variables..."

echo "$STAGE" | vercel env add NEXT_PUBLIC_STAGE $VERCEL_ENV
echo "$REGION" | vercel env add NEXT_PUBLIC_AWS_REGION $VERCEL_ENV
echo "$USER_POOL_ID" | vercel env add NEXT_PUBLIC_USER_POOL_ID $VERCEL_ENV
echo "$USER_POOL_CLIENT_ID" | vercel env add NEXT_PUBLIC_USER_POOL_CLIENT_ID $VERCEL_ENV
echo "$COGNITO_DOMAIN" | vercel env add NEXT_PUBLIC_COGNITO_DOMAIN $VERCEL_ENV
echo "$APPSYNC_ENDPOINT" | vercel env add NEXT_PUBLIC_APPSYNC_ENDPOINT $VERCEL_ENV

if [ -n "$CLOUDFRONT_DOMAIN" ]; then
  echo "$CLOUDFRONT_DOMAIN" | vercel env add NEXT_PUBLIC_CLOUDFRONT_DOMAIN $VERCEL_ENV
fi

echo ""
echo "✅ Vercel environment variables set successfully!"
echo ""
echo "📋 Summary:"
echo "  Stage: $STAGE"
echo "  Environment: $VERCEL_ENV"
echo "  Region: $REGION"
echo "  User Pool: $USER_POOL_ID"
echo "  AppSync: $APPSYNC_ENDPOINT"
echo ""
echo "🎯 Next steps:"
echo "  1. Verify variables: vercel env ls"
echo "  2. Deploy: vercel --prod (for production) or vercel (for preview)"
echo ""
