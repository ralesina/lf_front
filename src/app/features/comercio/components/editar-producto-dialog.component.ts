import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ComercioService } from '@core/services/comercio.service';
import { Categoria } from '@shared/models/producto.model';
@Component({
  selector: 'app-editar-producto-dialog',
  template: `
    <h2 mat-dialog-title>Editar Producto</h2>
    <form [formGroup]="productoForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-container">
          <mat-form-field appearance="outline">
            <mat-label>Nombre del Producto</mat-label>
            <input matInput formControlName="nombre_producto">
            <mat-error *ngIf="productoForm.get('nombre_producto')?.hasError('required')">
              El nombre es requerido
            </mat-error>
            <mat-error *ngIf="productoForm.get('nombre_producto')?.hasError('minlength')">
              El nombre debe tener al menos 3 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="descripcion" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Precio</mat-label>
            <input matInput type="number" formControlName="precio">
            <span matPrefix>$&nbsp;</span>
            <mat-error *ngIf="productoForm.get('precio')?.hasError('required')">
              El precio es requerido
            </mat-error>
            <mat-error *ngIf="productoForm.get('precio')?.hasError('min')">
              El precio debe ser mayor que 0
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="id_categoria">
              <mat-option *ngFor="let cat of categorias$ | async" [value]="cat.id">
                {{cat.nombre_categoria}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="image-section">
            <div *ngIf="data.imagen_url || imagePreview" class="current-image">
              <img [src]="imagePreview || data.imagen_url" alt="Imagen del producto">
            </div>
            <button type="button" mat-stroked-button (click)="fileInput.click()">
              <mat-icon>cloud_upload</mat-icon>
              Cambiar imagen
            </button>
            <input #fileInput type="file" hidden accept="image/*" (change)="onFileSelected($event)">
            <span *ngIf="selectedFileName">{{selectedFileName}}</span>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]>Cancelar</button>
        <button mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="productoForm.invalid || loading">
          <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
          Guardar Cambios
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
    }

    .image-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .current-image {
      width: 200px;
      height: 200px;
      border-radius: 4px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  `]
})
export class EditarProductoDialogComponent {
  productoForm: FormGroup;
  loading = false;
  categorias$: Observable<any[]>;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditarProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private comercioService: ComercioService
  ) {
    this.productoForm = this.fb.group({
      nombre_producto: [data.nombre_producto, [Validators.required, Validators.minLength(3)]],
      descripcion: [data.descripcion],
      precio: [data.precio, [Validators.required, Validators.min(0.01)]],
      id_categoria: [data.id_categoria, Validators.required]
    });

    this.categorias$ = this.comercioService.getCategorias()
      .pipe(map(response => response.data.data));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit() {
    if (this.productoForm.valid) {
      const formData = new FormData();
      const formValue = this.productoForm.value;
      
      // Agregar los campos del formulario al FormData
      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      });
      
      // Agregar la imagen si se seleccionó una nueva
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }
      
      // Cerrar el diálogo con el FormData
      this.dialogRef.close(formData);
    }
  }
}