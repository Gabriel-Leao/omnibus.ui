import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { type Locale, LOCALE_LABELS, SUPPORTED_LOCALES } from './locale';
import { EN_US } from './translations/en-us';
import { ES } from './translations/es';
import { PT_BR } from './translations/pt-br';
import type { Translations } from './translations/translations';

const STORAGE_KEY = 'omnibus:locale';

const DICTIONARIES: Record<Locale, Translations> = {
  'pt-BR': PT_BR,
  'en-US': EN_US,
  es: ES,
};

/**
 * Tracks the active UI language as a signal and mirrors it onto
 * `<html lang>`. Mirrors ThemeService's shape on purpose: local UI state with
 * one synchronous source of truth (the user's pick in the language switcher),
 * no asynchronous composition involved.
 *
 * With no stored choice yet, the default comes from the browser's preferred
 * language list (`navigator.languages`, most-preferred first): the list is
 * scanned in order for the first entry that's Portuguese (any variant →
 * `pt-BR`), Spanish (any variant → `es`), or English (→ `en-US`, the app's
 * only English variant) — a language this app doesn't have a dictionary for
 * (German, say) is skipped rather than counted as a vote for English.
 * Nothing recognisable anywhere in the list falls back to `en-US`, the most
 * widely understood default. A stored choice — from the language switcher —
 * always wins over that detection.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly locale = signal<Locale>(this.readInitialLocale());
  readonly dict = computed<Translations>(() => DICTIONARIES[this.locale()]);

  readonly supportedLocales = SUPPORTED_LOCALES;
  readonly labels = LOCALE_LABELS;

  constructor() {
    effect(() => {
      const locale = this.locale();
      if (!this.isBrowser) {
        return;
      }
      document.documentElement.lang = locale;
      localStorage.setItem(STORAGE_KEY, locale);
    });
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
  }

  private readInitialLocale(): Locale {
    if (!this.isBrowser) {
      return 'pt-BR';
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt-BR' || stored === 'en-US' || stored === 'es') {
      return stored;
    }

    return this.detectBrowserLocale();
  }

  /**
   * `navigator.languages` is the user's full preference list, most-preferred
   * first (some browsers let people configure several). It's scanned in
   * order for the first entry this app recognises — a language it prefers
   * even more (German, say) but has no dictionary for is simply skipped,
   * not treated as a vote for English. `navigator.language` covers older
   * browsers that don't expose the list. Nothing recognisable anywhere in
   * the list falls back to `en-US`, same as an unmatched language would on
   * its own.
   */
  private detectBrowserLocale(): Locale {
    const preferences = navigator.languages ?? [navigator.language];

    for (const preference of preferences) {
      const normalized = preference?.toLowerCase();
      if (normalized?.startsWith('pt')) {
        return 'pt-BR';
      }
      if (normalized?.startsWith('es')) {
        return 'es';
      }
      if (normalized?.startsWith('en')) {
        return 'en-US';
      }
    }

    return 'en-US';
  }
}
