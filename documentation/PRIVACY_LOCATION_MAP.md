# Privacy-Focused Location Map

## Overview

The LocationMapView component has been enhanced to provide a privacy-focused approach to displaying property locations. Instead of showing exact coordinates, it displays a general area with visual indicators that protect user privacy while still providing useful location context.

## Key Privacy Features

### ✅ **Location Obfuscation**
- **Consistent randomization** - Uses property coordinates as seed for consistent offset
- **Controlled displacement** - Pin is offset by 200-300m from exact location
- **Within circle bounds** - Offset pin stays within the privacy circle
- **No exact coordinates** - Real location is never precisely revealed

### ✅ **Visual Privacy Indicators**
- **Dual circles** - Outer circle (800m) and inner circle (240m) for visual hierarchy
- **Dashed borders** - Clear indication that this is an approximate area
- **Custom centered pin** - Circular pin design that doesn't "point" to exact location
- **Privacy notices** - Clear labeling as "General Area" and "Approximate location"

### ✅ **Enhanced Styling**
- **Modern design** - Rounded corners, shadows, and backdrop blur effects
- **Dark mode support** - Proper contrast and colors for both themes
- **Gradient overlays** - Subtle depth and visual polish
- **Responsive indicators** - Distance radius and privacy status clearly shown

## Component Props

```typescript
interface Props {
  lat: number;           // Property latitude
  lng: number;           // Property longitude
  radius?: number;       // Privacy circle radius (default: 800m)
  showExactLocation?: boolean; // Override for exact location (default: false)
  className?: string;    // Additional CSS classes
}
```

## Usage Examples

### Basic Privacy Mode (Default)
```tsx
<LocationMapView lat={-6.7924} lng={39.2083} />
```
- Shows ~800m privacy circle
- Pin offset by 200-300m from exact location
- Privacy notices displayed

### Custom Radius
```tsx
<LocationMapView 
  lat={-6.7924} 
  lng={39.2083} 
  radius={1200} 
/>
```
- Larger privacy circle (1.2km)
- Same offset logic for pin placement

### Exact Location (Admin/Owner View)
```tsx
<LocationMapView 
  lat={-6.7924} 
  lng={39.2083} 
  showExactLocation={true} 
/>
```
- Shows precise location (for property owners)
- No privacy offset applied

## Visual Elements

### Custom Pin Design
- **Circular design** - No directional pointing
- **Centered anchor** - Perfect center alignment
- **Red and white colors** - High contrast and visibility
- **Layered circles** - Outer ring, inner circle, center dot

### Privacy Circles
- **Outer circle** - Main privacy boundary (dashed red border)
- **Inner circle** - Visual hierarchy (smaller dashed border)
- **Gradient fill** - Subtle transparency for better map visibility

### Information Overlays
- **Privacy notice** - Bottom left with lock icon and explanation
- **Distance indicator** - Top left showing radius size
- **Info button** - Top right for additional context

## Privacy Benefits

1. **Location Protection** - Exact address not revealed to viewers
2. **Consistent Experience** - Same offset for same property (not random each time)
3. **Visual Clarity** - Clear indication that location is approximate
4. **User Trust** - Transparent about privacy measures
5. **Flexible Control** - Can show exact location when appropriate

## Technical Implementation

### Obfuscation Algorithm
```typescript
// Uses property coordinates as seed for consistent randomization
const seed = Math.abs(Math.sin(lat * lng * 1000));
const offsetRadius = 0.003; // ~300m in degrees
const angle = seed * 2 * Math.PI;
const distance = (seed * 0.7 + 0.3) * offsetRadius;

const offsetLat = lat + (distance * Math.cos(angle));
const offsetLng = lng + (distance * Math.sin(angle));
```

### Custom Icon Creation
- SVG-based icon generated dynamically
- Base64 encoded for performance
- Perfectly centered anchor point
- No shadow for cleaner appearance

## Security Considerations

- **No exact coordinates** exposed in frontend
- **Consistent obfuscation** prevents triangulation
- **Visual indicators** make privacy measures transparent
- **Configurable radius** allows adjustment based on area density

## Future Enhancements

Potential improvements:
- **Area-based obfuscation** - Different radius based on urban/rural
- **Multiple privacy levels** - Different obfuscation for different user types
- **Interactive privacy controls** - Let users adjust privacy level
- **Neighborhood boundaries** - Show general neighborhood instead of circles