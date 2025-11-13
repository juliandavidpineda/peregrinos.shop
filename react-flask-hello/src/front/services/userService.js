import { apiService } from './api';

export const userService = {
  // Obtener lista de usuarios admin
  async getAdminUsers(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar filtros a los parámetros
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.is_active !== undefined) queryParams.append('is_active', filters.is_active);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.per_page) queryParams.append('per_page', filters.per_page);
      
      const url = `/api/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // ✅ USAR authenticatedRequest SOLO para userService
      const response = await apiService.authenticatedRequest(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
  },

  // Obtener un usuario específico
  async getAdminUser(userId) {
    try {
      const response = await apiService.authenticatedRequest(`/api/admin/users/${userId}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      throw error;
    }
  },

  // Crear nuevo usuario admin
  async createAdminUser(userData) {
    try {
      const response = await apiService.authenticatedRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  },

  // Actualizar usuario admin
  async updateAdminUser(userId, userData) {
    try {
      const response = await apiService.authenticatedRequest(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  },

  // Eliminar usuario admin
  async deleteAdminUser(userId) {
    try {
      const response = await apiService.authenticatedRequest(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      console.error('Error deleting admin user:', error);
      throw error;
    }
  },

  // Activar/desactivar usuario
  async toggleUserStatus(userId) {
    try {
      const response = await apiService.authenticatedRequest(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
      });

      return response;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Obtener logs de actividad
  async getActivityLogs(page = 1, per_page = 20) {
    try {
      const queryParams = new URLSearchParams({ page, per_page });
      const url = `/api/admin/activity-logs?${queryParams.toString()}`;
      
      const response = await apiService.authenticatedRequest(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  },

  // Actualizar perfil propio (sin permisos especiales)
  async updateOwnProfile(userData) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('admin_user'));
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const response = await apiService.authenticatedRequest(`/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      // Actualizar datos en localStorage
      if (response.user) {
        localStorage.setItem('admin_user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Error updating own profile:', error);
      throw error;
    }
  },

  // Cambiar contraseña propia
  async changeOwnPassword(newPassword) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('admin_user'));
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const response = await apiService.authenticatedRequest(`/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          password: newPassword
        }),
      });

      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

   // ✅ NUEVAS FUNCIONES PARA PERFIL DE USUARIO
  async getUserProfile() {
    try {
      const response = await apiService.authenticatedRequest('/api/user/profile');
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userData) {
    try {
      const response = await apiService.authenticatedRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async getUserOrders() {
    try {
      const response = await apiService.authenticatedRequest('/api/user/orders');
      return response;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  async getUserAddresses() {
    try {
      const response = await apiService.authenticatedRequest('/api/user/addresses');
      return response;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  },

  async addUserAddress(addressData) {
    try {
      const response = await apiService.authenticatedRequest('/api/user/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData),
      });
      return response;
    } catch (error) {
      console.error('Error adding user address:', error);
      throw error;
    }
  },

  async updateUserAddress(addressId, addressData) {
    try {
      const response = await apiService.authenticatedRequest(`/api/user/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData),
      });
      return response;
    } catch (error) {
      console.error('Error updating user address:', error);
      throw error;
    }
  },

  async deleteUserAddress(addressId) {
    try {
      const response = await apiService.authenticatedRequest(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting user address:', error);
      throw error;
    }
  }
};