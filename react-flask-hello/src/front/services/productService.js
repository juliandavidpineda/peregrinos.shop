// Usar la misma configuración que api.js
import { getBackendUrl } from '../utils/backendConfig';

const API_BASE_URL = getBackendUrl();

export const productService = {
  // Obtener productos más vendidos
  async getTopSellingProducts(limit = 4) {
    const response = await fetch(`${API_BASE_URL}/api/products/top-selling?limit=${limit}`);
    if (!response.ok) throw new Error('Error fetching top products');
    return await response.json();
  },
  
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
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Error fetching products');
    return await response.json();
  },

  // Obtener producto por ID
  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) throw new Error('Error fetching product');
    return await response.json();
  },

  // Crear producto (admin) - SIN parámetro token
  async createProduct(productData) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    console.log('🆕 Creating product with data:', productData);

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Create error:', errorText);
      throw new Error(errorText || 'Error creating product');
    }

    return await response.json();
  },

  // Actualizar producto (admin) - SIN parámetro token
  async updateProduct(id, productData) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    console.log('🔄 Updating product:', { id, productData });

    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Update error:', errorText);
      throw new Error(errorText || 'Error updating product');
    }

    return await response.json();
  },

  // Eliminar producto (admin) - SIN parámetro token
  async deleteProduct(id) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error deleting product');
    }

    if (response.status === 204) {
      return { message: 'Product deleted successfully' };
    }

    return await response.json();
  }
};

// =============================================================================
// SISTEMA DE UPLOAD DE ARCHIVOS - NUEVO
// =============================================================================

export const mediaService = {
  // Subir archivos (imágenes o videos)
  async uploadMedia(productId, files) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/upload/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error uploading files');
    }

    return await response.json();
  },

  // Eliminar archivo
  async deleteMedia(productId, filePath, fileType) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/api/admin/upload/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        file_path: filePath,
        type: fileType // 'image' o 'video'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error deleting file');
    }

    return await response.json();
  },

  // Reordenar archivos
  async reorderMedia(productId, mediaType, newOrder) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/api/admin/upload/${productId}/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: mediaType, // 'images' o 'videos'
        order: newOrder
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error reordering files');
    }

    return await response.json();
  }
};