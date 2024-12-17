import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  template: `
      <div class="login-container">
        <div class="login-card">
          <h1>LocalFresh</h1>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password">
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit">
              Iniciar Sesión
            </button>
          </form>
          
          <a routerLink="/auth/register">¿No tienes cuenta? Regístrate</a>
        </div>
      </div>

    `,
  styles: [`
      .login-container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-light-yellow);
      }
      
      .login-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
      }
      
      h1 {
        color: var(--color-dark-brown);
        text-align: center;
        margin-bottom: 2rem;
      }
      
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      button {
        background-color: var(--color-pistachio) !important;
        color: var(--color-dark-brown) !important;
      }
      
      a {
        display: block;
        text-align: center;
        margin-top: 1rem;
        color: var(--color-dark-brown);
        text-decoration: none;
      }
    `]
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.password || ''
      }
      this.authService.login(credentials).subscribe({
        next: (response) => {
          if (response?.data?.data?.user?.rol) {
            if (response.data.data.user.rol === 'comercio') {
              this.router.navigate(['/comercio/dashboard']);
            } else {
              this.router.navigate(['/cliente/home']);
            }
          } else {
            console.error('Respuesta inválida del servidor:', response);
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
        }
      });
    }
  }
}