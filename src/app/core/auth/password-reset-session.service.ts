import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { isJwtExpired } from './jwt.util';

const RESET_TOKEN_KEY = 'omnibus:password-reset-token';

/**
 * Holds the short-lived `passwordResetToken` between the "verify OTP" step
 * and the "set new password" step. Kept in sessionStorage (not localStorage)
 * because it's only meant to survive the current tab/flow, not to persist.
 */
@Injectable({ providedIn: 'root' })
export class PasswordResetSessionService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly token = signal<string | null>(this.readToken());

  setToken(token: string): void {
    this.token.set(token);
    if (this.isBrowser) {
      sessionStorage.setItem(RESET_TOKEN_KEY, token);
    }
  }

  clear(): void {
    this.token.set(null);
    if (this.isBrowser) {
      sessionStorage.removeItem(RESET_TOKEN_KEY);
    }
  }

  /**
   * Client-side-only check: is there a token, and does it not look expired
   * yet? This exists purely so the "set new password" screen isn't shown
   * for nothing — `/password-reset/confirm` is what actually enforces this.
   */
  hasUsableToken(): boolean {
    const token = this.token();
    return !!token && !isJwtExpired(token);
  }

  private readToken(): string | null {
    return this.isBrowser ? sessionStorage.getItem(RESET_TOKEN_KEY) : null;
  }
}
