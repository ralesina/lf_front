import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '@core/services/cliente.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog.component';
import { Pedido } from '@shared/models/pedido.model';

@Component({
  selector: 'app-historial-pedidos',
  template: `
   <div class="container">
     <mat-card>
       <mat-card-header>
         <mat-card-title>Mis Pedidos</mat-card-title>
       </mat-card-header>

       <mat-card-content>
         <mat-tab-group>
           <mat-tab label="Activos">
             <div class="pedidos-list">
               <mat-card *ngFor="let pedido of pedidosActivos$ | async" 
                        class="pedido-card">
                 <mat-card-header>
                   <mat-card-title>Pedido #{{pedido.id_pedido}}</mat-card-title>
                   <mat-card-subtitle>
                     <span [class]="'estado-' + pedido.estado">{{pedido.estado}}</span>
                     <span class="fecha">{{pedido.fecha_pedido | date:'short'}}</span>
                   </mat-card-subtitle>
                 </mat-card-header>

                 <mat-card-content>
                   <div class="comercio-info">
                     <h3>{{pedido.comercio_nombre}}</h3>
                     <p class="direccion">{{pedido.direccion_entrega}}</p>
                   </div>

                   <mat-divider></mat-divider>

                   <div class="items-list">
                     <div *ngFor="let item of pedido.detalles" class="item">
                       <span>{{item.cantidad}}x {{item.nombre_producto}}</span>
                       <span>{{ item.precio_unitario * item.cantidad | currency }}</span>
                     </div>
                   </div>

                   <div class="total">
                     <span>Total</span>
                     <span>{{ pedido.total | currency }}</span>
                   </div>

                   <div class="tracking" *ngIf="pedido.estado !== 'completado'">
                     <mat-stepper [selectedIndex]="getStepIndex(pedido.estado)" linear>
                       <mat-step completed>Pedido Recibido</mat-step>
                       <mat-step [completed]="isStepCompleted(pedido.estado, 'preparando')">
                         En Preparación
                       </mat-step>
                       <mat-step [completed]="isStepCompleted(pedido.estado, 'enviado')">
                         En Camino
                       </mat-step>
                       <mat-step [completed]="isStepCompleted(pedido.estado, 'completado')">
                         Entregado
                       </mat-step>
                     </mat-stepper>
                   </div>
                 </mat-card-content>

                 <mat-card-actions *ngIf="pedido.estado === 'pendiente'">
                   <button mat-button color="warn" (click)="onCancelar(pedido)">
                     Cancelar Pedido
                   </button>
                 </mat-card-actions>
               </mat-card>
             </div>
           </mat-tab>

           <mat-tab label="Historial">
             <div class="pedidos-list">
               <mat-card *ngFor="let pedido of historialPedidos$ | async" 
                        class="pedido-card">
                 <mat-card-header>
                   <mat-card-title>Pedido #{{pedido.id_pedido}}</mat-card-title>
                   <mat-card-subtitle>
                     <span [class]="'estado-' + pedido.estado">{{pedido.estado}}</span>
                     <span class="fecha">{{pedido.fecha_pedido | date:'short'}}</span>
                   </mat-card-subtitle>
                 </mat-card-header>

                 <mat-card-content>
                   <div class="comercio-info">
                     <h3>{{pedido.comercio_nombre}}</h3>
                     <p class="direccion">{{pedido.direccion_entrega}}</p>
                   </div>

                   <mat-divider></mat-divider>
                    <div class="items-list">
                      <div *ngFor="let item of pedido.detalles" class="item">
                        <span>{{ item.cantidad }}x {{ item.nombre_producto }}</span>
                        <span>{{ (item.precio_unitario * item.cantidad) | currency }}</span>
                      </div>
                      <div *ngIf="!pedido.detalles?.length" class="no-items">
                        <p>No hay detalles disponibles para este pedido.</p>
                      </div>
                    </div>
                   <div class="total">
                     <span>Total</span>
                     <span>{{ pedido.total | currency }}</span>
                   </div>
                 </mat-card-content>
               </mat-card>
             </div>
           </mat-tab>
         </mat-tab-group>
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

   .pedidos-list {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
     gap: 1rem;
     padding: 1rem;
   }

   .pedido-card {
     height: 100%;
   }

   .estado-pendiente { color: orange; }
   .estado-preparando { color: blue; }
   .estado-enviado { color: purple; }
   .estado-completado { color: green; }
   .estado-cancelado { color: red; }

   .fecha {
     margin-left: 1rem;
     color: rgba(0,0,0,0.6);
   }

   .comercio-info {
     margin: 1rem 0;
     h3 {
       font-size: 1.5rem;
       margin: 0;
       color: var(--color-dark-brown);
     }
   }

   .items-list {
     margin: 1rem 0;
     
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
}
   }

   .total {
     display: flex;
     justify-content: space-between;
     font-weight: bold;
     margin-top: 1rem;
     padding-top: 0.5rem;
     border-top: 1px solid rgba(0,0,0,0.1);
   }

   .tracking {
     margin-top: 1rem;
   }

   mat-divider {
     margin: 1rem 0;
   }

  .loading-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    color: rgba(0,0,0,0.6);
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  .item:last-child {
    border-bottom: none;
  }
 `]
})
export class HistorialPedidosComponent implements OnInit {
  pedidosActivos$ = this.clienteService.getPedidosActivos();
  historialPedidos$ = this.clienteService.getHistorialPedidos();
  detallesPedido: { [key: string]: any[] } = {};
  
  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Cargar detalles para pedidos activos
    this.pedidosActivos$.subscribe(pedidos => {
      pedidos.forEach(pedido => {
        this.cargarDetalles(pedido.id_pedido);
      });
    });

    // Cargar detalles para historial
    this.historialPedidos$.subscribe(pedidos => {
      pedidos.forEach(pedido => {
        this.cargarDetalles(pedido.id_pedido);
      });
    });
  }

  cargarDetalles(idPedido: number ) {
    if (this.detallesPedido[idPedido]) {
      return; // Evitar cargar duplicados
    }

    this.clienteService.getPedidoDetalle(idPedido).subscribe({
      next: (response) => {
        if (response.success && response.data?.detalles) {
          this.detallesPedido[idPedido] = response.data.detalles;
        }
      },
      error: (err) => {
        console.error('Error al cargar detalles del pedido:', err);
        this.snackBar.open('Error al cargar los detalles del pedido', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  getStepIndex(estado: string): number {
    const estados = ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'];
    return Math.max(0, estados.indexOf(estado));
  }

  isStepCompleted(estadoActual: string, estado: string): boolean {
    const estados = ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'];
    return estados.indexOf(estadoActual) >= estados.indexOf(estado);
  }

  onCancelar(pedido: Pedido) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancelar Pedido',
        message: '¿Estás seguro de que deseas cancelar este pedido?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.cancelarPedido(pedido.id_pedido)
          .subscribe({
            next: () => {
              this.snackBar.open('Pedido cancelado exitosamente', 'Cerrar', {
                duration: 3000
              });
              this.recargarPedidos();
            },
            error: (error) => {
              this.snackBar.open(
                error.message || 'Error al cancelar el pedido',
                'Cerrar',
                { duration: 3000 }
              );
            }
          });
      }
    });
  }
  private recargarPedidos() {
    this.pedidosActivos$ = this.clienteService.getPedidosActivos();
    this.historialPedidos$ = this.clienteService.getHistorialPedidos();
  }
}