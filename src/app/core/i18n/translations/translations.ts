/**
 * Shape of a full translation dictionary for the app. Each locale (see
 * `pt-br.ts`, `en-us.ts`, `es.ts`) implements this interface, so a missing string in
 * either locale fails at compile time rather than showing up blank in the UI.
 *
 * Parameterised copy (a digit index, a countdown, a resend count) is modelled
 * as a function instead of a raw string with a placeholder token — this keeps
 * interpolation type-safe and avoids adding a templating dependency.
 */
export interface Translations {
  header: {
    brand: string;
  };

  themeToggle: {
    ariaSwitchToLight: string;
    ariaSwitchToDark: string;
    titleLight: string;
    titleDark: string;
  };

  languageSwitcher: {
    ariaLabel: string;
    title: string;
  };

  modal: {
    close: string;
  };

  inputField: {
    showPassword: string;
    hidePassword: string;
  };

  otpInput: {
    digitAria: (position: number) => string;
  };

  home: {
    caption: string;
    title: string;
    body: string;
  };

  errorPage: {
    backToCover: string;
  };

  notFound: {
    title: string;
    message: string;
  };

  serverError: {
    title: string;
    message: string;
  };

  resendModal: {
    title: string;
    body: string;
    exhausted: string;
    waitSeconds: (seconds: number) => string;
    resendNow: string;
    resent: (remaining: number) => string;
  };

  auth: {
    login: {
      caption: string;
      title: string;
      subtitle: string;
      passwordResetNotice: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      forgotLink: string;
      submit: string;
      noAccount: string;
      createAccountLink: string;
      invalidEmail: string;
      emptyPassword: string;
      fallbackError: string;
    };

    register: {
      caption: string;
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      birthDateLabel: string;
      birthDateHint: string;
      birthDatePlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submit: string;
      hasAccount: string;
      loginLink: string;
      nameTooShort: string;
      invalidEmail: string;
      invalidPassword: string;
      passwordMismatch: string;
      underage: string;
      fallbackError: string;
    };

    forgotPassword: {
      caption: string;
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      submit: string;
      rememberedPassword: string;
      backToLoginLink: string;
      invalidEmail: string;
      fallbackError: string;
    };

    verifyResetCode: {
      caption: string;
      title: string;
      subtitleBeforeEmail: string;
      subtitleEmailFallback: string;
      submit: string;
      resendButton: string;
      backToLoginLink: string;
      invalidOtp: string;
      fallbackError: string;
      resendErrorFallback: string;
    };

    resetPassword: {
      caption: string;
      title: string;
      subtitle: string;
      newPasswordLabel: string;
      newPasswordPlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submit: string;
      invalidPassword: string;
      passwordMismatch: string;
      expiredSession: string;
      fallbackError: string;
    };

    activateAccount: {
      caption: string;
      title: string;
      subtitleBeforeEmail: string;
      subtitleEmailFallback: string;
      submit: string;
      resendButton: string;
      backToLoginLink: string;
      invalidOtp: string;
      fallbackError: string;
      resendErrorFallback: string;
      activatedModalTitle: string;
      activatedModalBody: string;
      activatedModalButton: string;
    };
  };

  /**
   * Translations for the fixed set of top-level `message` strings that
   * omnibus.api's GlobalExceptionHandler is known to return (see
   * `api-error-translations.ts`). Any backend message that doesn't match a
   * known entry falls back to the calling page's own fallback text instead of
   * being shown untranslated.
   */
  apiErrors: {
    validationFailed: string;
    malformedBody: string;
    invalidCredentials: string;
    tooManyCodes: string;
    resendCooldown: string;
    invalidOrExpiredCode: string;
    maxAttemptsExceeded: string;
    customerNotFound: string;
    requestInProgress: string;
    unexpected: string;
  };
}
