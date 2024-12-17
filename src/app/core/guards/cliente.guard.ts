import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const rol = this.authService.getCurrentUserRole();
    if (rol !== 'cliente') {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}