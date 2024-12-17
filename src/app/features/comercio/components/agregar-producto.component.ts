import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComercioService } from '@core/services/comercio.service';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { CategoriaResponse, Categoria } from '@shared/models/producto.model';

@Component({
  selector: 'app-agregar-producto',
  template: `
    <div class="container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Agregar Nuevo Producto</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="productoForm" (ngSubmit)="onSubmit()" class="product-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nombre del Producto</mat-label>
                <input matInput formControlName="nombre_producto">
                <mat-error *ngIf="productoForm.get('nombre_producto')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Precio</mat-label>
                <input matInput type="number" formControlName="precio">
                <span matPrefix>$&nbsp;</span>
                <mat-error *ngIf="productoForm.get('precio')?.hasError('required')">
                  El precio es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="3"></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="id_categoria">
                  <mat-option *ngFor="let cat of categorias$ | async" [value]="cat.id">
                    {{cat.nombre}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Stock Inicial</mat-label>
                <input matInput type="number" formControlName="stock">
              </mat-form-field>
            </div>
            <div class="image-upload-section">
              <button type="button" mat-stroked-button (click)="fileInput.click()" color="primary">
                <mat-icon>cloud_upload</mat-icon>
                Seleccionar Imagen
              </button>
              <input #fileInput type="file" hidden accept="image/*" (change)="onFileSelected($event)">
              
              <div *ngIf="selectedFileName" class="selected-file">
                {{selectedFileName}}
                <button type="button" mat-icon-button color="warn" (click)="removeSelectedFile()">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>

              <div *ngIf="imagePreview" class="image-preview">
                <img [src]="imagePreview" alt="Vista previa">
              </div>
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/comercio/productos">
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="productoForm.invalid || loading">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                Guardar Producto
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: var(--color-light-yellow);
      min-height: calc(100vh - 64px);
    }

    .form-card {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .image-upload-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px dashed var(--color-celadon);
      border-radius: 4px;
    }

    .selected-file {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .image-preview {
      max-width: 300px;
      margin-top: 1rem;

      img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class AgregarProductoComponent implements OnInit {
  productoForm: FormGroup;
  loading = false;
  categorias$: Observable<Categoria[]>;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      nombre_producto: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      id_categoria: ['', Validators.required],
      stock: [0, Validators.min(0)]
    });

    this.categorias$ = this.comercioService.getCategorias()
      .pipe(
        map((response: CategoriaResponse) => response.data.data)
      );
  }

  ngOnInit(): void { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Por favor, selecciona una imagen válida', 'Cerrar', {
        duration: 3000
      });
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.productoForm.valid) {
      this.loading = true;

      this.comercioService
        .agregarProducto(this.productoForm.value, this.selectedFile)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.snackBar.open('Producto agregado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/comercio/productos']);
          },
          error: (error) => {
            this.snackBar.open(
              error.message || 'Error al agregar producto',
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
    }
  }
}