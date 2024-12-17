import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = {
    apiUrl: environment.apiUrl,
   // appUrl: environment.appUrl,
    apiTimeout: 30000,
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'user_data'
  };

  get(key: string): any {
    return this.config[key];
  }
}