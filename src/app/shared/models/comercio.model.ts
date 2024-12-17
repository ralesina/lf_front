export interface Comercio {
    id_comercio: number;
    nombre: string;
    direccion: string;
    latitud: number;
    longitud: number;
    radio_cercania: number;
    telefono?: string;
    email?: string;
    categoria?: string;
    estado?: string;
    distancia?: number;
}
export interface ComercioResponse {
  success: boolean;
  data: Comercio[];
  message?: string;
}