import { getBackendUrl } from '../utils/backendConfig';

const API_URL = getBackendUrl();

export const mercadopagoService = {
  async createPayment(amount, orderId, customerEmail, customerName, items) {
    try {
      const FULL_URL = `${API_URL}/api/create-mercadopago-payment`;
      console.log('🔗 Llamando a Mercado Pago endpoint:', FULL_URL);
      console.log('📦 Datos para Mercado Pago:', { amount, orderId, customerEmail, customerName, items });
      
      const response = await fetch(FULL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          order_id: orderId,
          customer_email: customerEmail,
          customer_name: customerName,
          items: items
        }),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta de Mercado Pago:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Mercado Pago service error:', error);
      throw error;
    }
  },

  async verifyPayment(paymentId) {
    try {
      const response = await fetch(`${API_URL}/api/verify-mercadopago-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId
        }),
      });

      if (!response.ok) {
        throw new Error('Error verifying payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
};