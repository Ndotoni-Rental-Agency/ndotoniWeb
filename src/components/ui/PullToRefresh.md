# Pull to Refresh Component

A mobile-app-like pull-to-refresh component for web applications.

## Features

- ✅ **Touch Support**: Works with touch gestures on mobile devices
- ✅ **Mouse Support**: Also works with mouse drag on desktop for testing
- ✅ **Visual Feedback**: Animated refresh indicator with progress feedback
- ✅ **Customizable**: Configurable threshold, resistance, and styling
- ✅ **Smooth Animations**: Natural feeling pull-to-refresh experience
- ✅ **Dark Mode**: Supports light and dark themes
- ✅ **TypeScript**: Full TypeScript support

## Usage

```tsx
import { PullToRefresh } from '@/components/ui/PullToRefresh';

function MyPage() {
  const handleRefresh = async () => {
    // Your refresh logic here
    await fetchData();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div>Your page content here</div>
    </PullToRefresh>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRefresh` | `() => Promise<void>` | - | Function called when refresh is triggered |
| `children` | `React.ReactNode` | - | Content to wrap with pull-to-refresh |
| `threshold` | `number` | `80` | Distance in pixels to trigger refresh |
| `resistance` | `number` | `2.5` | Pull resistance factor (higher = harder to pull) |
| `enabled` | `boolean` | `true` | Whether pull-to-refresh is enabled |
| `className` | `string` | `''` | Additional CSS classes |

## How it Works

1. **Detection**: Only triggers when user is at the top of the page (`window.scrollY === 0`)
2. **Pull Phase**: User pulls down, indicator appears and grows
3. **Trigger**: When pull distance exceeds threshold, "Release to refresh" appears
4. **Refresh**: On release, calls `onRefresh` function and shows loading state
5. **Complete**: Returns to normal state after refresh completes

## Visual States

- **Pull to refresh**: Initial state when pulling
- **Release to refresh**: When threshold is reached
- **Refreshing...**: During the refresh operation

## Browser Support

- ✅ Modern browsers with touch events
- ✅ Safari iOS
- ✅ Chrome Android
- ✅ Desktop browsers (with mouse simulation)