import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl + '/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, folder: string): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    return this.http.post<{url: string}>(`${this.apiUrl}/image`, formData);
  }

  deleteImage(imageUrl: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/image`, { 
      params: { url: imageUrl }
    });
  }
}