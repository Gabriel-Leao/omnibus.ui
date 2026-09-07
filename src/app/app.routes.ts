import type { Routes } from '@angular/router';

import { passwordResetGuard } from '@/app/core/auth/guards/password-reset.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/app/layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('@/app/features/home/pages/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('@/app/features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('@/app/features/auth/pages/register-page/register-page').then(
            (m) => m.RegisterPage,
          ),
      },
      {
        path: 'activate-account',
        loadComponent: () =>
          import('@/app/features/auth/pages/activate-account-page/activate-account-page').then(
            (m) => m.ActivateAccountPage,
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('@/app/features/auth/pages/forgot-password-page/forgot-password-page').then(
            (m) => m.ForgotPasswordPage,
          ),
      },
      {
        path: 'verify-reset-code',
        loadComponent: () =>
          import('@/app/features/auth/pages/verify-reset-code-page/verify-reset-code-page').then(
            (m) => m.VerifyResetCodePage,
          ),
      },
      {
        path: 'reset-password',
        canActivate: [passwordResetGuard],
        loadComponent: () =>
          import('@/app/features/auth/pages/reset-password-page/reset-password-page').then(
            (m) => m.ResetPasswordPage,
          ),
      },
    ],
  },
  {
    path: 'erro',
    loadComponent: () =>
      import('@/app/features/errors/pages/server-error-page/server-error-page').then(
        (m) => m.ServerErrorPage,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@/app/features/errors/pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage,
      ),
  },
];
