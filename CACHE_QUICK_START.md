# Property Cache - Quick Start Guide

## TL;DR

Enable CloudFront caching for instant page loads. All flags default to `false` for safe rollout.

---

## Enable Everything (Production)

Add to `.env.local`:

```bash
# CloudFront CDN
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=https://d2bstvyam1bm1f.cloudfront.net

# Enable all caching features
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=true
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=true
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=true
```

Restart dev server:
```bash
npm run dev
```

---

## Test It Works

### 1. Property Page
Visit: `http://localhost:3000/property/[any-property-id]`

Console should show:
```
✅ Property loaded from CloudFront cache
```

### 2. Search Page
Visit: `http://localhost:3000/search?region=dar-es-salaam&district=kinondoni`

Console should show:
```
✅ District feed loaded: 20 properties
```

---

## Disable Everything (Rollback)

```bash
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false
```

That's it. All caching disabled, GraphQL only.

---

## Performance

| Feature | Before | After |
|---------|--------|-------|
| Property page | 500-1000ms | 50-100ms |
| Search results | 800-1500ms | 100-200ms |

---

## How It Works

1. **User visits page** → Try CloudFront first
2. **Cache hit** → Return JSON (instant)
3. **Cache miss** → Fallback to GraphQL
4. **Property updated** → Stream handler regenerates JSON automatically

---

## Files You Need to Know

- `src/lib/feature-flags.ts` - Feature flag config
- `src/lib/property-cache.ts` - Cache utilities
- `src/hooks/usePropertyDetail.tsx` - Property detail (cache-first)
- `src/hooks/useDistrictSearchFeed.ts` - Search feed (cache-first)

---

## Troubleshooting

**Cache not working?**
```typescript
import { logFeatureFlags } from '@/lib/feature-flags';
logFeatureFlags(); // Check console
```

**Force GraphQL only?**
```bash
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false
```

**Check cache hit rate?**
Look for console logs:
- `✅ Property loaded from CloudFront cache` = Hit
- `Cache miss, falling back to GraphQL` = Miss

---

## Gradual Rollout

### Week 1: Property Cache Only
```bash
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=true
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=true
```

### Week 2: Add Search Cache
```bash
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=true
```

### Week 3: Monitor & Optimize
Check CloudFront metrics, adjust TTLs if needed.

---

## That's It!

Cache-first with automatic fallback. No manual invalidation needed.

For detailed docs: See `PROPERTY_CACHE_FEATURE_FLAGS.md`
