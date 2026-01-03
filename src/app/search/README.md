# Search Results Page

This page displays all available properties when a search is performed.

## Features

- **URL-based Search**: Search parameters are passed via URL query parameters (for future filtering)
- **All Properties Display**: Shows all available properties regardless of search criteria
- **Responsive Grid**: Properties displayed in a responsive grid layout
- **Breadcrumb Navigation**: Shows search context and easy navigation back to home
- **Sort Options**: Sort functionality (to be implemented)

## URL Parameters

The search page accepts the following query parameters:

- `region` - Filter by region
- `district` - Filter by district  
- `ward` - Filter by ward
- `propertyType` - Filter by property type
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `bedrooms` - Minimum bedrooms filter
- `moveInDate` - Move-in date filter
- `duration` - Lease duration filter
- `q` - General search query

## Example URLs

```
/search?region=Dar%20es%20Salaam
/search?q=apartment&minPrice=500000
/search?ward=Masaki&propertyType=APARTMENT
```

## Components Used

- `PropertyCard` - Individual property display
- `SearchFilters` - Advanced filtering interface
- `Button` - UI buttons for actions
- Property grid CSS for responsive layout

## Data Flow

1. URL parameters are parsed on page load (for display purposes)
2. All properties are fetched from GraphQL API
3. All properties are displayed without filtering
4. Results are displayed in responsive grid
5. Future: Filtering and search functionality will be implemented

## Navigation

- SearchBar component navigates to this page when locations are clicked
- Shows all properties regardless of search criteria (filtering disabled for now)
- Provides dedicated page for browsing the full property catalog
- Breadcrumb navigation shows search context

## Current Status

**Filtering is currently disabled** - the page shows all available properties regardless of search parameters. This allows users to browse the complete property catalog while the filtering functionality is being developed.