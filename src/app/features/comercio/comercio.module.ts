import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ComercioRoutingModule } from './comercio-routing.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComercioComponent } from './components/dashboard.component';
import { EditarInventarioComponent } from './components/editar-inventario.component';
import { AgregarProductoComponent } from './components/agregar-producto.component';
import { EditarProductoDialogComponent } from './components/editar-producto-dialog.component';
import { ListarProductosComponent } from './components/listar-productos.component';
import { GestionPedidosComponent, PedidoCardComponent } from './components/gestion-pedidos.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [
    DashboardComercioComponent,
    EditarInventarioComponent,
    AgregarProductoComponent,
    GestionPedidosComponent,
    PedidoCardComponent,
    EditarProductoDialogComponent,
    ListarProductosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ComercioRoutingModule,
    MatGridListModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule
  ],
  exports: []
})
export class ComercioModule { }