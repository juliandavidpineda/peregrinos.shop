import { apiService } from './api';

export const authService = {
  // Login de administrador
  async adminLogin(email, password) {
    try {
         console.log("🔧 INTENTANDO LOGIN:", email);
      const response = await apiService.request('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
       console.log("🔧 RESPUESTA LOGIN:", response);

      if (response.token) {
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user', JSON.stringify(response.admin));
      }

      return response;
    } catch (error) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  },

  // Verificar autenticación
  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('admin_token');
  }
};