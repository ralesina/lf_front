export type EstadoPedido = 'pendiente' | 'confirmado' | 'en_preparacion' | 'en_camino' | 'entregado' | 'cancelado';
export type MetodoPago = 'efectivo' | 'tarjeta';

export interface DetallePedido {
  id_detalle?: number;
  id_pedido?: number;
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  id_comercio: number;
  direccion_entrega: string;
  telefono_contacto: string;
  total: number;
  estado: EstadoPedido;
  fecha_pedido: Date;
  instrucciones?: string;
  metodo_pago: MetodoPago;
  cliente_nombre?: string;
  cliente_email?: string;
  comercio_nombre?: string;
  detalles?: DetallePedido[];
}

export interface PedidoResponse {
  success: boolean;
  data: Pedido[];
  message?: string;
}

export interface PedidoRequest {
    direccion_entrega: string;
    telefono_contacto: string;
    instrucciones?: string;
    metodo_pago: MetodoPago;
    items: {
        id_producto: number;
        cantidad: number;
    }[];
}
