import type { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { PasswordResetSessionService } from '@/app/core/auth/password-reset-session.service';
import type { ErrorResolver } from '@/app/core/i18n/error-resolver';
import { I18nService } from '@/app/core/i18n/i18n.service';
import { Button } from '@/app/shared/ui/button/button';
import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';
import { InputField } from '@/app/shared/ui/input-field/input-field';
import { extractApiErrorMessage } from '@/app/shared/utils/api-error';
import { isValidPassword, passwordsMatch } from '@/app/shared/utils/validators';

@Component({
  selector: 'app-reset-password-page',
  imports: [ComicPanel, InputField, Button],
  templateUrl: './reset-password-page.html',
})
export class ResetPasswordPage {
  private readonly authApi = inject(AuthApiService);
  private readonly resetSession = inject(PasswordResetSessionService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly submitting = signal(false);

  private readonly errorResolver = signal<ErrorResolver | null>(null);
  protected readonly formError = computed(() => this.errorResolver()?.(this.i18n.dict()) ?? null);

  protected readonly formValid = computed(
    () =>
      isValidPassword(this.password()) && passwordsMatch(this.password(), this.confirmPassword()),
  );

  protected submit(): void {
    if (!this.formValid()) {
      return;
    }

    this.errorResolver.set(null);

    const token = this.resetSession.token();
    if (!token) {
      this.errorResolver.set((t) => t.auth.resetPassword.expiredSession);
      return;
    }

    this.submitting.set(true);
    this.authApi
      .confirmPasswordReset(token, {
        password: this.password(),
        confirmPassword: this.confirmPassword(),
      })
      .subscribe({
        next: () => {
          this.resetSession.clear();
          this.router.navigate(['/login'], { queryParams: { reset: 'success' } });
        },
        error: (error: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorResolver.set((t) =>
            extractApiErrorMessage(error, t.auth.resetPassword.fallbackError, t.apiErrors),
          );
        },
      });
  }
}
