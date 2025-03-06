import { Component } from '@angular/core';
import {AuthServiceService} from '../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';

  constructor(private authService: AuthServiceService, private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const fullName = `${this.firstName} ${this.lastName}`;

    this.authService.register(fullName, this.email, this.password, this.role).subscribe(
      (response) => {
        alert("Registration successful!");
        this.router.navigate(['/login']);
      },
      (error) => {
        alert("Registration failed! Please try again.");
        console.error(error);
      }
    );
  }

}
