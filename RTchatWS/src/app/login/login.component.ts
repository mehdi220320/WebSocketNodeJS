import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthServiceService} from '../services/auth-service.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthServiceService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    this.loading = true;
    this.authService.loginn(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id);
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
