import type { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { Button } from '@/app/shared/ui/button/button';
import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';
import { InputField } from '@/app/shared/ui/input-field/input-field';
import { extractApiErrorMessage } from '@/app/shared/utils/api-error';
import { isValidEmail } from '@/app/shared/utils/validators';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ComicPanel, InputField, Button],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly showPasswordResetNotice = signal(
    inject(ActivatedRoute).snapshot.queryParamMap.get('reset') === 'success',
  );

  protected submit(): void {
    this.formError.set(null);

    if (!isValidEmail(this.email())) {
      this.formError.set('Digite um e-mail válido.');
      return;
    }
    if (!this.password()) {
      this.formError.set('Digite sua senha.');
      return;
    }

    this.submitting.set(true);
    this.authApi.login(this.email().trim(), this.password()).subscribe({
      next: ({ accessToken }) => {
        this.authSession.setAccessToken(accessToken);
        this.router.navigateByUrl('/home');
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(
          extractApiErrorMessage(error, 'E-mail ou senha incorretos. Tenta de novo, herói.'),
        );
      },
    });
  }
}
