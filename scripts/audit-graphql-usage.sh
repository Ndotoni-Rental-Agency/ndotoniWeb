#!/bin/bash

# GraphQL Client Usage Audit Script
# This script helps identify files that need migration to the centralized GraphQLClient

echo "================================================"
echo "GraphQL Client Usage Audit"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Count files using generateClient
echo "📊 Files using generateClient():"
echo "--------------------------------"
GENERATE_CLIENT_FILES=$(grep -r "generateClient" src --include="*.ts" --include="*.tsx" --exclude-dir=node_modules -l 2>/dev/null | grep -v "graphql-client.ts" | grep -v "__tests__")
GENERATE_CLIENT_COUNT=$(echo "$GENERATE_CLIENT_FILES" | grep -v "^$" | wc -l)

if [ $GENERATE_CLIENT_COUNT -gt 0 ]; then
    echo -e "${RED}Found $GENERATE_CLIENT_COUNT files:${NC}"
    echo "$GENERATE_CLIENT_FILES" | while read -r file; do
        if [ -n "$file" ]; then
            echo "  ❌ $file"
        fi
    done
else
    echo -e "${GREEN}✅ No files found using generateClient()${NC}"
fi

echo ""
echo "📊 Files using client.graphql():"
echo "--------------------------------"
CLIENT_GRAPHQL_FILES=$(grep -r "client\.graphql(" src --include="*.ts" --include="*.tsx" --exclude-dir=node_modules -l 2>/dev/null | grep -v "graphql-client.ts" | grep -v "__tests__")
CLIENT_GRAPHQL_COUNT=$(echo "$CLIENT_GRAPHQL_FILES" | grep -v "^$" | wc -l)

if [ $CLIENT_GRAPHQL_COUNT -gt 0 ]; then
    echo -e "${RED}Found $CLIENT_GRAPHQL_COUNT files:${NC}"
    echo "$CLIENT_GRAPHQL_FILES" | while read -r file; do
        if [ -n "$file" ]; then
            # Count occurrences in each file
            COUNT=$(grep -c "client\.graphql(" "$file" 2>/dev/null)
            echo "  ❌ $file ($COUNT occurrences)"
        fi
    done
else
    echo -e "${GREEN}✅ No files found using client.graphql()${NC}"
fi

echo ""
echo "📊 Files already using GraphQLClient:"
echo "-------------------------------------"
GRAPHQL_CLIENT_FILES=$(grep -r "GraphQLClient\." src --include="*.ts" --include="*.tsx" --exclude-dir=node_modules -l 2>/dev/null | grep -v "graphql-client.ts")
GRAPHQL_CLIENT_COUNT=$(echo "$GRAPHQL_CLIENT_FILES" | grep -v "^$" | wc -l)

if [ $GRAPHQL_CLIENT_COUNT -gt 0 ]; then
    echo -e "${GREEN}Found $GRAPHQL_CLIENT_COUNT files:${NC}"
    echo "$GRAPHQL_CLIENT_FILES" | while read -r file; do
        if [ -n "$file" ]; then
            echo "  ✅ $file"
        fi
    done
else
    echo -e "${YELLOW}No files found using GraphQLClient yet${NC}"
fi

echo ""
echo "================================================"
echo "Summary"
echo "================================================"
TOTAL_NEEDS_MIGRATION=$((GENERATE_CLIENT_COUNT + CLIENT_GRAPHQL_COUNT))
echo -e "Files needing migration: ${RED}$TOTAL_NEEDS_MIGRATION${NC}"
echo -e "Files already migrated: ${GREEN}$GRAPHQL_CLIENT_COUNT${NC}"

if [ $TOTAL_NEEDS_MIGRATION -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}📖 See GRAPHQL_CLIENT_MIGRATION.md for migration guide${NC}"
fi

echo ""
