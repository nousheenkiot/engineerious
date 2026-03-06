import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
        if (!this.authService.isAuthenticated()) {
            return this.router.createUrlTree(['/auth/login']);
        }

        const requiredRoles: UserRole[] = route.data?.['roles'] ?? [];
        const requiredActivities: string[] = route.data?.['activities'] ?? [];

        if (requiredRoles.length > 0) {
            const userRole = this.authService.getCurrentUser()?.role;
            if (!requiredRoles.includes(userRole as UserRole)) {
                return this.router.createUrlTree(['/auth/unauthorized']);
            }
        }

        if (requiredActivities.length > 0) {
            const hasAll = requiredActivities.every(act => this.authService.hasActivity(act));
            if (!hasAll) {
                return this.router.createUrlTree(['/auth/unauthorized']);
            }
        }

        return true;
    }
}
