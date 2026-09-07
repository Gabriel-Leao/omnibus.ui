/**
 * Mirrors the request/response DTOs actually exposed by omnibus.api under
 * `/auth` and `/password-reset`. Field names and shapes match the backend
 * records one-to-one — see AuthController and PasswordResetController.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCustomerRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string; // ISO date (yyyy-MM-dd)
  photoUrl?: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResendActivationCodeRequest {
  email: string;
}

export interface EmailRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface RegistrationResponse {
  message: string;
}

export interface PasswordResetTokenResponse {
  passwordResetToken: string;
}

export interface FieldErrorDto {
  field: string;
  message: string;
}

/** Shape returned by omnibus.api's GlobalExceptionHandler for 4xx/5xx responses. */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  traceId: string | null;
  fieldErrors: FieldErrorDto[];
}
