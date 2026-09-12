import type { Translations } from './translations/translations';

/**
 * A validation or API error, captured as a function of the current
 * dictionary instead of an already-resolved string.
 *
 * Storing the resolved string directly (`t.auth.login.invalidEmail`) freezes
 * it in whatever language was active the moment the error appeared — if the
 * reader then switches languages via the language switcher, the rest of the
 * page updates but that error stays stale in the old language. Storing this
 * function instead, and re-invoking it against `i18n.dict()` in a computed
 * signal, keeps the displayed error in sync with the current language the
 * same way every other piece of copy on the page already is.
 */
export type ErrorResolver = (dict: Translations) => string;
