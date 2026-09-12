import type { HttpErrorResponse } from '@angular/common/http';

import type { ApiErrorResponse } from '@/app/core/auth/auth.models';
import {
  API_ERROR_MESSAGE_MAP,
  CUSTOMER_NOT_FOUND_PREFIX,
} from '@/app/core/i18n/api-error-translations';
import type { Translations } from '@/app/core/i18n/translations/translations';

/**
 * Resolves the message to show for a failed API call, in the reader's
 * current language.
 *
 * omnibus.api's GlobalExceptionHandler always sends back a `message`, but
 * it's a hardcoded backend string with no locale of its own. Only messages
 * recognised in `API_ERROR_MESSAGE_MAP` are translated and shown; anything
 * else (an unreachable API, a new backend exception this map hasn't caught
 * up with) falls back to the calling page's own localized fallback instead
 * of leaking untranslated or overly technical text.
 */
export function extractApiErrorMessage(
  error: HttpErrorResponse,
  fallback: string,
  apiErrors: Translations['apiErrors'],
): string {
  const body = error.error as Partial<ApiErrorResponse> | null;
  const backendMessage = body?.message?.trim();

  if (!backendMessage) {
    return fallback;
  }

  if (backendMessage.startsWith(CUSTOMER_NOT_FOUND_PREFIX)) {
    return apiErrors.customerNotFound;
  }

  const key = API_ERROR_MESSAGE_MAP[backendMessage];
  return key ? apiErrors[key] : fallback;
}
