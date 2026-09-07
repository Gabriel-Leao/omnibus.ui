import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';

import { environment } from '@/environments/environment';

import type {
  AccessTokenResponse,
  EmailRequest,
  PasswordResetTokenResponse,
  RegisterCustomerRequest,
  RegistrationResponse,
  ResendActivationCodeRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
} from './auth.models';

/**
 * Talks HTTP to the endpoints exposed by AuthController and
 * PasswordResetController on omnibus.api. No business rules live here —
 * only request shaping, matching the real routes 1:1. The base URL is read
 * from `environments/environment.ts`, swapped per build via Angular's
 * `fileReplacements` (see angular.json's `development` configuration).
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(email: string, password: string): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  register(request: RegisterCustomerRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/auth/register`, request);
  }

  activateAccount(request: VerifyCodeRequest): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>(`${this.apiUrl}/auth/activate`, request);
  }

  resendActivationCode(request: ResendActivationCodeRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/auth/resend-activation`, request);
  }

  requestPasswordReset(request: EmailRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/password-reset`, request);
  }

  verifyPasswordResetCode(request: VerifyCodeRequest): Observable<PasswordResetTokenResponse> {
    return this.http.post<PasswordResetTokenResponse>(
      `${this.apiUrl}/password-reset/verify`,
      request,
    );
  }

  /**
   * Confirms a password reset. Requires the short-lived `passwordResetToken`
   * issued by {@link verifyPasswordResetCode}, sent as a bearer token — the
   * same header the JwtAuthenticationFilter reads on the backend.
   */
  confirmPasswordReset(resetToken: string, request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password-reset/confirm`, request, {
      headers: { Authorization: `Bearer ${resetToken}` },
    });
  }
}
