// =====================================================================
// SERVICIO DE AUTENTICACIÓN (authService.ts)
// ---------------------------------------------------------------------
// Este archivo agrupa todas las funciones del front relacionadas con
// autenticación: login, registro, logout y validación de token.
//
// Internamente todas usan apiRequest (de api.ts) para hablar con el
// backend en /api/auth/*
// =====================================================================

import apiRequest from './api';

// Datos que mandamos al hacer login
export interface LoginRequest {
  email: string;
  password: string;
}

// Cómo luce la respuesta que devuelve el backend en login/registro
export interface LoginResponse {
  /** El backend envía id_usuario; el front expone también id para la UI */
  id?: string;
  /** Puede ser número si la BD usa INTEGER */
  id_usuario?: string | number;
  correo: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  id_rol?: string;
  token?: string;
}

// Datos que mandamos al registrarnos
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  telefono?: string;
  role?: string;
}

// Usamos una CLASE para agrupar todas las funciones relacionadas
class AuthService {
  // ---- LOGIN ----------------------------------------------------------
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // POST a /api/auth/signin con email y password en el body
    const response = await apiRequest<LoginResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Si el backend no nos manda token (por algún motivo), generamos
    // uno simple del lado del cliente. (Solo para que la sesión funcione
    // en local; en producción el backend debería devolver siempre un JWT.)
    if (!response.token && response.correo) {
      const token = btoa(`${response.correo}:${Date.now()}`);
      localStorage.setItem('token', token);
      response.token = token;
    }

    // Normalizamos el id: el backend puede mandar id_usuario o id, pero
    // dentro de la app preferimos un solo nombre.
    const id = String(response.id_usuario ?? response.id ?? '');
    return { ...response, id };
  }

  // ---- REGISTRO --------------------------------------------------------
  async register(data: RegisterRequest): Promise<LoginResponse> {
    // POST a /api/auth/signup con los datos del nuevo usuario
    const response = await apiRequest<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        telefono: data.telefono || '',
      }),
    });
    
    // Mismo "respaldo" que en login: si no llega token, generamos uno.
    if (!response.token && response.correo) {
      const token = btoa(`${response.correo}:${Date.now()}`);
      localStorage.setItem('token', token);
      response.token = token;
    }

    const id = String(response.id_usuario ?? response.id ?? '');
    return { ...response, id };
  }

  // ---- LOGOUT ----------------------------------------------------------
  // No llama al backend, simplemente borra las claves de localStorage.
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('mockAuth');
  }

  // ---- VALIDAR TOKEN ---------------------------------------------------
  // Le pregunta al backend si el token actual sigue siendo válido.
  // Devuelve true si todo está bien, false si está vencido/no existe.
  async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;  // sin token, claramente no hay sesión
      
      // El header Authorization lo agrega automáticamente apiRequest
      await apiRequest('/auth/validate', {
        method: 'GET',
      });
      
      return true;
    } catch {
      // Si el backend dice 401 u otro error, borramos el token roto
      localStorage.removeItem('token');
      return false;
    }
  }
}

// Exportamos UNA instancia (singleton). Así toda la app comparte el mismo objeto.
export default new AuthService();
