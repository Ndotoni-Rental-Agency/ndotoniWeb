#!/bin/bash

# Test Cache Feature Flags
# Quick script to test different cache configurations

set -e

echo "🧪 Cache Feature Flag Tester"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
fi

# Function to update env var
update_env() {
    local key=$1
    local value=$2
    
    if grep -q "^${key}=" .env.local; then
        # Update existing
        sed -i.bak "s/^${key}=.*/${key}=${value}/" .env.local
    else
        # Add new
        echo "${key}=${value}" >> .env.local
    fi
}

# Function to show current config
show_config() {
    echo -e "${YELLOW}Current Configuration:${NC}"
    echo "---"
    grep "NEXT_PUBLIC_ENABLE_PROPERTY_CACHE" .env.local || echo "NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=false"
    grep "NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE" .env.local || echo "NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=false"
    grep "NEXT_PUBLIC_CACHE_FIRST_STRATEGY" .env.local || echo "NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false"
    echo "---"
    echo ""
}

# Menu
echo "Select configuration:"
echo ""
echo "1) All Disabled (GraphQL only)"
echo "2) Property Cache Only"
echo "3) District Search Cache Only"
echo "4) All Enabled (Full Cache)"
echo "5) Show Current Config"
echo "6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Setting: All Disabled${NC}"
        update_env "NEXT_PUBLIC_ENABLE_PROPERTY_CACHE" "false"
        update_env "NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE" "false"
        update_env "NEXT_PUBLIC_CACHE_FIRST_STRATEGY" "false"
        echo -e "${GREEN}✅ All caching disabled${NC}"
        echo "All requests will use GraphQL"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}Setting: Property Cache Only${NC}"
        update_env "NEXT_PUBLIC_ENABLE_PROPERTY_CACHE" "true"
        update_env "NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE" "false"
        update_env "NEXT_PUBLIC_CACHE_FIRST_STRATEGY" "true"
        echo -e "${GREEN}✅ Property cache enabled${NC}"
        echo "Property pages will use cache, search uses GraphQL"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}Setting: District Search Cache Only${NC}"
        update_env "NEXT_PUBLIC_ENABLE_PROPERTY_CACHE" "false"
        update_env "NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE" "true"
        update_env "NEXT_PUBLIC_CACHE_FIRST_STRATEGY" "true"
        echo -e "${GREEN}✅ District search cache enabled${NC}"
        echo "Search pages will use cache, property pages use GraphQL"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}Setting: All Enabled${NC}"
        update_env "NEXT_PUBLIC_ENABLE_PROPERTY_CACHE" "true"
        update_env "NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE" "true"
        update_env "NEXT_PUBLIC_CACHE_FIRST_STRATEGY" "true"
        echo -e "${GREEN}✅ All caching enabled${NC}"
        echo "All pages will use cache-first strategy"
        ;;
    5)
        echo ""
        show_config
        exit 0
        ;;
    6)
        echo ""
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
show_config

# Clean up backup file
rm -f .env.local.bak

echo -e "${YELLOW}⚠️  Restart your dev server for changes to take effect:${NC}"
echo "   npm run dev"
echo ""
echo -e "${GREEN}✨ Done!${NC}"
