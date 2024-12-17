import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteService } from '@core/services/cliente.service';
import { Comercio } from '@shared/models/comercio.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comercios-cercanos',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Comercios Cercanos</mat-card-title>
          <mat-card-subtitle>
            Mostrando comercios en un radio de {{radio}}km
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="comercios-grid" *ngIf="!(loading); else loadingTpl">
            <mat-card *ngFor="let comercio of comercios$ | async" class="comercio-card">
              <mat-card-header>
                <mat-card-title>{{comercio.nombre}}</mat-card-title>
                <mat-card-subtitle>{{comercio.categoria}}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <p class="address">
                  <mat-icon>location_on</mat-icon>
                  {{comercio.direccion}}
                </p>
                <p *ngIf="comercio.distancia" class="distance">
                  <mat-icon>near_me</mat-icon>
                  {{comercio.distancia | number:'1.1-1'}} km
                </p>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button color="primary"
                        [routerLink]="['/cliente/comercio', comercio.id_comercio]">
                  Ver Productos
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <ng-template #loadingTpl>
            <div class="loading-container">
              <mat-spinner></mat-spinner>
            </div>
          </ng-template>
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

    .comercios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .comercio-card {
      height: 100%;
    }

    .address, .distance {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      color: rgba(0, 0, 0, 0.7);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class ComerciosCercanosComponent implements OnInit {
  comercios$!: Observable<Comercio[]>;
  loading = false;
  radio = 5; // Radio por defecto en kilómetros

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.obtenerUbicacion();
  }

  private obtenerUbicacion() {
    if (!navigator.geolocation) {
      this.snackBar.open('La geolocalización no está disponible en tu navegador', 'Cerrar');
      return;
    }

    this.loading = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.comercios$ = this.clienteService.buscarComerciosCercanos(latitude, longitude, this.radio);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackBar.open('Error al obtener la ubicación. Por favor, habilita la geolocalización', 'Cerrar');
      }
    );
  }
}