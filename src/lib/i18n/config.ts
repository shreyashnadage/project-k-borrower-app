export const locales = ['mr', 'hi', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'mr';

export const localeNames: Record<Locale, string> = {
  mr: 'मराठी',
  hi: 'हिन्दी',
  en: 'English',
};
