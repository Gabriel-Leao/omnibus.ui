import type { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
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

  protected readonly email = signal('');
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected submit(): void {
    this.formError.set(null);

    if (!isValidEmail(this.email())) {
      this.formError.set('Digite um e-mail válido.');
      return;
    }

    this.submitting.set(true);
    this.authApi.requestPasswordReset({ email: this.email().trim() }).subscribe({
      next: () => {
        this.router.navigate(['/verify-reset-code'], {
          queryParams: { email: this.email().trim() },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(
          extractApiErrorMessage(
            error,
            'Não deu pra enviar o código agora. Tenta de novo em instantes.',
          ),
        );
      },
    });
  }
}
