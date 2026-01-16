#!/bin/bash

# Script to extract backend configuration for frontend deployment
# Run this after deploying your CDK stacks

STAGE=${1:-beta}
PROFILE=${2:-beta}

echo "🔍 Getting backend configuration for: $STAGE"
echo "Using AWS profile: $PROFILE"
echo ""

cd ../packages/cdk

case $STAGE in
  dev)
    REGION="us-west-2"
    ;;
  beta)
    REGION="us-west-2"
    ;;
  prod)
    REGION="af-south-1"
    ;;
  *)
    echo "❌ Invalid stage. Use: dev, beta, or prod"
    exit 1
    ;;
esac

echo "📋 Extracting outputs from CloudFormation..."
echo ""

# Get Auth Stack outputs
echo "🔐 Cognito Configuration:"
aws cloudformation describe-stacks \
  --stack-name "RentalApp-Auth-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId` || OutputKey==`UserPoolClientId` || OutputKey==`CognitoDomainUrl`].[OutputKey,OutputValue]' \
  --output table

echo ""

# Get Service Stack outputs
echo "🌐 GraphQL API Configuration:"
aws cloudformation describe-stacks \
  --stack-name "RentalApp-Service-$STAGE" \
  --region $REGION \
  --profile $PROFILE \
  --query 'Stacks[0].Outputs[?OutputKey==`GraphQLApiEndpoint` || OutputKey==`ApiKey`].[OutputKey,OutputValue]' \
  --output table

echo ""
echo "✅ Copy these values to Vercel environment variables"
echo ""
echo "Environment: $STAGE"
echo "Domain: $([ "$STAGE" = "prod" ] && echo "ndotoni.com" || echo "$STAGE.ndotoni.com")"
echo ""
