import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComercioService } from '@core/services/comercio.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog.component';
import { EditarProductoDialogComponent } from './editar-producto-dialog.component';
import { Producto } from '@shared/models/producto.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-listar-productos',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Productos</mat-card-title>
          <div class="header-actions">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre del producto" #input>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" routerLink="/comercio/productos/nuevo">
              <mat-icon>add</mat-icon>
              Añadir
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort>
              <!-- Imagen Column -->
              <ng-container matColumnDef="imagen">
                <th mat-header-cell *matHeaderCellDef> Imagen </th>
                <td mat-cell *matCellDef="let producto">
                  <img *ngIf="producto.imagen_url" [src]="producto.imagen_url" alt="Producto" class="producto-imagen">
                  <mat-icon *ngIf="!producto.imagen_url">image_not_available</mat-icon>
                </td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="nombre_producto">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Producto </th>
                <td mat-cell *matCellDef="let producto"> {{producto.nombre_producto}} </td>
              </ng-container>

              <!-- Categoría Column -->
              <ng-container matColumnDef="categoria">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Categoría </th>
                <td mat-cell *matCellDef="let producto"> {{producto.categoria}} </td>
              </ng-container>

              <!-- Precio Column -->
              <ng-container matColumnDef="precio">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Precio </th>
                <td mat-cell *matCellDef="let producto"> {{producto.precio | currency}} </td>
              </ng-container>

              <!-- Stock Column -->
              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Stock </th>
                <td mat-cell *matCellDef="let producto"> 
                  <span [class.low-stock]="producto.stock < 10">{{producto.stock}}</span>
                </td>
              </ng-container>

              <!-- Estado Column -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Estado </th>
                <td mat-cell *matCellDef="let producto">
                  <mat-chip-list>
                    <mat-chip [color]="producto.estado === 'activo' ? 'primary' : 'warn'"
                             [selected]="producto.estado === 'activo'">
                      {{producto.estado}}
                    </mat-chip>
                  </mat-chip-list>
                </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef> Acciones </th>
                <td mat-cell *matCellDef="let producto">
                  <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Acciones">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="editarProducto(producto)">
                      <mat-icon>edit</mat-icon>
                      <span>Editar</span>
                    </button>
                    <button mat-menu-item (click)="cambiarEstado(producto)">
                      <mat-icon>{{producto.estado === 'activo' ? 'visibility_off' : 'visibility'}}</mat-icon>
                      <span>{{producto.estado === 'activo' ? 'Desactivar' : 'Activar'}}</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- Row shown when there is no data -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="7">
                  No se encontraron productos "{{input.value}}"
                </td>
              </tr>
            </table>

            <mat-paginator [pageSizeOptions]="[5, 10, 25]"
                          showFirstLastButtons
                          aria-label="Seleccionar página de productos">
            </mat-paginator>
          </div>
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

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin: 1rem 0;
    }

    .table-container {
      position: relative;
      min-height: 200px;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    .producto-imagen {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .low-stock {
      color: red;
      font-weight: bold;
    }

    .mat-column-imagen {
      width: 80px;
      text-align: center;
    }

    .mat-column-acciones {
      width: 60px;
      text-align: center;
    }

    .mat-column-estado {
      width: 100px;
    }

    .mat-mdc-row .mat-mdc-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
    }

    .mat-mdc-row:hover .mat-mdc-cell {
      border-color: currentColor;
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class ListarProductosComponent implements OnInit {
  displayedColumns: string[] = ['imagen', 'nombre_producto', 'categoria', 'precio', 'stock', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Producto>;
  pedidosHoy$ = this.comercioService.getPedidos().pipe(
    map(pedidos => pedidos.length)
  );
  totalProductos$ = this.comercioService.getProductos().pipe(
    map(productos => productos.length)
  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private comercioService: ComercioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Producto>();
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProductos(): void {
    this.comercioService.getProductos().subscribe({
      next: (productos) => {
        this.dataSource.data = productos;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar productos', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarProducto(producto: any): void {
    const dialogRef = this.dialog.open(EditarProductoDialogComponent, {
      width: '500px',
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comercioService.editarProducto(producto.id_producto, result)
          .subscribe({
            next: () => {
              this.snackBar.open('Producto actualizado', 'Cerrar', {
                duration: 3000
              });
              this.loadProductos();
            },
            error: (error) => {
              this.snackBar.open('Error al actualizar producto', 'Cerrar', {
                duration: 3000
              });
            }
          });
      }
    });
  }

  cambiarEstado(producto: any): void {
    const nuevoEstado = producto.estado === 'activo' ? 'inactivo' : 'activo';
    const mensaje = producto.estado === 'activo' ? 
      `¿Estás seguro de que quieres desactivar "${producto.nombre_producto}"?` :
      `¿Estás seguro de que quieres activar "${producto.nombre_producto}"?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `${producto.estado === 'activo' ? 'Desactivar' : 'Activar'} Producto`,
        message: mensaje
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comercioService.desactivarProducto(producto.id_producto)
          .subscribe({
            next: () => {
              this.snackBar.open('Estado actualizado', 'Cerrar', {
                duration: 3000
              });
              this.loadProductos();
            },
            error: (error) => {
              this.snackBar.open('Error al actualizar estado', 'Cerrar', {
                duration: 3000
              });
            }
          });
      }
    });
  }
}