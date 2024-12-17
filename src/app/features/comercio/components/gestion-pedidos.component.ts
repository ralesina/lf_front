import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComercioService } from '@core/services/comercio.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog.component';
import { Pedido } from '@shared/models/pedido.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-gestion-pedidos',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestión de Pedidos</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <mat-tab-group (selectedTabChange)="onTabChange($event)">
            <mat-tab label="Pendientes ({{(pedidosPendientes$ | async)?.length || 0}})">
              <div class="pedidos-list">
                <app-pedido-card
                  *ngFor="let pedido of pedidosPendientes$ | async"
                  [pedido]="pedido"
                  (statusChange)="cambiarEstado($event)">
                </app-pedido-card>
                <div *ngIf="(pedidosPendientes$ | async)?.length === 0" class="no-pedidos">
                  No hay pedidos pendientes
                </div>
              </div>
            </mat-tab>

            <mat-tab label="En Preparación ({{(pedidosEnPreparacion$ | async)?.length || 0}})">
              <div class="pedidos-list">
                <app-pedido-card
                  *ngFor="let pedido of pedidosEnPreparacion$ | async"
                  [pedido]="pedido"
                  (statusChange)="cambiarEstado($event)">
                </app-pedido-card>
                <div *ngIf="(pedidosEnPreparacion$ | async)?.length === 0" class="no-pedidos">
                  No hay pedidos en preparación
                </div>
              </div>
            </mat-tab>

            <mat-tab label="En Camino ({{(pedidosEnCamino$ | async)?.length || 0}})">
              <div class="pedidos-list">
                <app-pedido-card
                  *ngFor="let pedido of pedidosEnCamino$ | async"
                  [pedido]="pedido"
                  (statusChange)="cambiarEstado($event)">
                </app-pedido-card>
                <div *ngIf="(pedidosEnCamino$ | async)?.length === 0" class="no-pedidos">
                  No hay pedidos en camino
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Completados ({{(pedidosCompletados$ | async)?.length || 0}})">
              <div class="pedidos-list">
                <app-pedido-card
                  *ngFor="let pedido of pedidosCompletados$ | async"
                  [pedido]="pedido"
                  [showActions]="false">
                </app-pedido-card>
                <div *ngIf="(pedidosCompletados$ | async)?.length === 0" class="no-pedidos">
                  No hay pedidos completados
                </div>
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

    .no-pedidos {
      text-align: center;
      padding: 2rem;
      grid-column: 1 / -1;
      color: #666;
      font-style: italic;
    }

    mat-card {
      margin-bottom: 1rem;
    }
  `]
})
export class GestionPedidosComponent implements OnInit {
  pedidosPendientes$ = new BehaviorSubject<Pedido[]>([]);
  pedidosEnPreparacion$ = new BehaviorSubject<Pedido[]>([]);
  pedidosEnCamino$ = new BehaviorSubject<Pedido[]>([]);
  pedidosCompletados$ = new BehaviorSubject<Pedido[]>([]);
  
  constructor(
    private comercioService: ComercioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    // Cargar pedidos por estado
    this.comercioService.getPedidosPorEstado('pendiente').subscribe(
      pedidos => this.pedidosPendientes$.next(pedidos)
    );
    
    this.comercioService.getPedidosPorEstado('preparando').subscribe(
      pedidos => this.pedidosEnPreparacion$.next(pedidos)
    );
    
    this.comercioService.getPedidosPorEstado('enviado').subscribe(
      pedidos => this.pedidosEnCamino$.next(pedidos)
    );
    
    this.comercioService.getPedidosPorEstado('completado').subscribe(
      pedidos => this.pedidosCompletados$.next(pedidos)
    );
  }

  onTabChange(event: MatTabChangeEvent) {
    this.cargarPedidos();
  }

  cambiarEstado(event: { idPedido: number; nuevoEstado: string }) {
    this.comercioService.actualizarEstadoPedido(event.idPedido, event.nuevoEstado)
      .subscribe({
        next: () => {
          this.snackBar.open('Estado actualizado correctamente', 'Cerrar', {
            duration: 3000
          });
          this.cargarPedidos();
        },
        error: (error) => {
          this.snackBar.open(
            error.message || 'Error al actualizar el estado del pedido', 
            'Cerrar', 
            { duration: 3000 }
          );
        }
      });
  }
}

@Component({
  selector: 'app-pedido-card',
  template: `
    <mat-card class="pedido-card">
      <mat-card-header>
        <mat-card-title>Pedido #{{pedido?.id_pedido}}</mat-card-title>
        <mat-card-subtitle>
          {{pedido?.fecha_pedido | date:'medium'}}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="cliente-info">
          <p><strong>Cliente:</strong> {{pedido?.cliente_nombre}}</p>
          <p><strong>Dirección:</strong> {{pedido?.direccion_entrega}}</p>
          <p><strong>Teléfono:</strong> {{pedido?.telefono_contacto}}</p>
        </div>

        <mat-divider></mat-divider>

        <div class="productos-list">
          <h3>Productos:</h3>
          <div *ngFor="let detalle of pedido?.detalles" class="producto-item">
            <span>{{detalle.nombre_producto}}</span>
            <span class="cantidad">x{{detalle.cantidad}}</span>
            <span class="precio">{{detalle.precio * detalle.cantidad | currency}}</span>
          </div>
        </div>

        <div class="total">
          <strong>Total:</strong> {{calcularTotal() | currency}}
        </div>
      </mat-card-content>

      <mat-card-actions *ngIf="showActions" align="end">
        <ng-container [ngSwitch]="pedido?.estado">
          <button mat-button color="primary" 
                  *ngSwitchCase="'pendiente'"
                  (click)="updateStatus('preparando')">
            <mat-icon>restaurant</mat-icon>
            Iniciar Preparación
          </button>
          
          <button mat-button color="primary" 
                  *ngSwitchCase="'preparando'"
                  (click)="updateStatus('enviado')">
            <mat-icon>delivery_dining</mat-icon>
            Marcar Como Enviado
          </button>
          
          <button mat-button color="primary" 
                  *ngSwitchCase="'enviado'"
                  (click)="updateStatus('completado')">
            <mat-icon>check_circle</mat-icon>
            Completar Pedido
          </button>
        </ng-container>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .pedido-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .cliente-info, .productos-list {
      margin: 1rem 0;
    }

    .producto-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      padding: 0.5rem 0;
      align-items: center;
    }

    .cantidad {
      color: #666;
    }

    .precio {
      font-weight: bold;
    }

    .total {
      text-align: right;
      font-size: 1.2em;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    mat-divider {
      margin: 1rem 0;
    }

    mat-card-actions {
      margin-top: auto;
      padding: 1rem;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class PedidoCardComponent {
  @Input() pedido!: Pedido;
  @Input() showActions = true;
  @Output() statusChange = new EventEmitter<{idPedido: number, nuevoEstado: string}>();

  calcularTotal(): number {
    return this.pedido?.detalles?.reduce(
      (total, detalle) => total + (detalle.precio_unitario * detalle.cantidad), 
      0
    ) || 0;
  }

  updateStatus(nuevoEstado: string) {
    if (this.pedido?.id_pedido) {
      this.statusChange.emit({
        idPedido: this.pedido.id_pedido,
        nuevoEstado
      });
    }
  }
}