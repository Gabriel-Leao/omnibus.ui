import { isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

const COOLDOWN_SECONDS = 60;
/** Mirrors VerificationOtpIssuer.MAX_TOKENS_PER_DAY on omnibus.api: 3 codes per rolling 24h. */
const MAX_ISSUANCES_PER_WINDOW = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;

interface StoredState {
  issuedCount: number;
  nextAllowedAt: number;
  windowStartedAt: number;
}

/**
 * Client-side companion to the backend's daily OTP issuance limit. It never
 * enforces anything by itself — `/auth/resend-activation` and
 * `/password-reset` still return an error once the real limit is hit — it
 * just keeps the "Reenviar código" button honest: a visible cooldown, and a
 * count so people aren't surprised by a 4th attempt failing.
 *
 * Provide this per-component (not root) so each OTP screen gets its own
 * instance, and call `start(key)` once the first code has already been
 * sent, keyed by something like `activation:${email}`.
 */
@Injectable()
export class OtpResendTimer {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  private storageKey = '';
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly secondsRemaining = signal(0);
  private readonly issuedCount = signal(1);

  readonly remainingSeconds = this.secondsRemaining.asReadonly();
  readonly exhausted = computed(() => this.issuedCount() >= MAX_ISSUANCES_PER_WINDOW);
  readonly canResend = computed(() => this.secondsRemaining() === 0 && !this.exhausted());
  readonly resendsLeft = computed(() => Math.max(0, MAX_ISSUANCES_PER_WINDOW - this.issuedCount()));

  /** Call once when the screen loads — the first code was already sent by the previous step. */
  start(key: string): void {
    this.storageKey = `omnibus:otp-resend:${key}`;
    const stored = this.isBrowser ? this.read() : null;

    if (stored) {
      this.issuedCount.set(stored.issuedCount);
      this.runCountdown(stored.nextAllowedAt);
    } else {
      const nextAllowedAt = Date.now() + COOLDOWN_SECONDS * 1000;
      this.issuedCount.set(1);
      this.write({ issuedCount: 1, nextAllowedAt, windowStartedAt: Date.now() });
      this.runCountdown(nextAllowedAt);
    }

    this.destroyRef.onDestroy(() => this.stopCountdown());
  }

  /** Call after a resend request succeeds. */
  registerResend(): void {
    const issuedCount = this.issuedCount() + 1;
    const nextAllowedAt = Date.now() + COOLDOWN_SECONDS * 1000;
    this.issuedCount.set(issuedCount);
    this.write({ issuedCount, nextAllowedAt, windowStartedAt: Date.now() });
    this.runCountdown(nextAllowedAt);
  }

  private runCountdown(nextAllowedAt: number): void {
    this.stopCountdown();

    const update = () => {
      const remaining = Math.max(0, Math.ceil((nextAllowedAt - Date.now()) / 1000));
      this.secondsRemaining.set(remaining);
      if (remaining === 0) {
        this.stopCountdown();
      }
    };

    update();
    if (this.isBrowser) {
      this.intervalId = setInterval(update, 1000);
    }
  }

  private stopCountdown(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private read(): StoredState | null {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as StoredState;
      if (Date.now() - parsed.windowStartedAt > WINDOW_MS) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private write(state: StoredState): void {
    if (this.isBrowser) {
      sessionStorage.setItem(this.storageKey, JSON.stringify(state));
    }
  }
}
