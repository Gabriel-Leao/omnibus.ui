export type Locale = 'pt-BR' | 'en-US' | 'es';

export const SUPPORTED_LOCALES: readonly Locale[] = ['pt-BR', 'en-US', 'es'];

export const LOCALE_LABELS: Record<Locale, string> = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  es: 'Español',
};
