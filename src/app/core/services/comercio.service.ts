import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { Comercio } from '@shared/models/comercio.model';
import { Producto, Categoria, CategoriaResponse } from '@shared/models/producto.model';
import { Pedido, PedidoResponse, EstadoPedido } from '@shared/models/pedido.model';
import { BaseApiService } from '../base-api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComercioService extends BaseApiService {
  protected apiUrl = environment.apiUrl + '/comercios';
  authService: any;

  private mapEstadoToBackend(estado: string): EstadoPedido {
    const mapeo: { [key: string]: EstadoPedido } = {
      'pendiente': 'pendiente',
      'preparando': 'en_preparacion',
      'enviado': 'en_camino',
      'completado': 'entregado'
    };
    return mapeo[estado] || 'pendiente';
  }

  private mapEstadoToFrontend(estado: EstadoPedido): string {
    const mapeo: { [key in EstadoPedido]: string } = {
      'pendiente': 'pendiente',
      'confirmado': 'pendiente',
      'en_preparacion': 'preparando',
      'en_camino': 'enviado',
      'entregado': 'completado',
      'cancelado': 'cancelado'
    };
    return mapeo[estado];
  }

  getComercio(): Observable<Comercio> {
    return this.http.get<Comercio>(`${this.apiUrl}/perfil`);
  }

  getPedidos(estado?: string): Observable<Pedido[]> {
    let params = new HttpParams();
    let url = `${this.apiUrl}/pedidos`;
    if (estado) {
      url += `/${this.mapEstadoToBackend(estado)}`;
    }
    return this.http.get<PedidoResponse>(url).pipe(
      map(response => {
        if (!response.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data;
      }),
        catchError(error => {
          console.error('Error al obtener pedidos:', error);
          return throwError(() => error);
        })
      );
  }

  getPedidosPorEstado(estado: string): Observable<Pedido[]> {
    return this.getPedidos(estado);
  }
  

  actualizarEstadoPedido(idPedido: number, estadoFrontend: string): Observable<PedidoResponse> {
    const estadoBackend = this.mapEstadoToBackend(estadoFrontend);
    return this.http.put<PedidoResponse>(
      `${this.apiUrl}/pedidos/${idPedido}/estado`, 
      { estado: estadoBackend }
    ).pipe(
      catchError(error => {
        console.error('Error al actualizar estado del pedido:', error);
        return throwError(() => error);
      })
    );
  }

  // Resto de métodos existentes sin cambios
  agregarProducto(data: any, file: File | null): Observable<any> {
    const formData = new FormData();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData?.id_usuario;    
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    
    formData.append('id_usuario', userId.toString());
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    if (file) {
      formData.append('imagen', file);
    }
    
    return this.http.post<any>(`${this.apiUrl}/comercios/productos`, formData)
      .pipe(
        catchError(error => {
          console.error('Error al agregar producto:', error);
          return throwError(() => error);
        })
      );
  }

  editarInventario(idProducto: number, stock: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/comercios/inventario/${idProducto}`, { 
      stock: stock 
    }).pipe(
      catchError(error => {
        console.error('Error al actualizar inventario:', error);
        return throwError(() => error);
      })
    );
  }
  getCountProductos(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/comercios/productos`).pipe(
      map(response => {
        if (!response?.data?.data || !Array.isArray(response.data.data)) {
          return 0;
        }
        return response.data.data.length;
      })
    );
  }
  getCountPedidosActivos(): Observable<number> {
    return this.http.get<PedidoResponse>(`${this.apiUrl}/pedidos/activos`).pipe(
      map(response => {
        if (!response?.success || !Array.isArray(response?.data)) {
          return 0;
        }
        return response.data.length;
      })
    );
  }
  getProductos(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/comercios/productos`)
      .pipe(
        map(response => response.data.data),
        catchError(error => {
          console.error('Error al obtener productos:', error);
          return throwError(() => error);
        })
      );
  }
  getCountPedidosHoy(): Observable<number> {
    return this.http.get<PedidoResponse>(`${this.apiUrl}/pedidos`).pipe(
      map(response => {
        if (!response?.success || !Array.isArray(response?.data)) {
          return 0;
        }
        // Filtramos los pedidos de hoy
        const hoy = new Date();
        return response.data.filter(pedido => {
          const fechaPedido = new Date(pedido.fecha_pedido);
          return fechaPedido.toDateString() === hoy.toDateString();
        }).length;
      })
    );
  }
  getCategorias(): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.apiUrl}/categorias`);
  }

  editarProducto(idProducto: number, formData: FormData): Observable<any> {
    
    return this.http.post(
      `${this.apiUrl}/comercios/productos/${idProducto}`, 
      formData
    ).pipe(
      catchError(error => {
        console.error('Error al editar producto:', error);
        return throwError(() => error);
      })
    );
  }

  desactivarProducto(idProducto: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/comercios/productos/${idProducto}/estado`, {
      estado: 'inactivo'
    });
  }
}