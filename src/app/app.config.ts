import { ApplicationConfig, LOCALE_ID } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideHttpClient } from "@angular/common/http";
import "@angular/common/locales/global/pl";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    { provide: LOCALE_ID, useValue: "pl-PL" },
  ],
};
