import { getBackendUrl } from '../utils/backendConfig';

const BASE_URL = getBackendUrl();

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos autenticados
  async authenticatedRequest(endpoint, options = {}) {
    // ✅ SOLUCIÓN DEFINITIVA: Priorizar user_token para endpoints de usuario
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('user_token');
    
    let token;
    let tokenType = '';
    
    // Detectar qué token usar basado en el endpoint
    if (endpoint.startsWith('/api/user/')) {
      // Endpoints de usuario normal → PRIORIDAD user_token
      if (userToken) {
        token = userToken;
        tokenType = 'USER_TOKEN';
      } else if (adminToken) {
        token = adminToken;
        tokenType = 'ADMIN_TOKEN (fallback)';
      }
    } else {
      // Otros endpoints → PRIORIDAD admin_token
      if (adminToken) {
        token = adminToken;
        tokenType = 'ADMIN_TOKEN';
      } else if (userToken) {
        token = userToken;
        tokenType = 'USER_TOKEN (fallback)';
      }
    }
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.request(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
}

export const apiService = new ApiService();