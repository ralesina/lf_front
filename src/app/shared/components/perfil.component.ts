import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Usuario, PerfilResponse } from '@shared/models/usuario.model';

@Component({
  selector: 'app-perfil',
  template: `
  <app-nav-bar></app-nav-bar>
      
  <mat-card>
    <div class="container mx-auto p-4">
      <mat-card class="max-w-2xl mx-auto">
        <mat-card-header>
          <mat-card-title>Mi Perfil</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()" class="mt-4">
            <!-- Campos comunes -->
            <mat-form-field class="w-full">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Nombre">
              <mat-error *ngIf="perfilForm.get('nombre')?.errors?.['required']">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full mt-4">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Email" type="email">
              <mat-error *ngIf="perfilForm.get('email')?.errors?.['required']">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="perfilForm.get('email')?.errors?.['email']">
                Ingrese un email válido
              </mat-error>
            </mat-form-field>

            <!-- Campos específicos de comercio -->
            <ng-container *ngIf="isComercio">
              <mat-form-field class="w-full mt-4">
                <mat-label>Dirección</mat-label>
                <input matInput formControlName="direccion" placeholder="Dirección">
              </mat-form-field>

              <mat-form-field class="w-full mt-4">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" placeholder="Teléfono">
              </mat-form-field>

              <div class="flex gap-4">
                <mat-form-field class="w-full mt-4">
                  <mat-label>Latitud</mat-label>
                  <input matInput type="number" formControlName="latitud" placeholder="Latitud">
                  <mat-error *ngIf="perfilForm.get('latitud')?.errors?.['required']">
                    La latitud es requerida
                  </mat-error>
                </mat-form-field>

                <mat-form-field class="w-full mt-4">
                  <mat-label>Longitud</mat-label>
                  <input matInput type="number" formControlName="longitud" placeholder="Longitud">
                  <mat-error *ngIf="perfilForm.get('longitud')?.errors?.['required']">
                    La longitud es requerida
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field class="w-full mt-4">
                <mat-label>Radio de cobertura (km)</mat-label>
                <input matInput type="number" formControlName="radio_cercania" placeholder="Radio de cobertura">
              </mat-form-field>
            </ng-container>

            <!-- Campos específicos de cliente -->
            <ng-container *ngIf="!isComercio">
              <mat-form-field class="w-full mt-4">
                <mat-label>Dirección</mat-label>
                <input matInput formControlName="direccion" placeholder="Dirección">
              </mat-form-field>

              <mat-form-field class="w-full mt-4">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" placeholder="Teléfono">
              </mat-form-field>
            </ng-container>

            <div class="flex justify-end mt-6 gap-4">
              <button mat-button type="button" (click)="onCancel()">
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="perfilForm.invalid || loading || !perfilForm.dirty">
                <mat-spinner diameter="20" *ngIf="loading" class="mr-2"></mat-spinner>
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  </mat-card>
<app-footer></app-footer>
  `
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  loading = false;
  isComercio = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router

  ) {
    this.isComercio = this.authService.getCurrentUserRole() === 'comercio';
    this.perfilForm = this.createForm();
  }

  ngOnInit() {
    this.loadPerfilData();
  }

  private createForm(): FormGroup {
    const baseControls = {
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      telefono: ['']
    };

    const comercioControls = this.isComercio ? {
      latitud: ['0', Validators.required],
      longitud: ['0', Validators.required],
      radio_cercania: ['0']
    } : {};

    return this.fb.group({
      ...baseControls,
      ...comercioControls
    });
  }

  private loadPerfilData() {
    this.loading = true;
    this.authService.getPerfil().subscribe({
      next: (response: PerfilResponse) => {
        if (response.success && response.data.success && response.data.data) {
          // Convertir valores string a number para los campos numéricos
          const perfilData = {
            ...response.data.data,
            latitud: parseFloat(response.data.data.latitud),
            longitud: parseFloat(response.data.data.longitud),
            radio_cercania: parseInt(response.data.data.radio_cercania)
          };
          
          console.log('Cargando datos en el formulario:', perfilData);
          this.perfilForm.patchValue(perfilData);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.snackBar.open('Error al cargar datos del perfil', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onCancel() {
    if (this.isComercio) {
      this.router.navigate(['/comercio/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.perfilForm.valid && this.perfilForm.dirty) {
      this.loading = true;
      const perfilData = this.perfilForm.value;

      if (this.isComercio) {
        perfilData.latitud = perfilData.latitud.toString();
        perfilData.longitud = perfilData.longitud.toString();
        perfilData.radio_cercania = perfilData.radio_cercania.toString();
      }

      this.authService.editarPerfil(perfilData).subscribe({
        next: (response: PerfilResponse) => {
          if (response.success && response.data.success) {
            this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
              duration: 3000
            });
            if (response.data.data) {
              this.authService.updateStoredUserData(response.data.data);
              this.onCancel();
            }
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          this.snackBar.open(error.error?.message || 'Error al actualizar perfil', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }
}