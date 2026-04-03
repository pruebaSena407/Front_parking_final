import apiRequest from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'empleado' | 'cliente';
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

class UserService {
  async getUsers(): Promise<User[]> {
    return apiRequest<User[]>('/users', {
      method: 'GET',
    });
  }

  async getUser(id: string): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: 'GET',
    });
  }

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/users/profile', {
      method: 'GET',
    });
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(id: string, role: 'admin' | 'empleado' | 'cliente'): Promise<User> {
    return apiRequest<User>(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export default new UserService();
