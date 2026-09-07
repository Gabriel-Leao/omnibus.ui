import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

/**
 * Logs failed API calls to the console with status, URL and the body the
 * backend sent back. `omnibus.api`'s GlobalExceptionHandler always returns a
 * JSON body with a `message` (see ApiErrorResponse), so this makes it visible
 * even when the browser's Network tab isn't showing it clearly.
 */
export const errorLoggingInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        console.error(
          `[omnibus.api] ${request.method} ${request.urlWithParams} → ${error.status}`,
          error.error ?? error.message,
        );
      }
      return throwError(() => error);
    }),
  );
