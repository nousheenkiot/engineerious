import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    isLoading = false;
    error = '';

    constructor(private authService: AuthService) { }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                },
                error: (err) => {
                    this.isLoading = false;
                    this.error = 'Invalid credentials';
                }
            });
        }
    }
}
