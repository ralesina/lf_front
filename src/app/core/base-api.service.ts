import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected apiUrl: string;
  protected timeout: number;

  constructor(
    protected http: HttpClient,
    protected config: ConfigService
  ) {
    this.apiUrl = this.config.get('apiUrl');
    this.timeout = this.config.get('apiTimeout');
  }

  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      'Origin': 'http://localhost:4200', // Asegurar el origen correcto
    });

    return headers;
  }

  protected get<T>(endpoint: string, params?: any): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: params || {} })
    };

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(
        timeout(this.timeout),
        catchError(this.handleError)
      );
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      timeout(this.timeout),
      catchError(this.handleError)
    );
  }

  protected handleError(error: any) {
    console.error('Api Error:', error);
    return throwError(() => error);
  }
}