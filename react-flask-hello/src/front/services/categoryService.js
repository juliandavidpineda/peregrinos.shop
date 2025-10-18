import { apiService } from './api';

export const categoryService = {
  // Obtener todas las categorías
  async getCategories() {
    const response = await apiService.request('/api/categories');
    
    // ✅ DEBUG: Ver la estructura real de la respuesta
    console.log('🔍 Raw categories API response:', response);
    
    // ✅ Manejar diferentes estructuras de respuesta
    if (Array.isArray(response)) {
      return { categories: response };
    } else if (response && response.categories) {
      return { categories: response.categories };
    } else if (response && response.data) {
      return { categories: response.data };
    } else {
      // ✅ Fallback seguro
      console.warn('⚠️ Unexpected categories response structure:', response);
      return { categories: [] };
    }
  },

  // Crear categoría (admin)
  async createCategory(categoryData) {
    return apiService.authenticatedRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }
};