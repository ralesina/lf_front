import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Registro</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre">
              <mat-error *ngIf="registerForm.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Email inválido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Dirección</mat-label>
              <textarea matInput formControlName="direccion" rows="2"></textarea>
              <mat-error *ngIf="registerForm.get('direccion')?.hasError('required')">
                La dirección es requerida
              </mat-error>
            </mat-form-field>

            <mat-radio-group formControlName="rol" class="rol-group">
              <mat-radio-button value="cliente">Cliente</mat-radio-button>
              <mat-radio-button value="comercio">Comercio</mat-radio-button>
            </mat-radio-group>

            <button mat-raised-button color="primary" 
                    type="submit" 
                    [disabled]="registerForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span>Registrarse</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <a mat-button routerLink="/auth/login">¿Ya tienes cuenta? Inicia sesión</a>
        </mat-card-actions>
      </mat-card>
    </div>
 `,
  styles: [`
    .register-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-light-yellow);
      padding: 1rem;
    }

    .register-card {
      width: 100%;
      max-width: 400px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .rol-group {
      display: flex;
      gap: 1rem;
      margin: 0.5rem 0;
    }

    button[type="submit"] {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      direccion: ['', Validators.required],
      rol: ['cliente', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/auth/login']);
            this.snackBar.open('Registro exitoso. Por favor, inicia sesión.', 'Cerrar', {
              duration: 3000
            });
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(
              error.message || 'Error al registrarse. Por favor, intenta nuevamente.',
              'Cerrar',
              { duration: 3000 }
            );
          },
          complete: () => {
            this.loading = false;
          }
        });
    }
  }
}