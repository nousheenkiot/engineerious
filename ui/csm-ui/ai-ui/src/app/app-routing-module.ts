import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

// ─────────────────────────────────────────────────────────────────────────────
// Route Layout:
//   /auth/**       → AuthModule   (login, register, unauthorized) – no guard
//   /csm/**        → CsmModule    – AuthGuard + role: ADMIN | AGENT | UNDERWRITER | CLAIMS_MANAGER
//   /home          → HomeModule   – AuthGuard (any authenticated user / CUSTOMER)
//   /              → redirect → /auth/login
//   /**            → redirect → /auth/login  (wildcard safety net)
// ─────────────────────────────────────────────────────────────────────────────
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'csm',
    loadChildren: () => import('./features/csm/csm.module').then(m => m.CsmModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'AGENT', 'UNDERWRITER', 'CLAIMS_MANAGER'] }
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home-module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
    // No role restriction – accessible by CUSTOMER and any authenticated user
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    // Wildcard: catch any unknown URL and redirect to login
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
