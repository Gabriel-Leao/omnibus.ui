import type { HttpErrorResponse } from '@angular/common/http';

import type { ApiErrorResponse } from '@/app/core/auth/auth.models';

/**
 * Prefers the message omnibus.api's GlobalExceptionHandler actually sent
 * back (ApiErrorResponse.message) over a hardcoded guess, falling back only
 * when the response isn't in that shape (e.g. the API is unreachable).
 */
export function extractApiErrorMessage(error: HttpErrorResponse, fallback: string): string {
  const body = error.error as Partial<ApiErrorResponse> | null;
  return body?.message?.trim() || fallback;
}
