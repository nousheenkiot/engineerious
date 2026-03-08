import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LoggingService } from '../services/logging.service';

/**
 * Functional Interceptor to log any outgoing HTTP request errors 
 * globally in the application.
 */
export function httpErrorInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    const loggingService = inject(LoggingService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = '';

            if (error.error instanceof ErrorEvent) {
                // Client-side or network error
                errorMessage = `Network/Client Error: ${error.error.message}`;
            } else {
                // Backend returned an unsuccessful response code
                errorMessage = `Backend Status ${error.status}, Body: ${JSON.stringify(error.error)}`;
            }

            loggingService.error(`API Call failed [${req.method} ${req.url}]:`, errorMessage);

            // Re-throw the error so that local catchError handlers can also process it
            return throwError(() => error);
        })
    );
}
