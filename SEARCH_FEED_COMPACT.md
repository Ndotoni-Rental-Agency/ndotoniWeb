# Compact Search Feed - Optimized Design

## Why Compact?

**Problem with full objects**: Storing complete property data in search feeds wastes bandwidth and storage.

**Solution**: Store only minimal metadata (price, bedrooms, etc.) + pre-sorted ID arrays. Frontend filters/sorts metadata, then fetches full property JSONs in parallel with `Promise.all`.

## Feed Structure (Compact)

```json
{
  "region": "Dar es Salaam",
  "total": 150,
  "updated": "2026-02-06T15:30:00Z",
  
  "items": [
    {
      "propertyId": "abc123",
      "monthlyRent": 850000,
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 120,
      "propertyType": "APARTMENT",
      "district": "Kinondoni",
      "createdAt": "2026-02-06T10:00:00Z"
    }
  ],
  
  "sorted": {
    "priceLow": ["id1", "id2", "id3"],
    "priceHigh": ["id3", "id2", "id1"],
    "dateNew": ["id3", "id2", "id1"]
  },
  
  "filters": {
    "priceRange": [200000, 5000000],
    "bedrooms": [1, 2, 3, 4, 5],
    "bathrooms": [1, 2, 3],
    "types": ["APARTMENT", "HOUSE", "STUDIO"],
    "districts": ["Kinondoni", "Ilala", "Temeke"]
  }
}
```

## Size Comparison

### Full Objects (Old)
```json
{
  "properties": [
    {
      "id": "abc123",
      "title": "2 Bedroom Apartment - Masaki",
      "description": "Beautiful apartment...",
      "pricing": { "monthlyRent": 850000, "currency": "TZS" },
      "address": { "region": "Dar es Salaam", "district": "Kinondoni", "ward": "Masaki" },
      "specifications": { "bedrooms": 2, "bathrooms": 2, "area": 120 },
      "media": { "images": [...], "thumbnail": "..." },
      "landlordId": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```
**Size**: ~500 bytes per property × 150 = ~75 KB

### Minimal Metadata (New)
```json
{
  "items": [
    { 
      "propertyId": "abc123", 
      "monthlyRent": 850000, 
      "bedrooms": 2, 
      "bathrooms": 2, 
      "area": 120, 
      "propertyType": "APARTMENT", 
      "district": "Kinondoni", 
      "createdAt": "..." 
    }
  ]
}
```
**Size**: ~150 bytes per property × 150 = ~22 KB

**Savings**: 70% smaller! (75 KB → 22 KB)

## Usage Pattern

### 1. Load Search Feed (15 KB, instant)
```typescript
import { getRegionSearchFeed } from '@/lib/property-cache';

const searchFeed = await getRegionSearchFeed('Dar es Salaam');
// 15 KB, 50-150ms from CloudFront
```

### 2. Filter & Sort (Client-Side, <1ms)
```typescript
import { filterAndSortProperties } from '@/lib/property-cache';

// User applies filters - instant, no API call!
const propertyIds = filterAndSortProperties(
  searchFeed,
  { 
    minPrice: 500000, 
    maxPrice: 1500000,
    bedrooms: 2 
  },
  'price-low'
);
// Returns: ["id1", "id2", "id3", ...]
```

### 3. Fetch Full Properties (Promise.all, parallel)
```typescript
import { getPropertiesFromCache } from '@/lib/property-cache';

// Fetch first 20 properties in parallel
const properties = await getPropertiesFromCache(propertyIds.slice(0, 20));
// 20 parallel requests, ~50-150ms total (CloudFront)
```

