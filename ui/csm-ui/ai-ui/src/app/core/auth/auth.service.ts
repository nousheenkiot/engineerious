import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        // Check local storage or similar for persisted auth
        const token = localStorage.getItem('token');
        if (token) {
            this.isLoggedInSubject.next(true);
        }
    }

    login(credentials: any): Observable<boolean> {
        // Mock login call
        return of(true).pipe(
            delay(1000), // Simulate network latency
            tap(() => {
                this.isLoggedInSubject.next(true);
                localStorage.setItem('token', 'mock-token');
                this.router.navigate(['/csm']);
            })
        );
    }

    logout(): void {
        this.isLoggedInSubject.next(false);
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return this.isLoggedInSubject.value;
    }
}
