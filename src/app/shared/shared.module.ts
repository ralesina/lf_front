import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NavBarComponent } from './components/nav-bar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { PerfilComponent } from './components/perfil.component';
import { FooterComponent } from './components/footer.component';

@NgModule({
  declarations: [
    NavBarComponent,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    PerfilComponent,
    FooterComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    NavBarComponent,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    PerfilComponent,
    FooterComponent
  ]
})
export class SharedModule { }