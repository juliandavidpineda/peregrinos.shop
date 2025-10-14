import { apiService } from './api';

export const productService = {
  // Obtener todos los productos
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    
    return apiService.request(endpoint);
  },

  // Obtener producto por ID
  async getProductById(id) {
    return apiService.request(`/api/products/${id}`);
  },

  // Crear producto (admin)
  async createProduct(productData) {
    return apiService.authenticatedRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Actualizar producto (admin)
  async updateProduct(id, productData) {
    return apiService.authenticatedRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Eliminar producto (admin)
  async deleteProduct(id) {
    return apiService.authenticatedRequest(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }
};