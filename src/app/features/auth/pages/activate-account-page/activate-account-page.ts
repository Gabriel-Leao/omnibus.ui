import type { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import type { ErrorResolver } from '@/app/core/i18n/error-resolver';
import { I18nService } from '@/app/core/i18n/i18n.service';
import { OtpResendTimer } from '@/app/core/otp/otp-resend-timer';
import { Button } from '@/app/shared/ui/button/button';
import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';
import { Modal } from '@/app/shared/ui/modal/modal';
import { OtpInput } from '@/app/shared/ui/otp-input/otp-input';
import { extractApiErrorMessage } from '@/app/shared/utils/api-error';
import { isValidOtp } from '@/app/shared/utils/validators';

@Component({
  selector: 'app-activate-account-page',
  imports: [RouterLink, ComicPanel, OtpInput, Button, Modal],
  templateUrl: './activate-account-page.html',
  providers: [OtpResendTimer],
})
export class ActivateAccountPage {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  protected readonly otpTimer = inject(OtpResendTimer);
  protected readonly i18n = inject(I18nService);

  protected readonly email = signal(
    inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '',
  );
  protected readonly code = signal('');
  protected readonly submitting = signal(false);

  private readonly errorResolver = signal<ErrorResolver | null>(null);
  protected readonly formError = computed(() => this.errorResolver()?.(this.i18n.dict()) ?? null);

  protected readonly formValid = computed(() => isValidOtp(this.code()));

  protected readonly showResendModal = signal(false);
  protected readonly resendStatus = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  private readonly resendErrorResolver = signal<ErrorResolver | null>(null);
  protected readonly resendErrorMessage = computed(
    () => this.resendErrorResolver()?.(this.i18n.dict()) ?? null,
  );

  protected readonly showActivatedModal = signal(false);

  constructor() {
    this.otpTimer.start(`activation:${this.email()}`);
  }

  protected submit(): void {
    if (!this.formValid()) {
      return;
    }

    this.errorResolver.set(null);
    this.submitting.set(true);
    this.authApi.activateAccount({ email: this.email(), code: this.code() }).subscribe({
      next: ({ accessToken }) => {
        this.submitting.set(false);
        this.authSession.setAccessToken(accessToken);
        this.showActivatedModal.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.errorResolver.set((t) =>
          extractApiErrorMessage(error, t.auth.activateAccount.fallbackError, t.apiErrors),
        );
      },
    });
  }

  protected openResendModal(): void {
    this.resendStatus.set('idle');
    this.resendErrorResolver.set(null);
    this.showResendModal.set(true);
  }

  protected confirmResend(): void {
    if (!this.otpTimer.canResend()) {
      return;
    }

    this.resendStatus.set('sending');
    this.authApi.resendActivationCode({ email: this.email() }).subscribe({
      next: () => {
        this.otpTimer.registerResend();
        this.resendStatus.set('sent');
      },
      error: (error: HttpErrorResponse) => {
        this.resendStatus.set('error');
        this.resendErrorResolver.set((t) =>
          extractApiErrorMessage(error, t.auth.activateAccount.resendErrorFallback, t.apiErrors),
        );
      },
    });
  }

  protected goToHome(): void {
    this.router.navigateByUrl('/home');
  }
}
