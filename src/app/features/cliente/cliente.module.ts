import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { ClienteRoutingModule } from './cliente-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { HomeClienteComponent } from './components/home.component';
import { BuscarComerciosComponent } from './components/buscar-comercios.component';
import { ComerciosCercanosComponent } from './components/comercios-cercanos.component';
import { CheckoutComponent } from './components/checkout.component';
import { HistorialPedidosComponent } from './components/historial-pedidos.component';
import { VerComercioComponent } from './components/ver-comercio.component';

@NgModule({
  declarations: [
    HomeClienteComponent,
    BuscarComerciosComponent,
    ComerciosCercanosComponent,
    CheckoutComponent,
    HistorialPedidosComponent,
    VerComercioComponent
  ],
  imports: [
    SharedModule,
    MatStepperModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    ClienteRoutingModule
  ]
})
export class ClienteModule { }