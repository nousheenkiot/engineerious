import { ErrorHandler, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Error Handling & Logging
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptors([httpErrorInterceptor]), withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }
