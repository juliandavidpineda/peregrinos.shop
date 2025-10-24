// frontend/services/paymentService.js - NUEVA VERSIÓN PARA WOMPI
import { wompiService } from './wompiService';

export const paymentService = {
  async createPayment(amount, orderId, customerEmail, customerName) {
    try {
      // Usar Wompi en lugar de Stripe
      const result = await wompiService.createPaymentLink(
        amount, 
        orderId, 
        customerEmail, 
        customerName
      );

      if (!result.success) {
        throw new Error(result.error || 'Error al crear el pago');
      }

      return {
        success: true,
        payment_url: result.payment_url,
        payment_id: result.payment_id
      };
    } catch (error) {
      console.error('Payment service error:', error);
      throw error;
    }
  },

  async verifyPayment(transactionId) {
    try {
      return await wompiService.verifyPayment(transactionId);
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
};

// Eliminar cualquier referencia a Stripe