// Crear un nuevo componente: src/pages/PaymentProcessing.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState(0);
  
  const orderId = searchParams.get('order_id');
  const maxAttempts = 60; // 60 intentos = 5 minutos (cada 5 segundos)

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    let interval;
    
    const checkPaymentStatus = async () => {
      try {
        console.log(`🔍 Verificando pago... Intento ${attempts + 1}/${maxAttempts}`);
        
        // Verificar el estado de la orden
        const response = await orderService.getOrder(orderId);
        const order = response.order;
        
        console.log('📦 Estado de la orden:', order.status);
        
        // Si el pago fue aprobado, redirigir
        if (order.payment_status === 'approved' || order.status === 'paid') {
          console.log('✅ Pago confirmado! Redirigiendo...');
          clearInterval(interval);
          navigate(`/payment-success?order_id=${orderId}`);
          return;
        }
        
        // Si fue rechazado
        if (order.payment_status === 'rejected' || order.status === 'payment_failed') {
          console.log('❌ Pago rechazado');
          clearInterval(interval);
          navigate('/checkout');
          return;
        }
        
        setAttempts(prev => prev + 1);
        
        // Si llegamos al máximo de intentos
        if (attempts >= maxAttempts) {
          console.log('⏱️ Tiempo de espera agotado');
          clearInterval(interval);
          navigate(`/payment-pending?order_id=${orderId}`);
        }
        
      } catch (error) {
        console.error('Error verificando pago:', error);
        setAttempts(prev => prev + 1);
      }
    };
    
    // Verificar inmediatamente
    checkPaymentStatus();
    
    // Luego verificar cada 5 segundos
    interval = setInterval(checkPaymentStatus, 5000);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, attempts, navigate]);

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
          
          {/* 🆕 Botón manual si tarda mucho */}
          {attempts > 10 && (
            <div className="mt-4">
              <p className="text-sm text-[#779385] mb-3">
                ¿El pago ya fue aprobado pero sigue esperando?
              </p>
              <button
                onClick={() => navigate(`/payment-success?order_id=${orderId}`)}
                className="w-full bg-[#2f4823] text-white py-3 rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
              >
                ✅ Sí, mi pago fue aprobado - Continuar
              </button>
            </div>
          )}
          
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