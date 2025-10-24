import { getBackendUrl } from '../utils/backendConfig';

const API_URL = getBackendUrl();

export const orderService = {
  // Crear nueva orden
  createOrder: async (orderData) => {
    try {
        // ✅ FORMATO CORRECTO para el backend
      const formattedData = {
        customer_info: {
          name: orderData.customer_name,
          email: orderData.customer_email,
          phone: orderData.customer_phone,
          address: orderData.customer_address,
          city: orderData.customer_city,
          department: orderData.customer_department,
          postal_code: orderData.customer_postal_code
        },
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total
      };

      console.log('Datos formateados para orden:', formattedData);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Obtener orden por ID
  getOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Error fetching order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Obtener todas las órdenes (admin)
  getAllOrders: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId, status, token) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Error updating order status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};