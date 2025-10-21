import { apiService } from './api';

export const categoryService = {
  // Obtener todas las categorías
  async getCategories() {
    const response = await apiService.request('/api/categories');
    
    if (Array.isArray(response)) {
      return { categories: response };
    } else if (response && response.categories) {
      return { categories: response.categories };
    } else if (response && response.data) {
      return { categories: response.data };
    } else {
      return { categories: [] };
    }
  },

  // Crear categoría (admin)
  async createCategory(categoryData) {
    return apiService.authenticatedRequest('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ AGREGAR ESTO
      },
      body: JSON.stringify(categoryData),
    });
  },

  // Actualizar categoría (admin)
  async updateCategory(categoryId, categoryData) {
    return apiService.authenticatedRequest(`/api/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // ✅ AGREGAR ESTO
      },
      body: JSON.stringify(categoryData),
    });
  },

  // Eliminar categoría (admin)
  async deleteCategory(categoryId) {
    return apiService.authenticatedRequest(`/api/admin/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }
};