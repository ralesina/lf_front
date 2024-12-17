import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComercioGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const rol = this.authService.getCurrentUserRole();
    if (rol !== 'comercio') {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}