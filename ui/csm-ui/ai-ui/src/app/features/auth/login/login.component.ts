import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, OAuthProvider } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    isLoading = false;
    oauthLoading: OAuthProvider | null = null;
    error = '';
    showPassword = false;

    // Demo credentials for quick fill
    demoCredentials = [
        { label: 'Admin', email: 'admin@engineerious.com', password: 'Admin@123', badge: 'ADMIN' },
        { label: 'Agent', email: 'agent@engineerious.com', password: 'Agent@123', badge: 'AGENT' },
        { label: 'Customer', email: 'customer@engineerious.com', password: 'Customer@123', badge: 'CUSTOMER' },
    ];

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            const user = this.authService.getCurrentUser();
            if (user) {
                this.router.navigate([this.authService.getDefaultRouteForRole(user.role)]);
            }
        }
    }

    get emailControl() { return this.loginForm.get('email')!; }
    get passwordControl() { return this.loginForm.get('password')!; }

    fillDemo(cred: { email: string; password: string }): void {
        this.loginForm.patchValue({ email: cred.email, password: cred.password });
        this.error = '';
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.error = '';

        this.authService.login({
            email: this.emailControl.value!,
            password: this.passwordControl.value!
        }).subscribe({
            next: (user) => {
                this.isLoading = false;
                this.router.navigate([this.authService.getDefaultRouteForRole(user.role)]);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.message || 'Login failed. Please try again.';
            }
        });
    }

    loginWithOAuth(provider: OAuthProvider): void {
        this.oauthLoading = provider;
        this.error = '';
        // Simulated delay for UX
        setTimeout(() => {
            this.authService.loginWithOAuth(provider);
            this.oauthLoading = null;
        }, 800);
    }

    goToRegister(): void {
        this.router.navigate(['/auth/register']);
    }
}
