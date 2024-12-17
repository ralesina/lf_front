import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ClienteService } from '@core/services/cliente.service';
import {ComercioResponse, Comercio } from '@shared/models/comercio.model';

@Component({
  selector: 'app-cliente-home',
  template: `
    <div class="home-container">
      <div class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar comercios o productos</mat-label>
          <input matInput [formControl]="searchControl">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <button mat-raised-button color="primary" (click)="buscarCercanos()">
          <mat-icon>location_on</mat-icon>
          Comercios Cercanos
        </button>
        <button mat-raised-button color="accent" (click)="verPedidos()">
          <mat-icon>receipt_long</mat-icon>
          Mis Pedidos
        </button>
      </div>

      <div class="categories-section">
        <h2>Categorías</h2>
        <div class="categories-grid">
          <mat-card *ngFor="let category of categories" 
                    class="category-card"
                    (click)="onCategorySelect(category)">
            <mat-icon class="category-icon">{{category.icon}}</mat-icon>
            <span>{{category.name}}</span>
          </mat-card>
        </div>
      </div>
    <div class="featured-section">
      <h2>Comercios Destacados</h2>
      <div class="comercios-grid">
        <mat-card *ngFor="let comercio of comerciosDestacados$ | async" 
                  class="comercio-card"
                  (click)="verComercio(comercio.id_comercio)">
          <mat-card-header>
            <mat-card-title>{{comercio.nombre}}</mat-card-title>
            <mat-card-subtitle>{{comercio.direccion}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p *ngIf="comercio.telefono" class="contact-info">
              <mat-icon>phone</mat-icon>
              {{comercio.telefono}}
            </p>
            <p *ngIf="comercio.email" class="contact-info">
              <mat-icon>email</mat-icon>
              {{comercio.email}}
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>store</mat-icon>
              Ver Productos
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      background-color: var(--color-light-yellow);
      min-height: calc(100vh - 64px);
    }
    
    .search-section {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .search-field {
      flex: 1;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
    }

    .category-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      margin-bottom: 0.5rem;
      color: var(--color-dark-brown);
    }
    
    .comercios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .comercio-card {
      display: flex;
      flex-direction: column;
    }
    
    .address, .distance {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      color: rgba(0, 0, 0, 0.7);
    }

    h2 {
      margin-bottom: 1rem;
      color: var(--color-dark-brown);
    }
       .comercio-card {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .comercio-card:hover {
      transform: translateY(-5px);
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      color: rgba(0, 0, 0, 0.7);
    }

    mat-card-actions {
      margin-top: auto;
      padding: 8px;
    }
  `]
})
export class HomeClienteComponent implements OnInit {
  searchControl = new FormControl('');
  comerciosDestacados$: Observable<Comercio[]>;  
  categories = [
    { name: 'Panadería', icon: 'bakery_dining' },
    { name: 'Carnicería', icon: 'lunch_dining' },
    { name: 'Frutería', icon: 'nutrition' },
    { name: 'Pescadería', icon: 'set_meal' }
  ];

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.comerciosDestacados$ = this.clienteService.getComerciosDestacados().pipe(
      map((response: ComercioResponse) => response.data),

    );
    }

  ngOnInit(): void {}
  verComercio(idComercio: string) {
    this.router.navigate(['/cliente/comercio', idComercio]); 
  }
  buscarCercanos() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.router.navigate(['/cliente/comercios-cercanos'], {
          queryParams: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      }, () => {
        // En caso de error o denegación de permisos
        this.router.navigate(['/cliente/comercios-cercanos']);
      });
    }
  }
  verPedidos() {
    this.router.navigate(['/cliente/pedidos']);
  }
  onCategorySelect(category: any) {
    this.router.navigate(['/cliente/comercios'], {
      queryParams: { categoria: category.name }
    });
  }
}