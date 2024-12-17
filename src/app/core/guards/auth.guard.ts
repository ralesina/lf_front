import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}