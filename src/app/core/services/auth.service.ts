import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario, AuthResponse } from '../../shared/models/usuario.model';
import { Comercio } from '@shared/models/comercio.model';
interface PerfilResponse {
  success: boolean;
  data: Usuario | (Usuario & Comercio);
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = environment.apiUrl;
  private currentComercioSubject = new BehaviorSubject<number | null>(null);
  currentComercio$ = this.currentComercioSubject.asObservable();
  constructor(private http: HttpClient) {
      this.checkToken();
      this.checkStoredData();

  }

  private checkToken() {
      const userData = localStorage.getItem('user');
      if (userData) {
          const user = JSON.parse(userData) as Usuario;
          this.currentUserSubject.next(user);
      }
  }
  login(credentials: {email: string; password: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data.data) { // Notar el data.data
            localStorage.setItem('access_token', response.data.data.access_token);
            localStorage.setItem('refresh_token', response.data.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            this.currentUserSubject.next(response.data.data.user);
          }
        })
      );
  }
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setSession(response.data);
          this.currentUserSubject.next(response.data.data.user);
        })
      );
  }
  private checkStoredData() {
    const user = this.getUserFromStorage();
    if (user?.comercio_id) {
      this.currentComercioSubject.next(user.comercio_id);
    }
  }

  getCurrentComercioId(): number | null {
    const user = this.getUserFromStorage();
    return user?.comercio_id || null;
  }

  private getUserFromStorage() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  getCurrentUserRole(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).rol;
    }
    return null;
  }
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('refresh_token', authResult.refresh_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    
    const expiresAt = new Date().getTime() + authResult.expires_in * 1000;
    localStorage.setItem('expires_at', expiresAt.toString());
  }

  isLoggedIn(): boolean {
    const expiration = localStorage.getItem('expires_at');
    if (!expiration) return false;
    return new Date().getTime() < parseInt(expiration);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap(response => this.setSession(response.data))
      );
  }
  getPerfil(): Observable<any> {
    return this.http.get(`${this.API_URL}/perfil`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }
  
  editarPerfil(perfilData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/perfil`, perfilData, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }
  
  updateStoredUserData(userData: any): void {
    const currentUser = this.getUserFromStorage();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
}