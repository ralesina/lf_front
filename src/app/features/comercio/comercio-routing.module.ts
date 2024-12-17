import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComercioComponent } from './components/dashboard.component';
import { EditarInventarioComponent } from './components/editar-inventario.component';
import { AgregarProductoComponent } from './components/agregar-producto.component';
import { GestionPedidosComponent } from './components/gestion-pedidos.component';
import { ComercioGuard } from '@core/guards/comercio.guard';
import { ListarProductosComponent } from './components/listar-productos.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComercioComponent, canActivate: [ComercioGuard] },
  { path: 'inventario', component: EditarInventarioComponent, canActivate: [ComercioGuard] },
  { path: 'productos', component: ListarProductosComponent, canActivate: [ComercioGuard] },
  { path: 'productos/nuevo', component: AgregarProductoComponent, canActivate: [ComercioGuard] },
  { path: 'pedidos', component: GestionPedidosComponent, canActivate: [ComercioGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComercioRoutingModule { }