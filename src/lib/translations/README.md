# Translation System

This app supports multiple languages using a simple translation system.

## Supported Languages

- **English** (`en`) - Default
- **Swahili** (`sw`) - Kiswahili

## Usage

### In Components

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      
      {/* With fallback */}
      <span>{t('some.missing.key', 'Default text')}</span>
    </div>
  );
}
```

### Language Switcher

The `LanguageSwitcher` component is available in multiple variants:

```tsx
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// Header variant (default)
<LanguageSwitcher />

// Mobile menu variant
<LanguageSwitcher variant="mobile" />

// Footer variant
<LanguageSwitcher variant="footer" />
```

## Adding New Languages

1. Create a new translation file in `src/lib/translations/`
2. Add the language to the `translations` object in `index.ts`
3. Add the language to the `languages` array
4. Update the `Language` type

## Translation Keys

Translation keys use dot notation for nested objects:

```typescript
// English translations
export const en = {
  hero: {
    title: "Find Your Perfect Home in",
    subtitle: "Discover quality properties...",
  },
  common: {
    loading: "Loading...",
    error: "Error",
  }
};

// Usage
t('hero.title') // "Find Your Perfect Home in"
t('common.loading') // "Loading..."
```

## Features

- **Persistent Language Selection**: User's language choice is saved to localStorage
- **Type Safety**: Translation keys are type-checked
- **Fallback Support**: Graceful fallback to key name or provided fallback text
- **Nested Keys**: Support for nested translation objects
- **Multiple Variants**: Different UI variants for different contexts

## Current Translation Coverage

The system currently covers:
- Navigation elements
- Hero section
- Property listings
- Search and filters
- Messages/Chat
- Authentication
- Common UI elements
- Property details

## Adding New Translations

To add a new translation key:

1. Add it to both `en.ts` and `sw.ts` files
2. Use the `t()` function in your component
3. The TypeScript system will help ensure consistency

Example:
```typescript
// In en.ts and sw.ts
export const en = {
  // ... existing translations
  newSection: {
    title: "New Section Title",
    description: "New section description",
  }
};

// In component
const title = t('newSection.title');
```