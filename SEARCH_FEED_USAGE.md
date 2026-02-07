# Search Feed Usage Guide

## Overview

Search feeds provide property metadata for client-side filtering and sorting without fetching full property JSONs. This makes search pages blazing fast.

## Feed Structure

### Region Feed
```
search/region/dar-es-salaam.json
```

### Region-District Feed
```
search/region-district/dar-es-salaam/kinondoni.json
```

## Feed Contents

```json
{
  "region": "Dar es Salaam",
  "district": "Kinondoni",  // Only in district feeds
  "properties": [
    {
      "id": "abc123",
      "price": 850000,
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 120,
      "propertyType": "APARTMENT",
      "district": "Kinondoni",
      "ward": "Masaki",
      "createdAt": "2026-02-06T10:00:00Z",
      "updatedAt": "2026-02-06T15:00:00Z"
    }
  ],
  "totalCount": 150,
  "updatedAt": "2026-02-06T15:30:00Z",
  
  // Pre-sorted property IDs for instant sorting
  "sortedByPrice": {
    "lowest": ["id1", "id2", "id3"],
    "highest": ["id3", "id2", "id1"]
  },
  "sortedByDate": {
    "newest": ["id3", "id2", "id1"],
    "oldest": ["id1", "id2", "id3"]
  },
  
  // Filter aggregations for UI
  "filters": {
    "priceRange": { "min": 200000, "max": 5000000 },
    "bedroomCounts": [1, 2, 3, 4, 5],
    "bathroomCounts": [1, 2, 3],
    "propertyTypes": ["APARTMENT", "HOUSE", "STUDIO"],
    "districts": ["Kinondoni", "Ilala", "Temeke"],
    "wards": ["Masaki", "Mikocheni", "Oysterbay"]
  }
}
```

## Usage Examples

### 1. Basic Search Page

```typescript
import { 
  getRegionSearchFeed, 
  filterAndSortProperties,
  getPropertiesFromCache 
} from '@/lib/property-cache';

async function SearchPage({ region }: { region: string }) {
  // 1. Fetch search feed (instant, from CloudFront)
  const searchFeed = await getRegionSearchFeed(region);
  
  if (!searchFeed) {
    return <div>No properties found</div>;
  }
  
  // 2. Apply filters and sorting (client-side, instant)
  const propertyIds = filterAndSortProperties(
    searchFeed,
    { 
      minPrice: 500000, 
      maxPrice: 1500000,
      bedrooms: 2 
    },
    'price-low'
  );
  
  // 3. Fetch only the filtered properties (parallel, from CloudFront)
  const properties = await getPropertiesFromCache(propertyIds.slice(0, 20));
  
  return <PropertyGrid properties={properties} />;
}
```

### 2. Search with Dynamic Filters

```typescript
'use client';

import { useState, useEffect } from 'react';
import { 
  getRegionSearchFeed, 
  filterProperties,
  sortProperties,
  type SearchFeedData,
  type SearchFilters,
  type SortOption 
} from '@/lib/property-cache';

export function SearchWithFilters({ region }: { region: string }) {
  const [searchFeed, setSearchFeed] = useState<SearchFeedData | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('date-new');
  
  useEffect(() => {
    // Load search feed once
    getRegionSearchFeed(region).then(setSearchFeed);
  }, [region]);
  
  if (!searchFeed) return <div>Loading...</div>;
  
  // Filter and sort (instant, no API calls)
  const filtered = filterProperties(searchFeed.properties, filters);
  const sorted = sortProperties(filtered, sortOption);
  const propertyIds = sorted.map(p => p.id);
  
  return (
    <div>
      {/* Filters UI */}
      <FilterPanel 
        filters={filters}
        onChange={setFilters}
        aggregations={searchFeed.filters}
      />
      
      {/* Sort dropdown */}
      <SortDropdown value={sortOption} onChange={setSortOption} />
      
      {/* Results */}
      <PropertyList propertyIds={propertyIds} />
      
      {/* Stats */}
      <div>
        Showing {filtered.length} of {searchFeed.totalCount} properties
      </div>
    </div>
  );
}
```

### 3. Using Pre-Sorted Arrays (Fastest)

