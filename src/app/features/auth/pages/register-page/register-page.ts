import type { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { Button } from '@/app/shared/ui/button/button';
import { ComicPanel } from '@/app/shared/ui/comic-panel/comic-panel';
import { InputField } from '@/app/shared/ui/input-field/input-field';
import { extractApiErrorMessage } from '@/app/shared/utils/api-error';
import {
  isAtLeastAge,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from '@/app/shared/utils/validators';

const MINIMUM_AGE = 18;

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ComicPanel, InputField, Button],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly birthDate = signal('');

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly maxBirthDate = computed(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - MINIMUM_AGE);
    return today.toISOString().slice(0, 10);
  });

  protected submit(): void {
    this.formError.set(null);

    if (this.name().trim().length < 3) {
      this.formError.set('Conta seu nome pra gente (mínimo 3 caracteres).');
      return;
    }
    if (!isValidEmail(this.email())) {
      this.formError.set('Digite um e-mail válido.');
      return;
    }
    if (!isValidPassword(this.password())) {
      this.formError.set('A senha precisa ter entre 8 e 72 caracteres.');
      return;
    }
    if (!passwordsMatch(this.password(), this.confirmPassword())) {
      this.formError.set('As senhas não coincidem.');
      return;
    }
    if (!this.birthDate() || !isAtLeastAge(this.birthDate(), MINIMUM_AGE)) {
      this.formError.set('É preciso ter 18 anos ou mais para se cadastrar.');
      return;
    }

    this.submitting.set(true);
    this.authApi
      .register({
        name: this.name().trim(),
        email: this.email().trim(),
        password: this.password(),
        confirmPassword: this.confirmPassword(),
        birthDate: this.birthDate(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/activate-account'], {
            queryParams: { email: this.email().trim() },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.submitting.set(false);
          this.formError.set(
            extractApiErrorMessage(
              error,
              'Não deu pra completar o cadastro agora. Tenta de novo em instantes.',
            ),
          );
        },
      });
  }
}
