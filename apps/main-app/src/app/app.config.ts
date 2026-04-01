/**
 * Application bootstrap: router, async Material animations, and form-field defaults suited to dynamic validation messages.
 */
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        // Reserve vertical space for mat-error so messages are not overlapped by the next field
        // (fixed subscript sizing uses a short reserved strip; dynamic grows with content).
        subscriptSizing: 'dynamic',
      },
    },
  ],
};
