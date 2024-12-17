import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComercioService } from '@core/services/comercio.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EditarProductoDialogComponent } from './editar-producto-dialog.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog.component';
@Component({
    selector: 'app-editar-inventario',
    template: `
      <div class="container">
        <mat-card>
          <mat-card-header class="header">
            <mat-card-title>Gestión de Inventario</mat-card-title>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar Producto</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Nombre del producto">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </mat-card-header>
  
          <mat-card-content>
            <table mat-table [dataSource]="dataSource" matSort class="inventory-table">
              <ng-container matColumnDef="nombre_producto">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Producto</th>
                <td mat-cell *matCellDef="let producto">{{producto.nombre_producto}}</td>
              </ng-container>
  
              <ng-container matColumnDef="categoria">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Categoría</th>
                <td mat-cell *matCellDef="let producto">{{producto.categoria}}</td>
              </ng-container>
  
              <ng-container matColumnDef="precio">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
                <td mat-cell *matCellDef="let producto">{{ producto.precio | currency }}</td>
              </ng-container>
  
              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef>Stock</th>
                <td mat-cell *matCellDef="let producto">
                  <mat-form-field appearance="outline" class="stock-field">
                    <input matInput type="number" [formControl]="getStockControl(producto)"
                           (blur)="updateStock(producto)">
                  </mat-form-field>
                </td>
              </ng-container>
  
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let producto">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="editarProducto(producto)">
                      <mat-icon>edit</mat-icon>
                      <span>Editar</span>
                    </button>
                    <button mat-menu-item (click)="desactivarProducto(producto)">
                      <mat-icon>visibility_off</mat-icon>
                      <span>Desactivar</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>
  
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
  
            <mat-paginator [pageSizeOptions]="[10, 25, 50]"
                          showFirstLastButtons></mat-paginator>
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
  
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
  
      .search-field {
        width: 300px;
      }
  
      .inventory-table {
        width: 100%;
      }
  
      .stock-field {
        width: 100px;
      }
  
      .mat-column-acciones {
        width: 80px;
        text-align: center;
      }
    `]
  })
  export class EditarInventarioComponent implements OnInit, OnDestroy {
    displayedColumns = ['nombre_producto', 'categoria', 'precio', 'stock', 'acciones'];
    dataSource: MatTableDataSource<any>;
    searchControl = new FormControl('');
    stockControls = new Map<number, FormControl>();
    private destroy$ = new Subject<void>();
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private comercioService: ComercioService,
      private snackBar: MatSnackBar,
      private dialog: MatDialog
    ) {
      this.dataSource = new MatTableDataSource();
    }
  
    ngOnInit() {
      this.loadProductos();
      this.setupSearch();
    }
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    private loadProductos() {
      this.comercioService.getProductos().subscribe(productos => {
        this.dataSource.data = productos;
        productos.forEach(producto => {
          this.stockControls.set(
            producto.id_producto,
            new FormControl(producto.stock)
          );
        });
      });
    }
  
    private setupSearch() {
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      ).subscribe(value => {
        this.dataSource.filter = value?.toLowerCase() || '';
      });
    }
  
    getStockControl(producto: any): FormControl {
      return this.stockControls.get(producto.id_producto) || new FormControl(0);
    }
  
    updateStock(producto: any) {
      const control = this.stockControls.get(producto.id_producto);
      if (!control) return;
    
      const newStock = control.value;
      if (newStock < 0) {
        this.snackBar.open('El stock no puede ser negativo', 'Cerrar', { duration: 3000 });
        control.setValue(producto.stock);
        return;
      }
    
      this.comercioService.editarInventario(producto.id_producto, newStock)
        .subscribe({
          next: (response) => {
            this.snackBar.open('Stock actualizado correctamente', 'Cerrar', { duration: 3000 });
            producto.stock = newStock;
          },
          error: (error) => {
            this.snackBar.open(error || 'Error al actualizar stock', 'Cerrar', { duration: 3000 });
            control.setValue(producto.stock);
          }
        });
    }
    editarProducto(producto: any) {
      const dialogRef = this.dialog.open(EditarProductoDialogComponent, {
        width: '500px',
        data: producto
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.comercioService.editarProducto(producto.id_producto, result)
            .subscribe({
              next: () => {
                this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', {
                  duration: 3000
                });
                this.loadProductos();
              },
              error: (error) => {
                this.snackBar.open(
                  error.message || 'Error al actualizar el producto', 
                  'Cerrar', 
                  { duration: 3000 }
                );
              }
            });
        }
      });
    }
    
    desactivarProducto(producto: any) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Desactivar Producto',
          message: `¿Está seguro que desea desactivar el producto "${producto.nombre_producto}"?`
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.comercioService.desactivarProducto(producto.id_producto)
            .subscribe({
              next: () => {
                this.snackBar.open('Producto desactivado exitosamente', 'Cerrar', {
                  duration: 3000
                });
                this.loadProductos();
              },
              error: (error) => {
                this.snackBar.open(
                  error.message || 'Error al desactivar el producto', 
                  'Cerrar', 
                  { duration: 3000 }
                );
              }
            });
        }
      });
    }
  }