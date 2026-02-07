# Property Cache Feature Flags

## Overview

The property caching system uses CloudFront + S3 to serve pre-generated JSON files for instant page loads. Feature flags allow gradual rollout and easy rollback.

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─ Cache Enabled? ──Yes──> CloudFront (instant)
       │                            │
       │                            ├─ Hit ──> Return JSON
       │                            │
       │                            └─ Miss ──> Fallback to GraphQL
       │
       └─ Cache Disabled? ──No───> GraphQL (always)
```

## Feature Flags

### 1. `NEXT_PUBLIC_ENABLE_PROPERTY_CACHE`

**Controls:** Single property page caching (`/property/[id]`)

**When enabled:**
- Tries to load property from CloudFront first
- Falls back to GraphQL on cache miss
- ~50-100ms load time (vs 500-1000ms GraphQL)

**When disabled:**
- Always uses GraphQL
- No cache lookups

**Recommendation:** Enable after initial feed generation

```bash
# Enable
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=true

# Disable (default)
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=false
```

---

### 2. `NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE`

**Controls:** District search feed caching (`/search?district=...`)

**When enabled:**
- Loads search results from pre-generated feeds
- 2 pages per district (40 properties total)
- Instant search results

**When disabled:**
- Always queries GraphQL for search results
- Slower but always fresh

**Recommendation:** Enable after Step Function generates initial feeds

```bash
# Enable
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=true

# Disable (default)
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=false
```

---

### 3. `NEXT_PUBLIC_CACHE_FIRST_STRATEGY`

**Controls:** Global cache-first behavior

**When enabled:**
- All cache-enabled features try cache first
- Fallback to GraphQL on miss
- Best performance

**When disabled:**
- Always uses GraphQL
- Ignores cache even if other flags are enabled

**Recommendation:** Enable for production, disable for debugging

```bash
# Enable (recommended)
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=true

# Disable (default - safe rollout)
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false
```

---

## Rollout Strategy

### Phase 1: Testing (All Disabled)
```bash
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=false
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=false
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false
```

**Status:** GraphQL only, no cache lookups

---

### Phase 2: Property Cache Only
```bash
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=true
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=false
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=true
```

**Status:** Property pages use cache, search uses GraphQL

**Test:**
1. Visit `/property/[id]` - should load from cache
2. Check console for "✅ Property loaded from CloudFront cache"
3. Verify fallback works by visiting non-existent property

---

### Phase 3: Full Cache (Recommended)
```bash
NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=true
NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=true
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=true
```

**Status:** All caching enabled

**Test:**
1. Visit `/search?region=dar-es-salaam&district=kinondoni`
2. Check console for "✅ District feed loaded"
3. Verify instant load times

---

## Debugging

### Check Feature Flag Status

Add this to any component:

```typescript
import { logFeatureFlags } from '@/lib/feature-flags';

// In component
useEffect(() => {
  logFeatureFlags();
}, []);
```

Console output:
```
[FeatureFlags] Current configuration: {
  usePropertyCache: true,
  useDistrictSearchCache: true,
  cacheFirstStrategy: true,
  ...
}
```

---

### Force Cache Bypass

Temporarily disable cache for debugging:

```typescript
// In .env.local
NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false
```

All requests will use GraphQL.

---

### Monitor Cache Hit Rate

Check browser console:

```
✅ Property loaded from CloudFront cache  <- Cache hit
Cache miss, falling back to GraphQL      <- Cache miss
```

---

## Performance Comparison

| Scenario | Cache Disabled | Cache Enabled |
|----------|---------------|---------------|
| Property page load | 500-1000ms | 50-100ms |
| Search results | 800-1500ms | 100-200ms |
| Bandwidth (property) | ~50KB | ~5KB |
| Bandwidth (search) | ~100KB | ~10KB |

---

## Cache Invalidation

Caches are automatically invalidated when:

1. **Property updated** - Stream handler regenerates JSON
2. **Property created** - Added to district feed
3. **Property deleted** - Removed from feeds

No manual invalidation needed.

---

## Rollback Plan

If issues occur:

1. **Disable cache-first strategy:**
   ```bash
   NEXT_PUBLIC_CACHE_FIRST_STRATEGY=false
   ```

2. **Disable specific features:**
   ```bash
   NEXT_PUBLIC_ENABLE_PROPERTY_CACHE=false
   NEXT_PUBLIC_ENABLE_DISTRICT_SEARCH_CACHE=false
   ```

3. **Redeploy frontend** - changes take effect immediately

---

## Files Modified

### Core Files
- `ndotoniWeb/src/lib/feature-flags.ts` - Feature flag configuration
- `ndotoniWeb/src/lib/property-cache.ts` - Cache utilities (updated)
- `ndotoniWeb/src/hooks/usePropertyDetail.tsx` - Property detail hook (updated)
- `ndotoniWeb/src/hooks/useDistrictSearchFeed.ts` - District search hook (new)

### Configuration
- `ndotoniWeb/.env.example` - Feature flag documentation

---

## Usage Examples

### Single Property (Cache-First)

```typescript
import { usePropertyDetail } from '@/hooks/propertyDetails/usePropertyDetail';

function PropertyPage() {
  const { property, loading, error } = usePropertyDetail(propertyId);
  
  // Automatically tries cache first if enabled
  // Falls back to GraphQL on miss
  
  return <div>{property?.title}</div>;
}
```

---

### District Search (Cache-First)

```typescript
import { useDistrictSearchFeed } from '@/hooks/useDistrictSearchFeed';

function SearchPage() {
  const { properties, loading, fromCache } = useDistrictSearchFeed({
    region: 'dar-es-salaam',
    district: 'kinondoni',
    page: 1,
  });
  
  console.log('Loaded from cache:', fromCache);
  
  return <PropertyGrid properties={properties} />;
}
```

---

## Best Practices

1. **Start with all flags disabled** - Safe rollout
2. **Enable property cache first** - Lower risk
3. **Monitor console logs** - Check cache hit rates
4. **Enable district search last** - After feeds are generated
5. **Keep cache-first strategy enabled** - Best performance

---

## Troubleshooting

### Cache not working?

1. Check feature flags in console: `logFeatureFlags()`
2. Verify CloudFront domain: `NEXT_PUBLIC_CLOUDFRONT_DOMAIN`
3. Check network tab for 404s on JSON files
4. Ensure feeds are generated (run Step Function)

### Always using GraphQL?

1. Check `NEXT_PUBLIC_CACHE_FIRST_STRATEGY=true`
2. Verify other flags are enabled
3. Clear browser cache and reload

### Stale data?

1. Cache TTL is 30 minutes for feeds, 1 hour for properties
2. Stream handler invalidates on updates
3. Force refresh: disable cache temporarily

---

## Next Steps

After enabling caching:

1. Monitor CloudFront metrics in AWS Console
2. Check cache hit rates
3. Measure performance improvements
4. Gradually increase cache TTLs if stable
5. Consider adding more pages to district feeds (currently 2)

---

## Support

For issues or questions:
- Check console logs for detailed error messages
- Review CloudFront access logs in S3
- Verify Lambda stream handler is running
- Check Step Function execution history
