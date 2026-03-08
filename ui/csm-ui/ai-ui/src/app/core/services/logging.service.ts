import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {
    constructor() { }

    log(message: string, ...optionalParams: any[]) {
        console.log(`[INFO] ${new Date().toISOString()}:`, message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]) {
        console.warn(`[WARN] ${new Date().toISOString()}:`, message, ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]) {
        console.error(`[ERROR] ${new Date().toISOString()}:`, message, ...optionalParams);
        // In a real application, you might also want to send this error to a remote server
        // e.g., using Sentry, New Relic, Datadog, or your own backend API.
    }
}
