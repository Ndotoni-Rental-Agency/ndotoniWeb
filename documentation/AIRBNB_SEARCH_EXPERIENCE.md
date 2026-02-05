# Airbnb-Style Search Experience

## Overview

The new search experience is inspired by Airbnb's intuitive and elegant search interface, providing users with a seamless way to find properties.

## Key Features

### 1. **Expandable Search Bar**
- **Compact Mode**: Shows a clean, minimal search bar with current selections
- **Expanded Mode**: Opens into a full search interface with multiple sections
- **Smooth Animations**: Transitions between states with elegant animations

### 2. **Segmented Search Sections**
The search is divided into logical sections:

- **Where**: Location search (regions and districts)
- **Type**: Property type selection (Apartment, House, Studio, Room)
- **Price**: Price range filtering (min/max)
- **Details**: Bedrooms and bathrooms selection

### 3. **Sticky Search Header**
- Appears when scrolling past the hero section (400px)
- Shows compact search bar for quick access
- Maintains search state across the page

### 4. **Interactive Features**
- **Click-to-expand**: Click any section to expand and edit
- **Visual feedback**: Active sections are highlighted
- **Clear all**: Quick reset button to clear all filters
- **Search button**: Prominent search action in the bar

### 5. **Mobile Optimized**
- Touch-friendly interface
- Responsive design that adapts to screen size
- Smooth scrolling and animations

## Components

### `AirbnbSearchBar`
Main search component with two variants:
- `hero`: Full-size search bar for hero section
- `sticky`: Compact version for sticky header

**Props:**
```typescript
interface AirbnbSearchBarProps {
  variant?: 'hero' | 'sticky';
  isScrolled?: boolean;
  className?: string;
}
```

### `StickySearchHeader`
Sticky header that appears on scroll, containing the compact search bar.

**Features:**
- Auto-shows after 400px scroll
- Includes logo and search bar
- Fixed positioning with high z-index

## Usage

### In Hero Section
```tsx
import { AirbnbSearchBar } from '@/components/ui';

<AirbnbSearchBar variant="hero" />
```

### In Sticky Header
```tsx
import { StickySearchHeader } from '@/components/layout';

// Automatically appears on scroll
<StickySearchHeader />
```

## User Flow

1. **Initial State**: User sees compact search bar in hero
2. **Click to Expand**: Clicking opens the full search interface
3. **Select Location**: User searches and selects a location
4. **Add Filters**: User can add property type, price range, and details
5. **Search**: Click search button or press Enter to navigate to results
6. **Scroll**: Sticky header appears with compact search for quick access

## Styling

### Animations
- `animate-fade-in`: Smooth fade-in for overlay
- `animate-slide-down`: Slide down animation for sticky header
- `animate-fade-in-up-hero`: Hero section entrance animation

### Colors
- Primary: Red (#EF4444)
- Background: White/Gray-800 (dark mode)
- Borders: Gray-200/Gray-700 (dark mode)

### Shadows
- `shadow-lg`: Compact search bar
- `shadow-xl`: Hover state
- `shadow-2xl`: Expanded search bar
- `dropdown-shadow`: Custom shadow for dropdowns

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- High contrast in dark mode

## Performance

- Portal rendering for overlays (prevents z-index issues)
- Debounced location search
- Lazy loading of location data
- Optimized re-renders with proper state management

## Future Enhancements

- [ ] Date range picker for move-in dates
- [ ] Guest/occupant counter
- [ ] Saved searches
- [ ] Recent searches
- [ ] Popular locations quick access
- [ ] Map integration
- [ ] Voice search
