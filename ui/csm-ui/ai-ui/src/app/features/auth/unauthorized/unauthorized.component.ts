import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: false,
  template: `
    <div class="unauth-wrap">
      <div class="unauth-card">
        <div class="icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <p class="detail">Your current role: <strong>{{ userRole }}</strong></p>
        <div class="actions">
          <button class="btn-home" (click)="goHome()">← Go to Dashboard</button>
          <button class="btn-logout" (click)="logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauth-wrap {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #f8fafc;
      font-family: 'Inter', sans-serif;
    }
    .unauth-card {
      text-align: center; background: white; border-radius: 20px;
      padding: 3rem 2.5rem; box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 420px; width: 100%;
    }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; }
    p { color: #64748b; margin: 0 0 0.5rem; }
    .detail strong { color: #6366f1; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap; }
    .btn-home {
      padding: 0.65rem 1.5rem; background: #6366f1; color: white;
      border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
    }
    .btn-home:hover { background: #4f46e5; }
    .btn-logout {
      padding: 0.65rem 1.5rem; background: white; color: #64748b;
      border: 1.5px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600;
    }
    .btn-logout:hover { border-color: #ef4444; color: #ef4444; }
  `]
})
export class UnauthorizedComponent {
  get userRole(): string {
    return this.authService.getCurrentUser()?.role ?? 'Unknown';
  }

  constructor(private authService: AuthService, private router: Router) { }

  goHome(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.router.navigate([this.authService.getDefaultRouteForRole(user.role)]);
    else this.router.navigate(['/auth/login']);
  }

  logout(): void { this.authService.logout(); }
}
