# Nest Design System

A comprehensive, modular design system for the Nest property management platform built with React, TypeScript, and Tailwind CSS.

## Overview

The Nest Design System provides a consistent, reusable set of components and design tokens that ensure a cohesive user experience across the entire application. It's built with flexibility in mind, allowing easy customization of colors, spacing, and other design properties.

## Key Features

- **Type-safe components** with TypeScript
- **Consistent theming** with design tokens
- **Flexible variants** using class-variance-authority
- **Accessibility-first** approach
- **Easy customization** through theme configuration
- **Tailwind CSS integration**

## Quick Start

```tsx
import { Button, Card, Input, Badge } from '@/design-system';

function MyComponent() {
  return (
    <Card padding="lg" hover="lift">
      <h2>Welcome to Nest</h2>
      <Input label="Email" placeholder="Enter your email" />
      <Badge variant="success">Verified</Badge>
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </Card>
  );
}
```

## Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>

// Variants: primary, secondary, outline, ghost, link, destructive
// Sizes: sm, md, lg, xl, icon
```

### Card

Container component for grouping related content.

```tsx
<Card variant="elevated" padding="lg" hover="lift">
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
    <CardDescription>View property information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>

// Variants: default, elevated, outlined, ghost
// Padding: none, sm, md, lg
// Hover: none, lift, glow
```

### Input

Form input component with validation states and icons.

```tsx
<Input
  label="Property Title"
  placeholder="Enter title"
  error="Title is required"
  leftIcon={<SearchIcon />}
  variant="default"
  size="md"
/>

// Variants: default, error, success
// Sizes: sm, md, lg
```

### Badge

Small status indicators and labels.

```tsx
<Badge variant="success" size="md">
  Verified
</Badge>

// Variants: default, secondary, destructive, outline, success, warning, info
// Sizes: sm, md, lg
```

## Theme Configuration

The design system uses a centralized theme configuration in `theme.ts`:

```tsx
import { theme } from '@/design-system/theme';

// Access colors
const primaryColor = theme.colors.primary[500]; // #ef4444

// Access spacing
const mediumSpacing = theme.spacing.md; // 1rem

// Access typography
const baseFontSize = theme.typography.fontSize.base; // 1rem
```

### Color System

The color system is based on a consistent scale from 50 (lightest) to 900 (darkest):

- **Primary**: Red-based brand colors
- **Secondary**: Gray-based neutral colors
- **Success**: Green-based success states
- **Warning**: Yellow-based warning states
- **Error**: Red-based error states

### Customizing Colors

To change the primary brand color, update the `theme.ts` file:

```tsx
export const theme = {
  colors: {
    primary: {
      // Update these values to your brand colors
      500: '#your-brand-color',
      600: '#your-brand-color-dark',
      // ... other shades
    },
  },
};
```

Then update your Tailwind CSS configuration to use the new colors:

```css
:root {
  --color-primary-500: your-new-rgb-values;
}
```

## Utilities

### cn() Function

Utility for merging Tailwind classes with proper precedence:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-classes', conditionalClasses, className)} />
```

### Format Functions

Utility functions for consistent formatting:

```tsx
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';

formatCurrency(1500000, 'TZS'); // "TSh 1,500,000"
formatDate(new Date()); // "Dec 16, 2024"
formatRelativeTime(new Date()); // "2h ago"
```

## Best Practices

### Component Usage

1. **Always use design system components** instead of custom implementations
2. **Prefer semantic variants** over custom styling
3. **Use the theme tokens** for consistent spacing and colors
4. **Leverage TypeScript** for type safety

### Styling Guidelines

1. **Use design tokens** from the theme configuration
2. **Follow the spacing scale** (xs, sm, md, lg, xl, etc.)
3. **Stick to the color palette** defined in the theme
4. **Use consistent border radius** values

### Accessibility

1. **All components include proper ARIA attributes**
2. **Focus states are clearly visible**
3. **Color contrast meets WCAG guidelines**
4. **Keyboard navigation is supported**

## File Structure

```
src/design-system/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Badge.tsx
├── theme.ts
├── index.ts
└── README.md
```

## Migration Guide

### From Legacy CSS Classes

Replace legacy button classes:

```tsx
// Before
<button className="btn btn-primary">Click me</button>

// After
<Button variant="primary">Click me</Button>
```

Replace legacy card classes:

```tsx
// Before
<div className="card">Content</div>

// After
<Card>Content</Card>
```

### Adding New Components

1. Create component in `components/` directory
2. Use `class-variance-authority` for variants
3. Include proper TypeScript types
4. Export from `index.ts`
5. Update this README

## Contributing

When adding new components:

1. Follow the existing patterns and conventions
2. Include comprehensive TypeScript types
3. Add proper documentation and examples
4. Ensure accessibility compliance
5. Test across different screen sizes

## Support

For questions or issues with the design system, please refer to the main project documentation or create an issue in the project repository.