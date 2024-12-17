import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComercioService } from '@core/services/comercio.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container">
      <h1 class="dashboard-title">Panel de Control</h1>

      <mat-grid-list cols="2" rowHeight="2:1" gutterSize="16">
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Gestión de Productos</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="card-actions">
                <button mat-raised-button color="primary" routerLink="/comercio/productos/nuevo">
                  <mat-icon>add</mat-icon>
                  Nuevo Producto
                </button>
                <button mat-raised-button color="accent" routerLink="/comercio/productos">
                  <mat-icon>edit</mat-icon>
                  Editar Productos
                </button>
              </div>
              <mat-icon class="dashboard-icon">inventory_2</mat-icon>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="dashboard-card" routerLink="/comercio/pedidos">
            <mat-card-header>
              <mat-card-title>Pedidos Activos</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-icon class="dashboard-icon">list_alt</mat-icon>
              <span class="pedidos-count" *ngIf="pedidosActivos$ | async as count">
                {{count}}
              </span>
              <p class="card-description" *ngIf="pedidosActivos$ | async as count">
                {{ count === 0 ? 'No hay pedidos activos' : 
                   count === 1 ? '1 pedido requiere atención' :
                   count + ' pedidos requieren atención' }}
              </p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="dashboard-card" routerLink="/comercio/inventario">
            <mat-card-header>
              <mat-card-title>Control de Inventario</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-icon class="dashboard-icon">category</mat-icon>
              <p class="card-description">Gestionar stock de productos</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Resumen</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-icon class="dashboard-icon">bar_chart</mat-icon>
              <div class="stats-container">
                <div class="stat-item">
                  <span class="stat-label">Pedidos Hoy</span>
                  <span class="stat-value">{{pedidosHoy$ | async}}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Productos</span>
                  <span class="stat-value">{{totalProductos$ | async}}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: var(--color-light-yellow);
      min-height: calc(100vh - 64px);
    }

    .dashboard-title {
      color: var(--color-dark-brown);
      margin-bottom: 2rem;
      font-size: 2rem;
    }

    .dashboard-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.2s;
      padding: 1rem;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      position: relative;
      gap: 1rem;
    }

    .card-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .dashboard-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--color-dark-brown);
    }

    .pedidos-count {
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: var(--color-pistachio);
      color: var(--color-dark-brown);
      padding: 0.5rem;
      border-radius: 50%;
      min-width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .card-description {
      text-align: center;
      color: rgba(0, 0, 0, 0.7);
      margin: 0;
    }

    .stats-container {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.7);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-dark-brown);
    }
  `]
})
export class DashboardComercioComponent implements OnInit {
  pedidosActivos$ = this.comercioService.getCountPedidosActivos();
  pedidosHoy$ = this.comercioService.getCountPedidosHoy();
  totalProductos$ = this.comercioService.getCountProductos();

  constructor(private comercioService: ComercioService) {}

  ngOnInit(): void {}
}