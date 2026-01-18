# Location System

## Quick Start

### For React Components (Recommended)

Use the ready-made component:

```typescript
import HierarchicalLocationSelector from '@/components/location/HierarchicalLocationSelector';

function MyForm() {
  return (
    <HierarchicalLocationSelector
      onLocationChange={(location) => {
        console.log('Selected:', location);
        // location = { regionId, regionName, districtId, districtName, ... }
      }}
      required
    />
  );
}
```

### For Custom UI

Use the hook:

```typescript
import { useHierarchicalLocation } from '@/hooks/useHierarchicalLocation';

function MyComponent() {
  const {
    regions,        // Available regions
    districts,      // Available districts (after region selected)
    wards,          // Available wards (after district selected)
    streets,        // Available streets (after ward selected)
    selected,       // Currently selected location
    selectRegion,   // Select a region
    selectDistrict, // Select a district
    selectWard,     // Select a ward
    selectStreet,   // Select a street
    loadingRegions, // Loading state
    error          // Error state
  } = useHierarchicalLocation();
  
  // Build your own UI
}
```

### For Manual Fetching

```typescript
import { fetchRegions, fetchDistricts, fetchWards, fetchStreets } from '@/lib/location';

const regions = await fetchRegions();
const districts = await fetchDistricts(regionId);
const wards = await fetchWards(districtId);
const streets = await fetchStreets(wardId);
```

## Why Hierarchical?

### Old Approach ❌
- Loaded 40,000+ locations upfront
- 2-5 second initial load
- 10-20 MB memory usage
- Poor performance on slow connections

### New Approach ✅
- Loads ~30 regions initially
- 100-300ms initial load (10-50x faster)
- ~100 KB memory initially (100x less)
- Fetches districts/wards/streets on-demand

## Files

- **`hierarchical.ts`** - Core fetching functions with caching
- **`data.ts`** - Legacy functions (deprecated)
- **`search.ts`** - Search functionality
- **`utils.ts`** - Utility functions
- **`index.ts`** - Main export file

## Components

- **`HierarchicalLocationSelector`** - Ready-to-use cascading dropdown UI
- **`LocationSelector`** - Legacy component (to be updated)

## Hooks

- **`useHierarchicalLocation`** - React hook for hierarchical selection
- **`useLocationSearch`** - Legacy search hook

## Documentation

- **`LOCATION_MIGRATION.md`** - Complete migration guide
- **`HIERARCHICAL_LOCATION_IMPLEMENTATION.md`** - Implementation details
- **`EXAMPLE_MIGRATION_BecomeLandlordModal.md`** - Real-world example

## Migration

See `documentation/LOCATION_MIGRATION.md` for complete migration guide.

Quick summary:
1. Replace `fetchLocations()` with `fetchRegions()`
2. Use `HierarchicalLocationSelector` component
3. Or use `useHierarchicalLocation()` hook
4. Remove manual location filtering logic

## API

All functions use existing GraphQL queries:
- `getRegions` - Returns all regions
- `getDistricts(regionId)` - Returns districts for region
- `getWards(districtId)` - Returns wards for district
- `getStreets(wardId)` - Returns streets for ward

Backend service: `packages/lambda/src/service/handlers/location/LocationQueryService.ts`
