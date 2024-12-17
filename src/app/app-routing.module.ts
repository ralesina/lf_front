import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'comercio',
    component: MainLayoutComponent,
    loadChildren: () => import('./features/comercio/comercio.module').then(m => m.ComercioModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cliente',
    component: MainLayoutComponent,
    loadChildren: () => import('./features/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }