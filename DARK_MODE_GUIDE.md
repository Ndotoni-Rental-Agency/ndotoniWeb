# Dark Mode Style Guide

## Common Patterns

### Backgrounds
```tsx
// White backgrounds
className="bg-white dark:bg-gray-900"

// Light gray backgrounds
className="bg-gray-50 dark:bg-gray-800"
className="bg-gray-100 dark:bg-gray-800"

// Card backgrounds
className="bg-white dark:bg-gray-800"
```

### Text Colors
```tsx
// Primary text
className="text-gray-900 dark:text-white"

// Secondary text
className="text-gray-600 dark:text-gray-300"
className="text-gray-700 dark:text-gray-300"

// Muted text
className="text-gray-500 dark:text-gray-400"
```

### Borders
```tsx
// Standard borders
className="border-gray-200 dark:border-gray-700"
className="border-gray-300 dark:border-gray-600"
```

### Inputs & Forms
```tsx
// Input fields
className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"

// Labels
className="text-gray-700 dark:text-gray-300"

// Placeholders are handled automatically by Tailwind
```

### Buttons
```tsx
// Primary button (red) - no changes needed
className="bg-red-500 text-white hover:bg-red-600"

// Secondary/outline buttons
className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"

// Ghost buttons
className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
```

### Cards
```tsx
className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
```

### Modals/Overlays
```tsx
// Modal background
className="bg-white dark:bg-gray-800"

// Backdrop
className="bg-black bg-opacity-50 dark:bg-opacity-70"
```

### Alerts/Messages
```tsx
// Error
className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"

// Success
className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"

// Info
className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
```

### Hover States
```tsx
// Hover backgrounds
className="hover:bg-gray-50 dark:hover:bg-gray-800"
className="hover:bg-gray-100 dark:hover:bg-gray-700"

// Hover text
className="hover:text-gray-900 dark:hover:text-white"
```

## Components Updated

✅ Header (with scroll-based hiding animation and menu dark mode support)
✅ Footer (completed with comprehensive dark mode support)
✅ HeroSection
✅ LayoutWrapper (page background support)
✅ LandlordLayout (sub-navigation and background)
✅ HomePage (main page content after hero section)
✅ PropertyDetailPage (property detail page with all sections)
✅ ContactPage (removed hero design, added comprehensive dark mode)
✅ AboutPage (comprehensive dark mode support)
✅ AuthModal
✅ ThemeToggle
✅ SignInForm (partial)
✅ SearchBar (including sticky backdrop)
✅ SearchFilters
✅ CheckboxCard
✅ Counter
✅ CurrencyInput
✅ DatePicker
✅ NumberInput
✅ ToggleCard
✅ PropertyCard
✅ PropertyForm
✅ PropertyStatusBadge
✅ CreatePropertyWizard
✅ BasicInfoStep
✅ LocationStep
✅ LocationSelector
✅ LocationPreview
✅ SpecificationsStep
✅ PricingStep
✅ AvailabilityStep
✅ MediaStep
✅ PropertyMediaManager
✅ MediaUpload
✅ MediaSelector
✅ MediaIntegrationDemo

## Components To Update

### Auth Components
- [ ] SignUpForm
- [ ] ForgotPasswordForm
- [ ] ResetPasswordForm
- [ ] VerifyEmailForm
- [ ] SocialAuthButtons
- [ ] BecomeLandlordModal
- [ ] ProfileForm
- [ ] AccountSettings

### UI Components
- [x] SearchBar
- [x] SearchFilters
- [x] PropertyCard
- [x] PropertyForm
- [ ] Button (design system)
- [ ] Input (design system)
- [ ] Card (design system)
- [ ] Badge (design system)

### Shared Form Components
- [x] CheckboxCard
- [x] Counter
- [x] CurrencyInput
- [x] DatePicker
- [x] NumberInput
- [x] ToggleCard

### Property Components
- [x] PropertyCard
- [x] PropertyForm
- [x] PropertyStatusBadge
- [x] CreatePropertyWizard
- [x] BasicInfoStep
- [x] LocationStep
- [x] LocationSelector
- [x] LocationPreview
- [x] SpecificationsStep
- [x] PricingStep
- [x] AvailabilityStep
- [x] MediaStep

### Location Components
- [x] LocationSelector
- [x] LocationPreview

### Media Components
- [x] PropertyMediaManager
- [x] MediaUpload
- [x] MediaSelector
- [x] MediaIntegrationDemo

## Quick Update Script

For each component, follow this pattern:

1. Find all `className` attributes
2. Add dark mode variants using the patterns above
3. Add `transition-colors` for smooth theme switching
4. Test in both light and dark modes

## Tips

- Always add `transition-colors` for smooth transitions
- Use semantic color names (gray-900 for dark backgrounds, not black)
- Test hover states in both modes
- Check contrast ratios for accessibility
- Use `/20` opacity for subtle colored backgrounds in dark mode
