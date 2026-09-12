import type { Translations } from './translations/translations';

/**
 * omnibus.api's GlobalExceptionHandler always returns a JSON body with a
 * `message` field (see ApiErrorResponse), but that message is a hardcoded
 * English string (or, in one case, an already-Portuguese one) — the backend
 * has no locale awareness of its own. This maps the exact strings the
 * handler is known to produce (see GlobalExceptionHandler and the
 * domain/exception classes in omnibus.api) to a key in `apiErrors`, so the
 * frontend can show them in whichever language the reader picked.
 *
 * A backend message that isn't in this map — a new exception type, or wording
 * that changes on the backend without this map being updated — is treated as
 * unknown rather than shown untranslated; see `extractApiErrorMessage`.
 */
export const API_ERROR_MESSAGE_MAP: Record<string, keyof Translations['apiErrors']> = {
  'Validation failed': 'validationFailed',
  'Malformed request body': 'malformedBody',
  'Invalid email or password': 'invalidCredentials',
  'Too many verification codes requested; try again later': 'tooManyCodes',
  'A code was recently sent; please wait before requesting another': 'resendCooldown',
  'Invalid or expired verification code': 'invalidOrExpiredCode',
  'Maximum verification attempts exceeded; request a new code': 'maxAttemptsExceeded',
  'Solicitação já em andamento; tente novamente': 'requestInProgress',
  'An unexpected error occurred': 'unexpected',
};

/**
 * `CustomerNotFoundException` messages carry a dynamic UUID
 * ("Customer not found: <id>"), so they can't go in the exact-match map
 * above — matched by prefix instead, and never shown to the user verbatim
 * (no reason to leak an internal identifier).
 */
export const CUSTOMER_NOT_FOUND_PREFIX = 'Customer not found';
