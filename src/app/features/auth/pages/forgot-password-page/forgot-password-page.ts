import type { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
import type { ErrorResolver } from '@/app/core/i18n/error-resolver';
import { I18nService } from '@/app/core/i18n/i18n.service';
import { Button } from '@/app/shared/ui/button/button';
import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';
import { InputField } from '@/app/shared/ui/input-field/input-field';
import { extractApiErrorMessage } from '@/app/shared/utils/api-error';
import { isValidEmail } from '@/app/shared/utils/validators';

@Component({
  selector: 'app-forgot-password-page',
  imports: [RouterLink, ComicPanel, InputField, Button],
  templateUrl: './forgot-password-page.html',
})
export class ForgotPasswordPage {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected readonly email = signal('');
  protected readonly submitting = signal(false);

  private readonly errorResolver = signal<ErrorResolver | null>(null);
  protected readonly formError = computed(() => this.errorResolver()?.(this.i18n.dict()) ?? null);

  protected readonly formValid = computed(() => isValidEmail(this.email()));

  protected submit(): void {
    if (!this.formValid()) {
      return;
    }

    this.errorResolver.set(null);
    this.submitting.set(true);
    this.authApi.requestPasswordReset({ email: this.email().trim() }).subscribe({
      next: () => {
        this.router.navigate(['/verify-reset-code'], {
          queryParams: { email: this.email().trim() },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.errorResolver.set((t) =>
          extractApiErrorMessage(error, t.auth.forgotPassword.fallbackError, t.apiErrors),
        );
      },
    });
  }
}
