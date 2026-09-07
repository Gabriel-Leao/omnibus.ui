import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { errorLoggingInterceptor } from '@/app/core/http/error-logging.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Angular recommends `withFetch()` for SSR apps (NG02801: better
    // performance/compatibility than the XHR backend during hydration).
    provideHttpClient(withFetch(), withInterceptors([errorLoggingInterceptor])),
    provideClientHydration(withEventReplay()),
  ],
};
