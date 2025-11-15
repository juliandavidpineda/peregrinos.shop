import { getBackendUrl } from '../utils/backendConfig';

const API_URL = getBackendUrl();

export const searchService = {
  /**
   * Búsqueda inteligente de productos con sugerencias
   */
  async searchProducts(searchTerm, limit = 10) {
    try {
      if (!searchTerm.trim()) {
        return { success: true, products: [], saints: [], suggestions: [], total: 0 };
      }

      const response = await fetch(
        `${API_URL}/api/products/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Error en búsqueda: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error searching products:', error);
      return { 
        success: false, 
        error: error.message,
        products: [],
        saints: [], 
        suggestions: [], 
        total: 0 
      };
    }
  },

  /**
   * Búsqueda rápida para sugerencias (más ligera)
   */
  async quickSearch(searchTerm) {
    return this.searchProducts(searchTerm, 5); // Menos resultados para sugerencias
  }
};