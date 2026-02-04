import { Component, signal } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ai-ui');

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
    return false;
  }
}
