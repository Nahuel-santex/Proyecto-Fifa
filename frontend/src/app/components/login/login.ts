import { Component } from '@angular/core';
import { AuthService } from '../../services/auth'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => { 
        console.log('Login exitoso', response);
        this.router.navigate(['/players']);
      },
      error: (err: any) => { 
        console.error('Error en el login', err);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}