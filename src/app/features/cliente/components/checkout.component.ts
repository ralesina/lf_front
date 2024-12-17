import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '@core/services/cart.service';
import { ClienteService } from '@core/services/cliente.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  template: `
   <div class="container">
     <div class="checkout-grid">
       <mat-card class="order-details">
         <mat-card-header>
           <mat-card-title>Resumen del Pedido</mat-card-title>
         </mat-card-header>
         
         <mat-card-content>
           <div class="comercio-info">
             <h3>{{comercio?.nombre}}</h3>
             <p>{{comercio?.direccion}}</p>
           </div>

           <mat-list>
             <mat-list-item *ngFor="let item of items">
               <div class="item-detail">
                 <span>{{item.cantidad}}x {{item.nombre_producto}}</span>
                 <span>{{ item.precio * item.cantidad | currency }}</span>
               </div>
             </mat-list-item>
           </mat-list>

           <mat-divider></mat-divider>

           <div class="total-section">
             <div class="total">
               <span>Total</span>
               <span>{{ calcularTotal() | currency }}</span>
             </div>
           </div>
         </mat-card-content>
       </mat-card>

       <mat-card class="delivery-form">
         <mat-card-header>
           <mat-card-title>Datos de Entrega</mat-card-title>
         </mat-card-header>

         <mat-card-content>
           <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
             
             <mat-radio-group formControlName="tipo_entrega" class="delivery-type">
               <mat-radio-button value="envio">Envío a domicilio</mat-radio-button>
               <mat-radio-button value="recoger">Recoger en tienda</mat-radio-button>
             </mat-radio-group>

             <mat-form-field appearance="outline" *ngIf="esParaEnvio">
               <mat-label>Dirección de entrega</mat-label>
               <textarea matInput formControlName="direccion_entrega" 
                         rows="2"></textarea>
               <mat-error *ngIf="checkoutForm.get('direccion_entrega')?.hasError('required')">
                 La dirección es requerida
               </mat-error>
             </mat-form-field>

             <mat-form-field appearance="outline">
               <mat-label>Teléfono de contacto</mat-label>
               <input matInput formControlName="telefono_contacto">
               <mat-error *ngIf="checkoutForm.get('telefono_contacto')?.hasError('required')">
                 El teléfono es requerido
               </mat-error>
             </mat-form-field>

             <mat-form-field appearance="outline">
               <mat-label>Instrucciones especiales</mat-label>
               <textarea matInput formControlName="instrucciones" 
                         rows="2"
                         placeholder="Instrucciones para el repartidor, referencias para llegar, etc."></textarea>
             </mat-form-field>

             <mat-radio-group formControlName="metodo_pago" class="payment-methods">
               <mat-radio-button value="efectivo">Efectivo</mat-radio-button>
               <mat-radio-button value="tarjeta">Tarjeta</mat-radio-button>
             </mat-radio-group>

             <button mat-raised-button color="primary" 
                     type="submit"
                     [disabled]="checkoutForm.invalid || loading">
               <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
               <span *ngIf="!loading">Confirmar Pedido</span>
             </button>
           </form>
         </mat-card-content>
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

   .checkout-grid {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 2rem;
     max-width: 1200px;
     margin: 0 auto;
   }

   @media (max-width: 768px) {
     .checkout-grid {
       grid-template-columns: 1fr;
     }
   }

   .comercio-info {
     margin-bottom: 1rem;
     
     h3 {
       margin: 0;
       color: var(--color-dark-brown);
     }
     
     p {
       margin: 0.5rem 0;
       color: rgba(0, 0, 0, 0.7);
     }
   }

   .item-detail {
     display: flex;
     justify-content: space-between;
     width: 100%;
     padding: 0.5rem 0;
   }

   .total-section {
     margin-top: 1rem;
     font-size: 1.1em;

     .total {
       font-weight: bold;
       font-size: 1.2em;
       margin-top: 1rem;
       padding-top: 1rem;
       border-top: 1px solid rgba(0, 0, 0, 0.12);
       display: flex;
       justify-content: space-between;
     }
   }

   form {
     display: flex;
     flex-direction: column;
     gap: 1rem;
   }

   .delivery-type, .payment-methods {
     display: flex;
     gap: 1rem;
     margin: 1rem 0;
   }

   button[type="submit"] {
     margin-top: 1rem;
     height: 48px;
     display: flex;
     align-items: center;
     justify-content: center;
     gap: 0.5rem;
   }
 `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  items: any[] = [];
  comercio: any;
  loading = false;
  esParaEnvio = true;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.fb.group({
      direccion_entrega: ['', Validators.required],
      telefono_contacto: ['', Validators.required],
      instrucciones: [''],
      metodo_pago: ['efectivo', Validators.required],
      tipo_entrega: ['envio', Validators.required]
    });
  }

  ngOnInit() {
    this.items = this.cartService.getItems();
    const comercioData = JSON.parse(localStorage.getItem('comercio') || '{}');
    this.comercio = comercioData.data;

    if (!this.items.length || !this.comercio) {
      this.router.navigate(['/cliente/home']);
      return;
    }

    this.checkoutForm.get('tipo_entrega')?.valueChanges.subscribe(value => {
      this.esParaEnvio = value === 'envio';
      if (!this.esParaEnvio) {
        this.checkoutForm.patchValue({
          direccion_entrega: `Recoger en: ${this.comercio.direccion}`,
          tipo_entrega: 'recoger'
        });
      } else {
        this.checkoutForm.patchValue({
          direccion_entrega: ''
        });
      }
      this.actualizarValidadores();
    });
  }

  actualizarValidadores() {
    const direccionControl = this.checkoutForm.get('direccion_entrega');
    if (this.esParaEnvio) {
      direccionControl?.setValidators([Validators.required]);
    } else {
      direccionControl?.clearValidators();
      direccionControl?.setValidators(null);
    }
    direccionControl?.updateValueAndValidity();
  }

  calcularTotal(): number {
    return this.items.reduce((sum, item) =>
      sum + (item.precio * item.cantidad), 0);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.loading = true;
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const pedidoData = {
        id_usuario: userData.id_usuario, // Usamos id_usuario como id_cliente
        id_comercio: this.comercio.id_comercio,
        direccion_entrega: this.checkoutForm.value.direccion_entrega,
        telefono_contacto: this.checkoutForm.value.telefono_contacto,
        instrucciones: this.checkoutForm.value.instrucciones || '',
        metodo_pago: this.checkoutForm.value.metodo_pago,
        tipo_entrega: this.checkoutForm.value.tipo_entrega,
        total: this.calcularTotal(),
        productos: this.items.map(item => ({  // Cambiamos 'items' por 'productos'
          id_producto: parseInt(item.id_producto),
          cantidad: item.cantidad,
          precio: parseFloat(item.precio)
        }))
      };

      console.log('Datos del pedido:', pedidoData);

      this.clienteService.realizarPedido(pedidoData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.cartService.clearCart();
          this.router.navigate(['/cliente/pedidos']);
          this.snackBar.open('Pedido realizado con éxito', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error detallado:', error.error);
          this.snackBar.open(
            error.error?.message || 'Error al procesar el pedido', 
            'Cerrar', 
            { duration: 3000 }
          );
        }
      });
    }
}
}