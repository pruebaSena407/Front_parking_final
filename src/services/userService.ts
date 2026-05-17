import apiRequest from './api';

export type UserRole = 'admin' | 'empleado' | 'cliente';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  phone?: string;
}

class UserService {
  async getUsers(): Promise<User[]> {
    return apiRequest<User[]>('/users/', { method: 'GET' });
  }

  async getUser(id: string): Promise<User> {
    return apiRequest<User>(`/users/${id}`, { method: 'GET' });
  }

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/users/profile', { method: 'GET' });
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<User> {
    return apiRequest<User>('/users/', {
      method: 'POST',
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role ?? 'empleado',
        phone: data.phone ?? '',
      }),
    });
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await apiRequest(`/users/${id}`, { method: 'DELETE' });
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    return apiRequest<User>(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export default new UserService();
