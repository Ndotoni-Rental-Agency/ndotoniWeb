#!/bin/bash

# Bundle Analysis Script
# This script builds the app and generates a bundle analysis report

echo "🔍 Analyzing bundle size..."
echo ""

# Build with bundle analyzer
ANALYZE=true npm run build

echo ""
echo "✅ Bundle analysis complete!"
echo ""
echo "📊 Reports generated:"
echo "  - .next/analyze/client.html (client-side bundles)"
echo "  - .next/analyze/server.html (server-side bundles)"
echo ""
echo "💡 Tips to reduce bundle size:"
echo "  1. Use dynamic imports for heavy components"
echo "  2. Remove unused dependencies"
echo "  3. Use tree-shakeable imports"
echo "  4. Enable code splitting"
echo ""
