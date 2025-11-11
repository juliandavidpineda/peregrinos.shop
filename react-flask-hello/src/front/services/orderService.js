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


// Obtener orden por ID - SOLUCIÓN DEFINITIVA
getOrder: async (orderId) => {
  try {
    console.log(`📥 Obteniendo orden: ${orderId}`);
    
    // ✅ VOLVER al endpoint original que SÍ funciona
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching order: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ AGREGAR campos de pago si no vienen (para compatibilidad)
    const normalizedData = data.order ? data : { order: data };
    
    // Asegurar que existan los campos que el polling necesita
    if (normalizedData.order) {
      normalizedData.order.payment_status = normalizedData.order.payment_status || 'pending';
      normalizedData.order.payment_id = normalizedData.order.payment_id || null;
      normalizedData.order.payment_method = normalizedData.order.payment_method || null;
    }

    console.log('✅ Orden con campos de pago:', normalizedData);
    return normalizedData;
    
  } catch (error) {
    console.error('❌ Error obteniendo orden:', error);
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