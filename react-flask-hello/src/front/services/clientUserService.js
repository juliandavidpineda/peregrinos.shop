import { apiService } from './api';

export const clientUserService = {
  /**
   * Obtener lista de usuarios clientes con filtros
   */
  async getClientUsers(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status !== 'all') queryParams.append('is_active', filters.status === 'active');
    if (filters.terms_accepted !== 'all') {
      queryParams.append('terms_accepted', filters.terms_accepted === 'accepted');
    }
    if (filters.marketing_emails !== 'all') {
      queryParams.append('marketing_emails', filters.marketing_emails === 'accepted');
    }

    // ✅ CAMBIAR: usar authenticatedRequest en lugar de request
    const response = await apiService.authenticatedRequest(`/api/admin/client-users?${queryParams}`);
    return response;
  },

  /**
   * Actualizar un usuario cliente
   */
  async updateClientUser(userId, userData) {
    // ✅ CAMBIAR: usar authenticatedRequest
    const response = await apiService.authenticatedRequest(`/api/admin/client-users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  },

  /**
   * Obtener pedidos de un usuario cliente
   */
  async getClientUserOrders(userId) {
    // ✅ CAMBIAR: usar authenticatedRequest
    const response = await apiService.authenticatedRequest(`/api/admin/client-users/${userId}/orders`);
    return response;
  },

  /**
   * Obtener estadísticas de usuarios clientes
   */
  async getClientUsersStats() {
    // ✅ CAMBIAR: usar authenticatedRequest
    const response = await apiService.authenticatedRequest('/api/admin/client-users/stats');
    return response;
  }
};