// Usar la misma configuración que api.js
import { getBackendUrl } from '../utils/backendConfig';
import { apiService } from './api'; // ✅ IMPORTAR apiService

const API_BASE_URL = getBackendUrl();

export const reviewService = {
  // Obtener reseñas de un producto (público) - ESTOS SÍ pueden usar fetch directo
  async getProductReviews(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`);
      
      if (!response.ok) {
        throw new Error('Error fetching product reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },

  // Crear nueva reseña - ESTE SÍ puede usar fetch directo
  async createReview(productId, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Error creating review');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Obtener reviews para moderación (admin) - ✅ USAR authenticatedRequest
  async getAdminReviews(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.per_page) queryParams.append('per_page', filters.per_page);
      
      const url = `/api/admin/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // ✅ USAR apiService.authenticatedRequest para endpoints protegidos
      const response = await apiService.authenticatedRequest(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error fetching admin reviews:', error);
      throw error;
    }
  },

  // Aprobar/rechazar review - ✅ USAR authenticatedRequest
  async moderateReview(reviewId, approved) {
    try {
      const response = await apiService.authenticatedRequest(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_approved: approved }),
      });

      return response;
    } catch (error) {
      console.error('Error moderating review:', error);
      throw error;
    }
  },

  // Eliminar review (solo content_manager+) - ✅ USAR authenticatedRequest
  async deleteReview(reviewId) {
    try {
      const response = await apiService.authenticatedRequest(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Obtener métricas de reviews - ✅ USAR authenticatedRequest
  async getReviewAnalytics() {
    try {
      const reviews = await this.getAdminReviews({ status: 'all', per_page: 1000 });
      
      const analytics = {
        total: reviews.total,
        pending: reviews.reviews.filter(r => !r.is_approved).length,
        approved: reviews.reviews.filter(r => r.is_approved).length,
        averageRating: 0
      };
      
      if (reviews.reviews.length > 0) {
        const approvedReviews = reviews.reviews.filter(r => r.is_approved);
        if (approvedReviews.length > 0) {
          analytics.averageRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
        }
      }
      
      return analytics;
    } catch (error) {
      console.error('Error fetching review analytics:', error);
      throw error;
    }
  }
};