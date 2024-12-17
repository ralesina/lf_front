export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: 'comercio' | 'cliente' | 'admin';
  status: 'active' | 'inactive' | 'blocked';
}

export interface AuthResponse {
  success: boolean;
  data: {
    data: {
      user: {
        id_usuario: number;
        nombre: string;
        email: string;
        rol: 'comercio' | 'cliente' | 'admin';
        status: 'active' | 'inactive' | 'blocked';
      };
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    message: string;
    success: boolean;
  }
  
}
export interface PerfilResponse {
  success: boolean;
  data: {
    success: boolean;
    data: {
      id_usuario: string;
      nombre: string;
      email: string;
      rol: string;
      direccion: string;
      telefono: string | null;
      latitud: string;
      longitud: string;
      radio_cercania: string;
    }
  }
}