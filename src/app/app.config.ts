import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptorsFromDi, HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {provideAnimations} from '@angular/platform-browser/animations';
import { ka_GE, provideNzI18n} from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), provideNzI18n(ka_GE), importProvidersFrom(FormsModule), importProvidersFrom(HttpClientModule),
    provideAnimations(), provideAnimationsAsync('noop')
  ]
};
