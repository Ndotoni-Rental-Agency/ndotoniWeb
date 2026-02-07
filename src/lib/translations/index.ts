import { en } from './en';
import { sw } from './sw';

export type Language = 'en' | 'sw';
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  sw,
};

export const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'sw' as Language, name: 'Swahili', nativeName: 'Kiswahili' },
];

export const defaultLanguage: Language = 'sw';

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
    return result || fallback || path;
  };
}