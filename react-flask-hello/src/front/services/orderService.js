import { getBackendUrl } from '../utils/backendConfig';

const API_URL = getBackendUrl();

export const orderService = {
  // Crear nueva orden
  createOrder: async (orderData) => {
    try {
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

      console.log('📤 Creando orden con datos:', formattedData);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error creating order');
      }

      const result = await response.json();
      console.log('✅ Orden creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  // Obtener orden por ID
  getOrder: async (orderId) => {
    try {
      console.log(`📥 Obteniendo orden: ${orderId}`);
      console.log(`🔗 URL completa: ${API_URL}/api/orders/${orderId}`);
      
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response ok: ${response.ok}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error fetching order: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos RAW recibidos del backend:', JSON.stringify(data, null, 2));
      
      // 🔍 Verificar estructura de datos
      console.log('🔍 Estructura detectada:');
      console.log('  - Tiene "order"?', !!data.order);
      console.log('  - Tiene "customer_info"?', !!data.customer_info);
      console.log('  - Tiene "items"?', !!data.items);
      
      if (data.order) {
        console.log('  - order.customer_info?', !!data.order.customer_info);
        console.log('  - order.items?', !!data.order.items);
      }

      // ✅ Normalizar la respuesta
      // Algunos backends devuelven { order: {...} }, otros devuelven directamente {...}
      const normalizedData = data.order ? data : { order: data };
      
      console.log('✅ Datos normalizados:', JSON.stringify(normalizedData, null, 2));
      
      return normalizedData;
    } catch (error) {
      console.error('❌ Error completo al obtener orden:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  },

  // Obtener todas las órdenes (admin)
  getAllOrders: async (token) => {
    try {
      console.log('📥 Obteniendo todas las órdenes');
      
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error obteniendo órdenes:', errorText);
        throw new Error(`Error fetching orders: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Órdenes obtenidas:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId, status, token) => {
    try {
      console.log(`📝 Actualizando orden ${orderId} a estado: ${status}`);
      
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error actualizando estado:', errorText);
        throw new Error(`Error updating order status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Estado actualizado:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }
};