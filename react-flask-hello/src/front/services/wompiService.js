// frontend/services/wompiService.js
import { getBackendUrl } from '../utils/backendConfig';

// ✅ USAR getBackendUrl() en lugar de BACKEND_URL
const API_URL = getBackendUrl();

export const wompiService = {
  async createPaymentLink(amount, orderId, customerEmail, customerName) {
    try {
      const FULL_URL = `${API_URL}/api/create-wompi-payment`;
      console.log('🔗 Llamando a Wompi endpoint:', FULL_URL);
      console.log('📦 Datos para Wompi:', { amount, orderId, customerEmail, customerName });
      
      const response = await fetch(FULL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          order_id: orderId,
          customer_email: customerEmail,
          customer_name: customerName
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta de Wompi:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Wompi service error:', error);
      throw error;
    }
  },

  async verifyPayment(transactionId) {
    try {
      const response = await fetch(`${API_URL}/api/verify-wompi-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId
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