// =====================================================================
// SERVICIO DE AUTENTICACIÓN (authService.ts)
// ---------------------------------------------------------------------
// Este archivo agrupa todas las funciones del front relacionadas con
// autenticación: login, registro, logout y validación de token.
//
// Internamente todas usan apiRequest (de api.ts) para hablar con el
// backend en /api/auth/*
// =====================================================================

import apiRequest, { ApiError } from './api';

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
    
    // Guardamos SIEMPRE el JWT que devuelve el backend para enviarlo en
    // las siguientes peticiones (Authorization: Bearer). Si por algún
    // motivo no llega token, generamos uno legacy como respaldo local.
    if (response.token) {
      localStorage.setItem('token', response.token);
    } else if (response.correo) {
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
    
    // Igual que en login: guardamos siempre el JWT real; respaldo si falta.
    if (response.token) {
      localStorage.setItem('token', response.token);
    } else if (response.correo) {
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

  // ---- RECUPERAR CONTRASEÑA -------------------------------------------
  // Solicita el token de recuperación. En el MVP el backend lo devuelve
  // en la respuesta (sin servicio de email).
  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return apiRequest<{ message: string; resetToken?: string }>('/auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Establece una nueva contraseña usando el token de recuperación.
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // ---- VALIDAR TOKEN ---------------------------------------------------
  // Pregunta al backend si el token sigue siendo válido. Devuelve:
  //   - el usuario        → token válido (repoblar sesión)
  //   - null              → token RECHAZADO por el servidor (401): cerrar sesión
  //   - undefined         → no se pudo validar (red caída, petición cancelada,
  //                         error 5xx…): NO concluir que la sesión es inválida,
  //                         para no expulsar al usuario por un fallo transitorio.
  async validateToken(): Promise<LoginResponse | null | undefined> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await apiRequest<LoginResponse>('/auth/validate', {
        method: 'GET',
      });
      const id = String(response.id_usuario ?? response.id ?? '');
      return { ...response, id };
    } catch (e) {
      // Sólo borramos el token si el servidor dijo explícitamente 401.
      if (e instanceof ApiError && e.status === 401) {
        localStorage.removeItem('token');
        return null;
      }
      // Error transitorio (red/cancelación/5xx): mantenemos la sesión.
      return undefined;
    }
  }
}

// Exportamos UNA instancia (singleton). Así toda la app comparte el mismo objeto.
export default new AuthService();
