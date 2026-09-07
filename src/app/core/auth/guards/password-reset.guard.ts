import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { PasswordResetSessionService } from '@/app/core/auth/password-reset-session.service';

/**
 * Only lets the "set new password" screen render when a password-reset token
 * from the OTP-verification step is present and doesn't look expired yet.
 * Otherwise sends the person back to request a new code. The API still
 * enforces the real check on `/password-reset/confirm` — this guard exists
 * for UX, not authorisation.
 */
export const passwordResetGuard: CanActivateFn = () => {
  const session = inject(PasswordResetSessionService);
  const router = inject(Router);

  if (session.hasUsableToken()) {
    return true;
  }

  return router.createUrlTree(['/forgot-password']);
};