### Complete Example
```typescript
'use client';

import { useState, useEffect } from 'react';
import { 
  getRegionSearchFeed, 
  filterAndSortProperties,
  getPropertiesFromCache,
  type SearchFeedData,
  type SearchFilters,
  type SortOption 
} from '@/lib/property-cache';

export function SearchPage({ region }: { region: string }) {
  const [searchFeed, setSearchFeed] = useState<SearchFeedData | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('date-new');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load search feed once
  useEffect(() => {
    getRegionSearchFeed(region).then(setSearchFeed);
  }, [region]);
  
  // Filter, sort, and fetch properties
  useEffect(() => {
    if (!searchFeed) return;
    
    setLoading(true);
    
    // 1. Filter and sort (instant, client-side)
    const propertyIds = filterAndSortProperties(searchFeed, filters, sortOption);
    
    // 2. Fetch first 20 properties (parallel)
    getPropertiesFromCache(propertyIds.slice(0, 20))
      .then(setProperties)
      .finally(() => setLoading(false));
      
  }, [searchFeed, filters, sortOption]);
  
  if (!searchFeed) return <div>Loading...</div>;
  
  return (
    <div>
      {/* Filters - changes are instant! */}
      <FilterPanel 
        filters={filters}
        onChange={setFilters}
        aggregations={searchFeed.filters}
      />
      
      {/* Sort - changes are instant! */}
      <SortDropdown value={sortOption} onChange={setSortOption} />
      
      {/* Results */}
      {loading ? <Spinner /> : <PropertyGrid properties={properties} />}
      
      {/* Stats */}
      <div>Showing {properties.length} of {searchFeed.total} properties</div>
    </div>
  );
}
```

## Pre-Sorted Arrays (No Filtering)

When no filters applied, use pre-sorted arrays for instant results:

```typescript
const searchFeed = await getRegionSearchFeed('Dar es Salaam');

// Use pre-sorted arrays (no sorting needed!)
const lowestPriceIds = searchFeed.sorted.priceLow;
const highestPriceIds = searchFeed.sorted.priceHigh;
const newestIds = searchFeed.sorted.dateNew;

// Fetch properties
const properties = await getPropertiesFromCache(lowestPriceIds.slice(0, 20));
```

## Performance Benefits

| Operation | Time | Network |
|-----------|------|---------|
| Load search feed | 50-150ms | 15 KB |
| Filter (client-side) | <1ms | 0 KB |
| Sort (client-side) | <1ms | 0 KB |
| Fetch 20 properties | 50-150ms | ~100 KB |
| **Total** | **~100-300ms** | **~115 KB** |

Compare to GraphQL query for each filter change:
- **Before**: 500-1000ms per filter change
- **After**: <1ms per filter change (instant!)

## Key Metadata Fields

```typescript
{
  propertyId: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  district?: string;
  ward?: string;
  createdAt: string;
}
```

Readable field names for better developer experience.

## Filter Aggregations

Use `searchFeed.filters` to build filter UI:

```typescript
// Price range slider
<PriceRangeSlider
  min={searchFeed.filters.priceRange[0]}
  max={searchFeed.filters.priceRange[1]}
/>

// Bedroom buttons (only show available counts)
{searchFeed.filters.bedrooms.map(count => (
  <Button key={count}>{count} BR</Button>
))}

// Property type dropdown
<Select options={searchFeed.filters.types} />
```

## Pagination

```typescript
const PAGE_SIZE = 20;
const [page, setPage] = useState(0);

// Get property IDs for current page
const propertyIds = filterAndSortProperties(searchFeed, filters, sortOption);
const pageIds = propertyIds.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

// Fetch properties for current page
const properties = await getPropertiesFromCache(pageIds);
```

## Infinite Scroll

```typescript
const [displayedIds, setDisplayedIds] = useState<string[]>([]);

// Load more
const loadMore = async () => {
  const allIds = filterAndSortProperties(searchFeed, filters, sortOption);
  const nextIds = allIds.slice(displayedIds.length, displayedIds.length + 20);
  
  const newProperties = await getPropertiesFromCache(nextIds);
  setProperties(prev => [...prev, ...newProperties]);
  setDisplayedIds(prev => [...prev, ...nextIds]);
};
```

## CloudFront URLs

```
Region:
https://d2bstvyam1bm1f.cloudfront.net/search/region/dar-es-salaam.json

District:
https://d2bstvyam1bm1f.cloudfront.net/search/region-district/dar-es-salaam/kinondoni.json
```

## Why This Works

1. **Small feed** - 15 KB vs 75 KB (80% smaller)
2. **Fast filtering** - Client-side, <1ms
3. **Fast sorting** - Pre-sorted arrays or client-side
4. **Parallel fetching** - Promise.all for visible properties
5. **CloudFront edge** - All requests served from edge locations

Result: Instant filter/sort changes, fast initial load, minimal bandwidth.
