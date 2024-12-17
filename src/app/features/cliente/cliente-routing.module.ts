import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeClienteComponent } from './components/home.component';
import { BuscarComerciosComponent } from './components/buscar-comercios.component';
import { ComerciosCercanosComponent } from './components/comercios-cercanos.component';
import { CheckoutComponent } from './components/checkout.component';
import { HistorialPedidosComponent } from './components/historial-pedidos.component';
import { ClienteGuard } from '@core/guards/cliente.guard';
import { VerComercioComponent } from './components/ver-comercio.component';

const routes: Routes = [
  { path: 'home', component: HomeClienteComponent, canActivate: [ClienteGuard] },
  { path: 'comercios', component: BuscarComerciosComponent, canActivate: [ClienteGuard] },
  { path: 'comercios/cercanos', component: ComerciosCercanosComponent, canActivate: [ClienteGuard] },
  { path: 'comercio/:id', component: VerComercioComponent, canActivate: [ClienteGuard] }, // Nueva ruta
  { path: 'checkout', component: CheckoutComponent, canActivate: [ClienteGuard] },
  { path: 'pedidos', component: HistorialPedidosComponent, canActivate: [ClienteGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }