# Favicon Setup

## Overview

The favicon now uses the same design as the Ndotoni logo - a house icon with an orange-to-pink gradient background.

## Implementation

### Files Created

1. **`src/app/icon.tsx`** - Standard favicon (32x32px)
   - Dynamically generated using Next.js ImageResponse API
   - Matches the logo gradient (orange → red → pink)
   - White house icon

2. **`src/app/apple-icon.tsx`** - Apple touch icon (180x180px)
   - Larger version for iOS home screen
   - Same design with rounded corners
   - Better quality for high-DPI displays

### How It Works

Next.js 13+ automatically detects these special files and generates the appropriate favicon tags:

```html
<link rel="icon" href="/icon?<hash>" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-icon?<hash>" type="image/png" sizes="180x180" />
```

The `?<hash>` ensures proper cache busting when the icon changes.

## Design Specs

### Colors
- Gradient: `linear-gradient(135deg, #fb923c 0%, #ef4444 50%, #ec4899 100%)`
- Icon: White (`#ffffff`)

### Sizes
- Standard favicon: 32x32px
- Apple touch icon: 180x180px

### Border Radius
- Standard: 6px (subtle rounding)
- Apple: 36px (iOS style rounding)

## Testing

### Local Development
1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Check the browser tab - you should see the orange gradient house icon

### Browser Tab
The favicon appears in:
- Browser tabs
- Bookmarks
- History
- Search results

### iOS Home Screen
When users add the site to their iOS home screen, they'll see the larger, rounded version.

## Customization

To change the favicon design, edit:
- `src/app/icon.tsx` - Standard favicon
- `src/app/apple-icon.tsx` - Apple touch icon

You can:
- Change colors in the `background` gradient
- Modify the SVG path for a different icon
- Adjust sizes and border radius
- Add shadows or other effects

## Alternative: Static Images

If you prefer static images instead of dynamic generation:

1. Create PNG files:
   - `src/app/icon.png` (32x32px)
   - `src/app/apple-icon.png` (180x180px)

2. Delete the `.tsx` files

3. Next.js will automatically use the static images

## Browser Support

- ✅ Chrome/Edge - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- ✅ iOS Safari - Apple touch icon support
- ✅ Android Chrome - Full support

## Cache Busting

Next.js automatically adds a hash to the icon URL, so browsers will fetch the new icon when it changes. No manual cache clearing needed.

## Performance

- Icons are generated at build time
- Cached by browsers
- No runtime overhead
- Optimized PNG output

## References

- [Next.js Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response)
