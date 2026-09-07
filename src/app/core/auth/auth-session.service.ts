import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'omnibus:access-token';

/** Holds the signed-in customer's access token for the current browser session. */
@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly accessToken = signal<string | null>(this.readToken());

  setAccessToken(token: string): void {
    this.accessToken.set(token);
    if (this.isBrowser) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }

  clear(): void {
    this.accessToken.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  private readToken(): string | null {
    return this.isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  }
}
