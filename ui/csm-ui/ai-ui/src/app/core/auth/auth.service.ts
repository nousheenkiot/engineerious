import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserRole, ROLE_ACTIVITIES, RegistrationData } from '../models/user.model';

export type OAuthProvider = 'google' | 'microsoft' | 'github';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_BASE = '/api/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    // Mock registered users for demo
    private mockUsers: (User & { password: string })[] = [
        {
            id: '1',
            email: 'admin@engineerious.com',
            password: 'Admin@123',
            fullName: 'System Administrator',
            role: 'ADMIN',
            activities: ROLE_ACTIVITIES['ADMIN'].map(a => a.id),
            token: 'mock-admin-token',
            profileComplete: true
        },
        {
            id: '2',
            email: 'agent@engineerious.com',
            password: 'Agent@123',
            fullName: 'Insurance Agent',
            role: 'AGENT',
            activities: ROLE_ACTIVITIES['AGENT'].map(a => a.id),
            token: 'mock-agent-token',
            profileComplete: true
        },
        {
            id: '3',
            email: 'customer@engineerious.com',
            password: 'Customer@123',
            fullName: 'John Customer',
            role: 'CUSTOMER',
            activities: ROLE_ACTIVITIES['CUSTOMER'].map(a => a.id),
            token: 'mock-customer-token',
            profileComplete: true
        }
    ];

    constructor(private http: HttpClient, private router: Router) {
        this.restoreSession();
    }

    private restoreSession(): void {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('current_user');
        if (token && userData) {
            try {
                const user: User = JSON.parse(userData);
                this.currentUserSubject.next(user);
                this.isLoggedInSubject.next(true);
            } catch {
                this.clearSession();
            }
        }
    }

    private saveSession(user: User): void {
        localStorage.setItem('auth_token', user.token || '');
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
    }

    private clearSession(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
    }

    // ── Standard Login ──────────────────────────────────────────────────────────
    login(credentials: { email: string; password: string }): Observable<User> {
        // Real API call (uncomment when backend ready):
        // return this.http.post<{ user: User; token: string }>(`${this.API_BASE}/login`, credentials).pipe(
        //   tap(res => this.saveSession({ ...res.user, token: res.token })),
        //   map(res => res.user)
        // );

        return of(null).pipe(
            delay(1200),
            map(() => {
                const found = this.mockUsers.find(
                    u => u.email === credentials.email && u.password === credentials.password
                );
                if (!found) throw new Error('Invalid email or password');
                const { password, ...user } = found;
                return user as User;
            }),
            tap(user => this.saveSession(user)),
            catchError(err => throwError(() => err))
        );
    }

    // ── OAuth Login ─────────────────────────────────────────────────────────────
    loginWithOAuth(provider: OAuthProvider): void {
        // In production: redirect to backend OAuth endpoint
        // window.location.href = `${this.API_BASE}/oauth/${provider}`;

        // Mock OAuth – simulate as CUSTOMER role
        const mockOAuthUser: User = {
            id: `oauth-${Date.now()}`,
            email: `oauth.user@${provider}.com`,
            fullName: `OAuth ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            role: 'CUSTOMER',
            activities: ROLE_ACTIVITIES['CUSTOMER'].map(a => a.id),
            token: `mock-oauth-token-${provider}`,
            profileComplete: false
        };

        setTimeout(() => {
            this.saveSession(mockOAuthUser);
            this.router.navigate([this.getDefaultRouteForRole(mockOAuthUser.role)]);
        }, 1000);
    }

    // ── Registration ────────────────────────────────────────────────────────────
    register(data: RegistrationData): Observable<User> {
        // Real API call (uncomment when backend ready):
        // return this.http.post<{ user: User; token: string }>(`${this.API_BASE}/register`, data).pipe(
        //   tap(res => this.saveSession({ ...res.user, token: res.token })),
        //   map(res => res.user)
        // );

        return of(null).pipe(
            delay(1500),
            map(() => {
                const exists = this.mockUsers.some(u => u.email === data.email);
                if (exists) throw new Error('An account with this email already exists');

                const newUser: User & { password: string } = {
                    id: `user-${Date.now()}`,
                    email: data.email,
                    password: data.password,
                    fullName: data.fullName,
                    role: data.role,
                    activities: ROLE_ACTIVITIES[data.role].map(a => a.id),
                    token: `token-${Date.now()}`,
                    profileComplete: true
                };
                this.mockUsers.push(newUser);
                const { password, ...user } = newUser;
                return user as User;
            }),
            tap(user => this.saveSession(user)),
            catchError(err => throwError(() => err))
        );
    }

    // ── Logout ──────────────────────────────────────────────────────────────────
    logout(): void {
        this.clearSession();
        this.router.navigate(['/auth/login']);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────────
    isAuthenticated(): boolean {
        return this.isLoggedInSubject.value;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    hasRole(role: UserRole): boolean {
        return this.getCurrentUser()?.role === role;
    }

    hasActivity(activityId: string): boolean {
        return this.getCurrentUser()?.activities?.includes(activityId) ?? false;
    }

    getDefaultRouteForRole(role: UserRole): string {
        const routes: Record<UserRole, string> = {
            ADMIN: '/csm',
            AGENT: '/csm',
            UNDERWRITER: '/csm',
            CLAIMS_MANAGER: '/csm',
            CUSTOMER: '/home',
        };
        return routes[role] ?? '/home';
    }
}
