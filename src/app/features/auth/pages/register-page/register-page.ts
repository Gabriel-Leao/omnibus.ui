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
import { type DateOrder, formatDateInput, parseDateInputToIso } from '@/app/shared/utils/date-mask';
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
  protected readonly i18n = inject(I18nService);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly birthDateDisplay = signal('');

  protected readonly submitting = signal(false);

  private readonly errorResolver = signal<ErrorResolver | null>(null);
  protected readonly formError = computed(() => this.errorResolver()?.(this.i18n.dict()) ?? null);

  /** US reads a date as month/day/year; every other supported locale reads it as day/month/year. */
  protected readonly dateOrder = computed<DateOrder>(() =>
    this.i18n.locale() === 'en-US' ? 'mdy' : 'dmy',
  );

  protected readonly formatBirthDate = formatDateInput;

  protected readonly birthDateIso = computed(() =>
    parseDateInputToIso(this.birthDateDisplay(), this.dateOrder()),
  );

  protected readonly formValid = computed(() => {
    const birthDateIso = this.birthDateIso();
    return (
      this.name().trim().length >= 3 &&
      isValidEmail(this.email()) &&
      isValidPassword(this.password()) &&
      passwordsMatch(this.password(), this.confirmPassword()) &&
      !!birthDateIso &&
      isAtLeastAge(birthDateIso, MINIMUM_AGE)
    );
  });

  protected submit(): void {
    const birthDateIso = this.birthDateIso();
    if (!this.formValid() || !birthDateIso) {
      return;
    }

    this.errorResolver.set(null);
    this.submitting.set(true);
    this.authApi
      .register({
        name: this.name().trim(),
        email: this.email().trim(),
        password: this.password(),
        confirmPassword: this.confirmPassword(),
        birthDate: birthDateIso,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/activate-account'], {
            queryParams: { email: this.email().trim() },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorResolver.set((t) =>
            extractApiErrorMessage(error, t.auth.register.fallbackError, t.apiErrors),
          );
        },
      });
  }
}
