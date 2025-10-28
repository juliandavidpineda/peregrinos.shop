import { mercadopagoService } from './mercadopagoService';

export const paymentService = {
  async createPayment(amount, orderId, customerEmail, customerName, items) {
    try {
      // Usar Mercado Pago en lugar de Wompi
      const result = await mercadopagoService.createPayment(
        amount, 
        orderId, 
        customerEmail, 
        customerName,
        items
      );

      if (!result.success) {
        throw new Error(result.error || 'Error al crear el pago');
      }

      console.log('🔗 PaymentService - Resultado completo:', result);

      // CORREGIR: Usar sandbox_init_point en lugar de sandbox_url
      return {
        success: true,
        payment_url: result.payment_url,
        preference_id: result.preference_id,
        sandbox_url: result.sandbox_init_point || result.sandbox_url // Priorizar sandbox_init_point
      };
    } catch (error) {
      console.error('Payment service error:', error);
      throw error;
    }
  },

  async verifyPayment(paymentId) {
    try {
      return await mercadopagoService.verifyPayment(paymentId);
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
};