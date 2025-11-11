import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState(0);
  
  const orderId = searchParams.get('order_id');
  const maxAttempts = 60;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    let interval;
    let isComponentMounted = true;
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;
    
    const checkPaymentStatus = async () => {
      if (!isComponentMounted) return;
      
      try {
        const response = await orderService.getOrder(orderId);
        const order = response.order;
        
        // 🔍 SOLO DEBUG ESENCIAL
        console.log('🔍 DEBUG Order Status:', {
          payment_status: order.payment_status,
          status: order.status,
          shouldRedirect: order.payment_status === 'approved' || order.status === 'CONFIRMED'
        });
        
        // Resetear contador de errores en éxito
        consecutiveErrors = 0;
        
        // VERIFICAR SI YA ESTAMOS EN PAYMENT-SUCCESS
        if (window.location.pathname.includes('payment-success')) {
          clearInterval(interval);
          return;
        }
        
        // Estados de aprobación
        if (order.payment_status === 'approved' || order.status === 'CONFIRMED') {
          console.log('✅ Pago confirmado! Redirigiendo...');
          clearInterval(interval);
          navigate(`/payment-success?order_id=${orderId}`);
          return;
        }
        
        // Estados de rechazo
        if (order.payment_status === 'rejected' || order.status === 'CANCELLED') {
          console.log('❌ Pago rechazado');
          clearInterval(interval);
          navigate('/checkout');
          return;
        }
        
        setAttempts(prev => prev + 1);
        
        if (attempts >= maxAttempts) {
          console.log('⏱️ Tiempo de espera agotado');
          clearInterval(interval);
          navigate(`/payment-pending?order_id=${orderId}`);
        }
        
      } catch (error) {
        console.error('❌ Error verificando pago:', error);
        setAttempts(prev => prev + 1);
        consecutiveErrors++;
        
        // VERIFICAR SI YA ESTAMOS EN PAYMENT-SUCCESS (incluso en error)
        if (window.location.pathname.includes('payment-success')) {
          clearInterval(interval);
          return;
        }
        
        // Esperar más en errores consecutivos
        const errorDelay = Math.min(consecutiveErrors * 2000, 10000);
        await new Promise(resolve => setTimeout(resolve, errorDelay));
        
        // Si muchos errores seguidos, redirigir
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          console.log('⚠️ Muchos errores consecutivos, redirigiendo...');
          clearInterval(interval);
          navigate(`/payment-pending?order_id=${orderId}`);
        }
        
        // Si máximo de intentos
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          navigate(`/payment-pending?order_id=${orderId}`);
        }
      }
    };
    
    setTimeout(() => checkPaymentStatus(), 1000);
    interval = setInterval(checkPaymentStatus, 8000);
    
    return () => {
      isComponentMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [orderId, attempts, navigate, maxAttempts]);

  return (
    <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-[#779385]/20 p-8 text-center">
          
          {/* Spinner animado */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#f7f2e7] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#2f4823] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
          
          <h1 className="font-serif font-bold text-2xl text-[#2f4823] mb-3">
            Procesando tu pago
          </h1>
          
          <p className="text-[#779385] mb-6">
            Estamos verificando el estado de tu pago con Mercado Pago...
          </p>
          
          {/* Barra de progreso */}
          <div className="w-full bg-[#f7f2e7] rounded-full h-2 mb-4">
            <div 
              className="bg-[#2f4823] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(attempts / maxAttempts) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-[#779385]">
            Verificación {attempts + 1} de {maxAttempts}
          </p>
          
          {/* Instrucciones */}
          <div className="mt-6 p-4 bg-[#f7f2e7] rounded-lg">
            <p className="text-sm text-[#779385]">
              <strong>¿Ya completaste el pago en Mercado Pago?</strong><br />
              Espera unos segundos mientras verificamos...
            </p>
          </div>
          
          {/* Botón de escape */}
          <button
            onClick={() => navigate('/shop-page')}
            className="mt-6 text-sm text-[#779385] hover:text-[#2f4823] underline"
          >
            Volver a la tienda
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;