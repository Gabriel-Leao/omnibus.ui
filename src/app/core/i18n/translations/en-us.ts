import type { Translations } from './translations';

export const EN_US: Translations = {
  header: {
    brand: 'OMNIBUS',
  },

  themeToggle: {
    ariaSwitchToLight: 'Switch to light mode',
    ariaSwitchToDark: 'Switch to dark mode',
    titleLight: 'Light mode',
    titleDark: 'Dark mode',
  },

  languageSwitcher: {
    ariaLabel: 'Select language',
    title: 'Language',
  },

  modal: {
    close: 'Close',
  },

  inputField: {
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },

  otpInput: {
    digitAria: (position) => `Digit ${position} of the code`,
  },

  home: {
    caption: 'Under construction',
    title: 'The shop is still on the drawing board',
    body: 'The catalog, cart and orders are still being penciled in on the next few pages. In the meantime, your account is ready and waiting for its first issue.',
  },

  errorPage: {
    backToCover: 'Back to the cover',
  },

  notFound: {
    title: "This issue doesn't exist in this universe",
    message:
      "The page you're looking for was canceled, never published, or changed publisher. Check the address or head back to the cover.",
  },

  serverError: {
    title: 'The printing press jammed on this page',
    message:
      "Something went wrong on our end. We've already called the art department; please try again shortly.",
  },

  resendModal: {
    title: 'Check your inbox!',
    body: 'If that email address has an account, the code has already been sent. Nothing after a few minutes? Have a look in spam — the mail carrier sometimes loses their way.',
    exhausted: "You've used up the codes available in the last 24 hours. Try again later.",
    waitSeconds: (seconds) => `Wait ${seconds}s`,
    resendNow: 'Resend now',
    resent: (remaining) => `Resent! (${remaining} resend(s) left)`,
  },

  auth: {
    login: {
      caption: 'Chapter 1 — Sign in',
      title: 'Welcome back',
      subtitle: 'Sign in to carry on your collection.',
      passwordResetNotice: 'Password updated! You can sign in with the new one now.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      forgotLink: 'Forgot my password',
      submit: 'Sign in',
      noAccount: "Don't have an account yet?",
      createAccountLink: 'Create account',
      invalidEmail: 'Enter a valid email address.',
      emptyPassword: 'Enter your password.',
      fallbackError: 'Wrong email or password. Try again, hero.',
    },

    register: {
      caption: 'Origin story — Create account',
      title: 'Start your collection',
      subtitle: 'Takes less than a minute.',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      birthDateLabel: 'Date of birth',
      birthDateHint: 'You need to be 18 or older.',
      birthDatePlaceholder: 'mm/dd/yyyy',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 8 characters',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: 'Repeat the password',
      submit: 'Create account',
      hasAccount: 'Already have an account?',
      loginLink: 'Sign in',
      nameTooShort: 'Tell us your name (3 characters minimum).',
      invalidEmail: 'Enter a valid email address.',
      invalidPassword: 'Password must be between 8 and 72 characters.',
      passwordMismatch: "Passwords don't match.",
      underage: 'You need to be 18 or older to register.',
      fallbackError: "We couldn't complete your registration right now. Please try again shortly.",
    },

    forgotPassword: {
      caption: 'Recover password',
      title: 'Forgotten your password?',
      subtitle: "Enter your email and we'll send a verification code.",
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      submit: 'Send code',
      rememberedPassword: 'Remembered your password?',
      backToLoginLink: 'Back to sign in',
      invalidEmail: 'Enter a valid email address.',
      fallbackError: "We couldn't send the code right now. Please try again shortly.",
    },

    verifyResetCode: {
      caption: 'Recover password — Code',
      title: 'Enter the code',
      subtitleBeforeEmail: 'We sent 6 digits to',
      subtitleEmailFallback: 'your email',
      submit: 'Confirm code',
      resendButton: 'Resend code',
      backToLoginLink: '← Back to sign in',
      invalidOtp: 'Enter the 6 digits of the code.',
      fallbackError: 'Invalid or expired code. Check the digits or request a new one.',
      resendErrorFallback: "Couldn't resend right now.",
    },

    resetPassword: {
      caption: 'Final chapter — New password',
      title: 'Set a new password',
      subtitle: 'Choose something strong — and new, please.',
      newPasswordLabel: 'New password',
      newPasswordPlaceholder: 'At least 8 characters',
      confirmPasswordLabel: 'Confirm new password',
      confirmPasswordPlaceholder: 'Repeat the password',
      submit: 'Save new password',
      invalidPassword: 'Password must be between 8 and 72 characters.',
      passwordMismatch: "Passwords don't match.",
      expiredSession: 'Your recovery session has expired. Request a new code.',
      fallbackError: "We couldn't update your password. Request a new code and try again.",
    },

    activateAccount: {
      caption: 'Chapter 2 — Activate account',
      title: 'Confirm your email',
      subtitleBeforeEmail: 'We sent a 6-digit code to',
      subtitleEmailFallback: 'your email',
      submit: 'Activate account',
      resendButton: 'Resend code',
      backToLoginLink: '← Back to sign in',
      invalidOtp: 'Enter the 6 digits of the code.',
      fallbackError: 'Invalid or expired code. Check the digits or request a new one.',
      resendErrorFallback: "Couldn't resend right now.",
      activatedModalTitle: 'Account activated!',
      activatedModalBody:
        "Your account is active and ready for the collection. The shop is still under construction, but you're welcome to have a look around.",
      activatedModalButton: 'Go to the shop',
    },
  },

  apiErrors: {
    validationFailed: 'Some of the submitted data is invalid. Please check the form and try again.',
    malformedBody: "We couldn't process the request. Please try again.",
    invalidCredentials: 'Wrong email or password. Try again, hero.',
    tooManyCodes: "You've used up the codes available in the last 24 hours. Try again later.",
    resendCooldown: 'A code was sent just moments ago. Please wait before requesting another.',
    invalidOrExpiredCode: 'Invalid or expired code. Check the digits or request a new one.',
    maxAttemptsExceeded: 'Maximum number of attempts exceeded. Please request a new code.',
    customerNotFound: "We couldn't find your account. Please request a new recovery code.",
    requestInProgress: 'Request already in progress; please try again.',
    unexpected: 'An unexpected error occurred. Please try again shortly.',
  },
};