```typescript
import { getRegionSearchFeed, getSortedPropertyIds } from '@/lib/property-cache';

async function LowestPriceProperties({ region }: { region: string }) {
  const searchFeed = await getRegionSearchFeed(region);
  
  if (!searchFeed) return null;
  
  // Use pre-sorted array (no sorting needed!)
  const propertyIds = getSortedPropertyIds(searchFeed, 'price-low');
  
  // Fetch first 10 cheapest properties
  const properties = await getPropertiesFromCache(propertyIds.slice(0, 10));
  
  return <PropertyGrid properties={properties} />;
}
```

### 4. District-Specific Search

```typescript
import { getRegionDistrictSearchFeed } from '@/lib/property-cache';

async function DistrictSearch({ region, district }: Props) {
  // Fetch district-specific feed
  const searchFeed = await getRegionDistrictSearchFeed(region, district);
  
  if (!searchFeed) return null;
  
  // All properties are already filtered by district
  const propertyIds = searchFeed.sortedByPrice.lowest;
  
  return <PropertyGrid propertyIds={propertyIds} />;
}
```

### 5. Filter UI with Aggregations

```typescript
function FilterPanel({ filters, onChange, aggregations }: Props) {
  return (
    <div>
      {/* Price range slider */}
      <PriceRangeSlider
        min={aggregations.priceRange.min}
        max={aggregations.priceRange.max}
        value={[filters.minPrice, filters.maxPrice]}
        onChange={(range) => onChange({ 
          ...filters, 
          minPrice: range[0], 
          maxPrice: range[1] 
        })}
      />
      
      {/* Bedroom filter */}
      <BedroomFilter
        options={aggregations.bedroomCounts}
        value={filters.bedrooms}
        onChange={(bedrooms) => onChange({ ...filters, bedrooms })}
      />
      
      {/* Property type filter */}
      <PropertyTypeFilter
        options={aggregations.propertyTypes}
        value={filters.propertyType}
        onChange={(propertyType) => onChange({ ...filters, propertyType })}
      />
      
      {/* District filter (for region feeds) */}
      {aggregations.districts && (
        <DistrictFilter
          options={aggregations.districts}
          value={filters.district}
          onChange={(district) => onChange({ ...filters, district })}
        />
      )}
    </div>
  );
}
```

## Performance Benefits

### Before (GraphQL Query)
```typescript
// Every filter/sort change = new GraphQL query
const properties = await graphql.query({
  query: searchProperties,
  variables: { region, minPrice, maxPrice, bedrooms, sort }
});
// 500-1000ms per query
```

### After (Search Feed)
```typescript
// Load feed once
const searchFeed = await getRegionSearchFeed(region); // 50-150ms

// Filter/sort instantly (client-side)
const filtered = filterProperties(searchFeed.properties, filters); // <1ms
const sorted = sortProperties(filtered, sortOption); // <1ms

// Fetch only visible properties
const properties = await getPropertiesFromCache(sorted.slice(0, 20)); // 50-150ms
```

**Result**: Instant filter/sort changes, no loading spinners!

## Best Practices

1. **Load feed once** - Cache in component state, filter/sort client-side
2. **Use pre-sorted arrays** - When no filters, use `sortedByPrice` or `sortedByDate`
3. **Lazy load properties** - Fetch full data only for visible items
4. **Show aggregations** - Use `filters` object to build filter UI
5. **Pagination** - Slice property IDs, fetch in batches

## API Reference

```typescript
// Fetch feeds
getRegionSearchFeed(region: string): Promise<SearchFeedData | null>
getRegionDistrictSearchFeed(region: string, district: string): Promise<SearchFeedData | null>

// Filter/sort
filterProperties(properties: PropertyMetadata[], filters: SearchFilters): PropertyMetadata[]
sortProperties(properties: PropertyMetadata[], sortOption: SortOption): PropertyMetadata[]
filterAndSortProperties(searchFeed: SearchFeedData, filters: SearchFilters, sortOption: SortOption): string[]

// Get pre-sorted IDs
getSortedPropertyIds(searchFeed: SearchFeedData, sortOption: SortOption): string[]

// Fetch full property data
getPropertiesFromCache(propertyIds: string[]): Promise<PropertyCacheData[]>
```

## CloudFront URLs

```
Region: https://d2bstvyam1bm1f.cloudfront.net/search/region/dar-es-salaam.json
District: https://d2bstvyam1bm1f.cloudfront.net/search/region-district/dar-es-salaam/kinondoni.json
```

## Automatic Updates

Search feeds are automatically regenerated when:
- Property is created in the region/district
- Property is updated (price, bedrooms, etc.)
- Property is deleted
- Property location changes

No manual cache management needed!
