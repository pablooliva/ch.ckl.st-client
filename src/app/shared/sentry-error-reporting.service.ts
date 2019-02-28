import { ErrorHandler, Injectable, isDevMode } from "@angular/core";

import * as Sentry from "@sentry/browser";

@Injectable({
  providedIn: "root"
})
export class SentryErrorReportingService implements ErrorHandler {
  constructor() {
    if (!isDevMode()) {
      Sentry.init({
        dsn: "https://fa18123385e84df88c2de5985ab0e6f9@sentry.io/1405197"
      });
    }
  }

  public handleError(error): void {
    if (!isDevMode()) {
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }
}
