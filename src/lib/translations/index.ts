import { en } from './en';
import { sw } from './sw';

export type Language = 'en' | 'sw';
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  sw,
};

export const languages = [
  { code: 'sw' as Language, name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
];

export const defaultLanguage: Language = 'en';

// Helper function to get nested translation
export function getNestedTranslation(
  translations: any,
  path: string
): string {
  return path.split('.').reduce((obj, key) => obj?.[key], translations) || path;
}

// Type-safe translation function
export function createTranslationFunction(language: Language) {
  const t = translations[language];

  return function translate(path: string, fallback?: string): string {
    const result = getNestedTranslation(t, path);
    if (result !== path) return result;
    // Untranslated keys fall back to English until the Swahili pass is done.
    if (language !== 'en') {
      const english = getNestedTranslation(translations.en, path);
      if (english !== path) return english;
    }
    return fallback || path;
  };
}