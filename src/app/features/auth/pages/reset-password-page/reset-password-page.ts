import type { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { PasswordResetSessionService } from '@/app/core/auth/password-reset-session.service';
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

  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected submit(): void {
    this.formError.set(null);

    if (!isValidPassword(this.password())) {
      this.formError.set('A senha precisa ter entre 8 e 72 caracteres.');
      return;
    }
    if (!passwordsMatch(this.password(), this.confirmPassword())) {
      this.formError.set('As senhas não coincidem.');
      return;
    }

    const token = this.resetSession.token();
    if (!token) {
      this.formError.set('Sua sessão de recuperação expirou. Peça um novo código.');
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
          this.formError.set(
            extractApiErrorMessage(
              error,
              'Não deu pra atualizar a senha. Peça um novo código e tente de novo.',
            ),
          );
        },
      });
  }
}
