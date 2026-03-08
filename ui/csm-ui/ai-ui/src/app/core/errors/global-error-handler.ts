import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error: Error | any): void {
        // We use Injector to get LoggingService directly inside handleError 
        // to bypass potential circular dependency issues during app initialization
        const loggingService = this.injector.get(LoggingService);

        const message = error.message ? error.message : error.toString();
        const stackTrace = error instanceof Error ? error.stack : '';

        // Log the error using the global logging service
        loggingService.error('Unhandled Application Error:', {
            message,
            stackTrace: stackTrace
        });

        // We can also potentially trigger a user-friendly toast or snackbar here mapping to a UI service
    }
}
