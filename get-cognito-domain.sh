#!/bin/bash

# Script to get the Cognito domain for your user pool

USER_POOL_ID="us-west-2_7wcOXxOs5"

echo "Fetching Cognito domain for user pool: $USER_POOL_ID"
echo ""

# Get the domain from AWS
DOMAIN=$(aws cognito-idp describe-user-pool \
  --user-pool-id $USER_POOL_ID \
  --region us-west-2 \
  --query 'UserPool.Domain' \
  --output text)

if [ "$DOMAIN" != "None" ] && [ ! -z "$DOMAIN" ]; then
  echo "✅ Found Cognito domain: $DOMAIN"
  echo ""
  echo "Add this to your .env.local:"
  echo "NEXT_PUBLIC_COGNITO_DOMAIN=$DOMAIN"
  echo ""
  echo "Full domain URL:"
  echo "https://$DOMAIN.auth.us-west-2.amazoncognito.com"
else
  echo "❌ No domain found for this user pool"
  echo ""
  echo "You need to create a domain in the AWS Console:"
  echo "1. Go to: https://console.aws.amazon.com/cognito/v2/idp/user-pools"
  echo "2. Select your user pool: rental-app-users-dev"
  echo "3. Go to: App integration → Domain"
  echo "4. Click 'Create Cognito domain' or 'Create custom domain'"
  echo "5. Enter a domain prefix (e.g., rental-app-dev)"
  echo "6. Save and run this script again"
fi
