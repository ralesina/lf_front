import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  template: `
    <mat-toolbar color="primary">
      <span class="brand" (click)="navigateHome()">LocalFresh</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.currentUser$ | async as user">
        <button mat-button [matMenuTriggerFor]="menu">
          {{user.nombre}}
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
         <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="perfil()">
             <mat-icon>person</mat-icon>
             <span>Mi Perfil</span>
         </button>
        <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar {
      background-color: var(--color-dark-brown);
      color: var(--color-light-yellow);
    }
    .brand {
      cursor: pointer;
    }
    .brand:hover {
      opacity: 0.8;
    }
  `]
})
export class NavBarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navigateHome() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        if (user.rol === 'comercio') {
          this.router.navigate(['/comercio/dashboard']);
        } else {
          this.router.navigate(['/cliente/home']);
        }
      }
    }).unsubscribe(); // Importante desuscribirse para evitar memory leaks
  }
  perfil() {
    this.router.navigate(['/auth/perfil']);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}