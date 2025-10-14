import { apiService } from './api';

export const categoryService = {
  // Obtener todas las categorías
  async getCategories() {
    return apiService.request('/api/categories');
  },

  // Crear categoría (admin)
  async createCategory(categoryData) {
    return apiService.authenticatedRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }
};