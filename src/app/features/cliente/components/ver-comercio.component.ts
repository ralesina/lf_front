import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '@core/services/cliente.service';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-ver-comercio',
  template: `
    <div class="container">
      <mat-card *ngIf="comercio$ | async as comercio">
        <mat-card-header>
          <mat-card-title>{{comercio.nombre}}</mat-card-title>
          <mat-card-subtitle>{{comercio.categoria}}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <p class="address">
            <mat-icon>location_on</mat-icon>
            {{comercio.direccion}}
          </p>
        </mat-card-content>
      </mat-card>

      <div class="products-section">
        <h2>Productos</h2>
        <div class="products-grid">
          <mat-card *ngFor="let producto of productos$ | async" class="product-card">
            <img *ngIf="producto.imagen_url" 
                 [src]="producto.imagen_url" 
                 [alt]="producto.nombre_producto"
                 class="product-image">
            
            <mat-card-header>
              <mat-card-title>{{producto.nombre_producto}}</mat-card-title>
              <mat-card-subtitle>{{producto.precio | currency}}</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <p *ngIf="producto.descripcion">{{producto.descripcion}}</p>
              <p class="stock" [class.low-stock]="producto.stock < 5">
                Stock: {{producto.stock}} unidades
              </p>
            </mat-card-content>

            <mat-card-actions>
              <div class="quantity-selector">
                <button mat-icon-button 
                        (click)="decrementQuantity(producto)">
                  <mat-icon>remove</mat-icon>
                </button>
                <span>{{getQuantity(producto)}}</span>
                <button mat-icon-button 
                        (click)="incrementQuantity(producto)"
                        [disabled]="getQuantity(producto) >= producto.stock">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <button mat-raised-button 
                      color="primary"
                      (click)="addToCart(producto)"
                      [disabled]="getQuantity(producto) === 0 || getQuantity(producto) > producto.stock">
                Agregar al carrito
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div *ngIf="cartItems.length > 0" class="cart-summary">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Carrito</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let item of cartItems">
                <span>{{item.cantidad}}x {{item.nombre_producto}}</span>
                <span class="spacer"></span>
                <span>{{item.precio * item.cantidad | currency}}</span>
              </mat-list-item>
            </mat-list>
            <mat-divider></mat-divider>
            <div class="total">
              <span>Total:</span>
              <span>{{getTotal() | currency}}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button 
                    color="primary" 
                    [routerLink]="['/cliente/checkout']">
              Realizar Pedido
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: var(--color-light-yellow);
      min-height: calc(100vh - 64px);
    }

    .products-section {
      margin-top: 2rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .product-card {
      display: flex;
      flex-direction: column;
    }

    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-right: 1rem;
    }

    .stock {
      margin-top: 1rem;
      font-weight: 500;
      &.low-stock {
        color: #f44336;
      }
    }

    .cart-summary {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 400px;
      max-width: calc(100vw - 4rem);
      
      mat-card {
        max-height: calc(100vh - 8rem);
        overflow-y: auto;
      }
    }

    .spacer {
      flex: 1;
    }

    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      font-weight: 500;
      font-size: 1.1em;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .address {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
      color: rgba(0, 0, 0, 0.7);
    }
  `]
})
export class VerComercioComponent implements OnInit {
  comercio$!: Observable<any>;
  productos$!: Observable<any[]>;
  productQuantities: Map<number, number> = new Map();
  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const comercioId = this.route.snapshot.params['id'];
    this.comercio$ = this.clienteService.getComercio(comercioId);
    this.productos$ = this.clienteService.getProductosComercio(comercioId);
    this.cartItems = this.cartService.getItems();
  }

  getQuantity(producto: any): number {
    return this.productQuantities.get(producto.id_producto) || 0;
  }

  incrementQuantity(producto: any) {
    const currentQuantity = this.getQuantity(producto);
    if (currentQuantity < producto.stock) {
      this.productQuantities.set(producto.id_producto, currentQuantity + 1);
    }
  }

  decrementQuantity(producto: any) {
    const currentQuantity = this.getQuantity(producto);
    if (currentQuantity > 0) {
      this.productQuantities.set(producto.id_producto, currentQuantity - 1);
    }
  }

  addToCart(producto: any) {
    const quantity = this.getQuantity(producto);
    if (quantity > 0) {
      try {
        this.comercio$.subscribe(comercioActual => {
          this.cartService.addItem({
            ...producto,
            cantidad: quantity
          }, comercioActual);

          this.productQuantities.set(producto.id_producto, 0);
          // Actualizamos los items del carrito
          this.cartItems = this.cartService.getItems();
          
          this.snackBar.open('Producto agregado al carrito', 'Cerrar', {
            duration: 3000
          });
        });
      } catch (error: any) {
        this.snackBar.open(
          error.message || 'Error al agregar al carrito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    }
}
  getTotal(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.precio * item.cantidad), 0);
  }
}