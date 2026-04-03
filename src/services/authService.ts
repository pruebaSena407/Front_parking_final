import apiRequest from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  id_rol?: string;
  token?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  telefono?: string;
  role?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // El backend no retorna token, generamos uno en cliente
    if (!response.token && response.correo) {
      const token = btoa(`${response.correo}:${Date.now()}`);
      localStorage.setItem('token', token);
      response.token = token;
    }
    
    return response;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        telefono: data.telefono || '',
      }),
    });
    
    // El backend no retorna token, generamos uno en cliente
    if (!response.token && response.correo) {
      const token = btoa(`${response.correo}:${Date.now()}`);
      localStorage.setItem('token', token);
      response.token = token;
    }
    
    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('mockAuth');
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      await apiRequest('/auth/validate', {
        method: 'GET',
      });
      
      return true;
    } catch {
      localStorage.removeItem('token');
      return false;
    }
  }
}

export default new AuthService();
