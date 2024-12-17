import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comercio, ComercioResponse } from '@shared/models/comercio.model';
import { Pedido, PedidoResponse } from '@shared/models/pedido.model';
import { Producto } from '@shared/models/producto.model';

export interface SearchResponse {
  items: Comercio[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchParams {
  search: string;
  category: string;
  page: number;
  pageSize: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseApiService {

  realizarPedido(pedidoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/pedido`, pedidoData); 
}
getHistorialPedidos(): Observable<any[]> {
  return this.http.get<any>(`${this.apiUrl}/clientes/pedidos/historial`).pipe(
    map(response => response.success ? response.data || [] : []),
    catchError(err => {
      console.error('Error fetching historial pedidos:', err);
      return throwError(() => new Error('Error al obtener el historial de pedidos'));
    })
  );
}
  consultarPedidos(idCliente: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/clientes/pedidos/${idCliente}`);
  }
  getPedidoDetalle(idPedido: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/pedido/${idPedido}`).pipe(
      map(response => {
        return {
          success: response.success,
          data: response.data?.detalles || []
        };
      }),
      catchError(err => {
        console.error('Error al obtener detalles:', err);
        return throwError(() => new Error('Error al obtener detalles del pedido.'));
      })
    );
  }
  getComercio(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/comercios/${id}`);
  }

  getProductosComercio(comercioId: string): Observable<Producto[]> {
    console.log('Requesting products for comercio:', comercioId);
    
    return this.http.get<any>(`${this.apiUrl}/clientes/comercios/${comercioId}/productos`)
      .pipe(
        map(response => {
          return response.data.data || []
        })
      );
  }

  getComerciosDestacados(): Observable<ComercioResponse> {
    return this.http.get<ComercioResponse>(`${environment.apiUrl}/clientes/comercios/destacados`);
  }
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/clientes/categorias`);
  }
  getPedidosActivos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/pedidos/activos`).pipe(
      map(response => response.success ? response.data || [] : []),
      catchError(err => {
        console.error('Error fetching historial pedidos:', err);
        return throwError(() => new Error('Error al obtener el historial de pedidos'));
      })
    );
  }
  buscarComercios(params: {
    search: string;
    category: string;
    page: number;
    pageSize: number;
  }): Observable<SearchResponse> {
    const httpParams = new HttpParams()
      .set('q', params.search)
      .set('categoria', params.category)
      .set('page', params.page.toString())
      .set('limit', params.pageSize.toString());

    return this.http.get<SearchResponse>(`${environment.apiUrl}/clientes/comercios/buscar`, { params: httpParams });
  }
  buscarComerciosCercanos(
    latitud: number,
    longitud: number,
    radio: number
  ): Observable<Comercio[]> {
    const params = new HttpParams()
      .set('latitud', latitud.toString())
      .set('longitud', longitud.toString())
      .set('radio', radio.toString());
  
    return this.http.get<Comercio[]>(
      `${environment.apiUrl}/clientes/comercios/cercanos`, 
      { 
        params,
        headers: this.getHeaders() 
      }
    );
  }
  cancelarPedido(idPedido: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/clientes/pedido/cancelar/${idPedido}`, {});
  }


}