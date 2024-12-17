import { Pedido } from "@shared/models/pedido.model";
import { Producto } from "@shared/models/producto.model";

export class DataTransformers {
    static transformPedido(data: any): Pedido {
        return {
            ...data,
            fecha_pedido: new Date(data.fecha_pedido),
            total: parseFloat(data.total),
            detalles: data.detalles?.map(detalle => ({
                ...detalle,
                precio_unitario: parseFloat(detalle.precio_unitario),
                subtotal: parseFloat(detalle.subtotal)
            }))
        };
    }

    static transformProducto(data: any): Producto {
        return {
            ...data,
            precio: parseFloat(data.precio),
            fecha_creacion: new Date(data.fecha_creacion),
            stock: parseInt(data.stock, 10)
        };
    }
}