# Font Guide for Ndotoni

## Font Setup

We're using **Plus Jakarta Sans** as the primary font for the entire Ndotoni app.

### Plus Jakarta Sans
- **Used for:** Everything - headings, body text, buttons, forms
- **Class:** `font-sans` (default, applied automatically)
- **Characteristics:** Modern, friendly, highly readable, versatile
- **Weights available:** 200, 300, 400, 500, 600, 700, 800

## Why Plus Jakarta Sans?

✅ **Excellent readability** - Perfect for property listings and descriptions  
✅ **Modern & professional** - Great for a property platform  
✅ **Friendly appearance** - Approachable for users  
✅ **Wide weight range** - From ExtraLight (200) to ExtraBold (800)  
✅ **Great for both headings and body text** - Consistent design  
✅ **Optimized for screens** - Clear at all sizes  

## Usage Examples

### Headings (using font weights for hierarchy)
```jsx
<h1 className="text-4xl font-bold">Main Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-medium">Subsection</h3>
```

### Body Text
```jsx
<p className="text-base font-normal">Regular paragraph text</p>
<p className="text-sm font-light">Light descriptive text</p>
```

### Buttons & CTAs
```jsx
<button className="font-semibold">Primary Button</button>
<button className="font-medium">Secondary Button</button>
```

### Property Cards
```jsx
<div className="property-card">
  <h3 className="text-lg font-semibold">Property Title</h3>
  <p className="text-gray-600 font-normal">Property description...</p>
  <span className="text-2xl font-bold">$1,200/month</span>
</div>
```

## Font Weight Guide

- **font-extralight (200)** - Very subtle text, disclaimers
- **font-light (300)** - Secondary information, captions
- **font-normal (400)** - Body text, descriptions (default)
- **font-medium (500)** - Emphasized text, labels
- **font-semibold (600)** - Subheadings, important info
- **font-bold (700)** - Main headings, prices
- **font-extrabold (800)** - Hero text, major CTAs

## Typography Hierarchy

```jsx
// Hero Section
<h1 className="text-5xl font-extrabold">Find Your Perfect Home</h1>

// Page Titles
<h1 className="text-3xl font-bold">Properties in Dar es Salaam</h1>

// Section Headings
<h2 className="text-2xl font-semibold">Featured Properties</h2>

// Card Titles
<h3 className="text-lg font-semibold">Modern 2BR Apartment</h3>

// Body Text
<p className="text-base font-normal">Beautiful apartment with...</p>

// Small Text
<span className="text-sm font-light">Posted 2 days ago</span>
```

## Best Practices

1. **Use font weights to create hierarchy** instead of different fonts
2. **Bold (700) or Extrabold (800)** for prices and important numbers
3. **Semibold (600)** for property titles and section headings
4. **Medium (500)** for labels and emphasized text
5. **Normal (400)** for body text and descriptions
6. **Light (300)** for secondary information

## Performance Benefits

- ✅ Single font family = faster loading
- ✅ Consistent design language
- ✅ Better caching
- ✅ Smaller bundle size
- ✅ `display: swap` for optimal loading