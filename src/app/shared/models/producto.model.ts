export interface Producto {
  id_producto: string;
  id_comercio: string;
  nombre_producto: string;
  descripcion: string | null;
  imagen_url: string | null;
  estado: 'activo' | 'inactivo';
  precio: string;
  fecha_creacion: string;
  id_categoria: string;
  stock: string;
  nombre_categoria: string;
}
export interface Categoria {
  id: number;
  nombre_categoria: string;
}
export interface ProductoResponse {
  success: boolean;
  data: {
    success: boolean;
    data: Producto[];
  };
}
export interface CategoriaResponse {
  success: boolean;
  data: {
    success: boolean;
    data: Categoria[];
  };
}