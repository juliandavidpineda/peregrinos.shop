import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('order_id');
  const errorType = searchParams.get('error') || 'payment_failed';

  const errorMessages = {
    payment_failed: {
      title: "Pago No Procesado",
      description: "No pudimos procesar tu pago. Esto puede deberse a fondos insuficientes, datos incorrectos o problemas temporales con tu método de pago."
    },
    card_declined: {
      title: "Tarjeta Declinada", 
      description: "Tu tarjeta fue declinada. Por favor verifica los datos o intenta con otro método de pago."
    },
    insufficient_funds: {
      title: "Fondos Insuficientes",
      description: "No hay fondos suficientes en tu cuenta. Por favor verifica tu saldo e intenta nuevamente."
    }
  };

  const currentError = errorMessages[errorType] || errorMessages.payment_failed;

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header de error */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="text-6xl lg:text-8xl mb-4 text-red-500">❌</div>
          <h1 className="font-serif font-bold text-2xl lg:text-4xl text-[#2f4823] mb-4">
            {currentError.title}
          </h1>
          <p className="text-lg lg:text-xl text-[#779385]">
            {currentError.description}
          </p>
          {orderId && (
            <p className="text-sm lg:text-base text-[#779385] mt-2">
              Número de orden: <strong>{orderId}</strong>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Soluciones */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
            <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-6">
              ¿Qué puedes hacer?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                  1
                </div>
                <div>
                  <p className="font-semibold text-[#2f4823]">Verificar datos</p>
                  <p className="text-sm text-[#779385]">
                    Revisa que los datos de tu tarjeta sean correctos y estén vigentes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                  2
                </div>
                <div>
                  <p className="font-semibold text-[#2f4823]">Contactar tu banco</p>
                  <p className="text-sm text-[#779385]">
                    Algunas transacciones pueden ser bloqueadas por medidas de seguridad.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                  3
                </div>
                <div>
                  <p className="font-semibold text-[#2f4823]">Intentar nuevamente</p>
                  <p className="text-sm text-[#779385]">
                    Puedes reintentar el pago con los mismos datos o un método diferente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-6">
            <div className="bg-[#f7f2e7] rounded-2xl border border-[#779385]/20 p-6">
              <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
                Continuar con tu compra
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-[#2f4823] text-white py-3 rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
                >
                  Reintentar Pago
                </button>
                <button
                  onClick={() => navigate('/shop-page')}
                  className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg hover:bg-white transition-colors font-medium"
                >
                  Seguir Comprando
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg hover:bg-white transition-colors font-medium"
                >
                  Ir al Inicio
                </button>
              </div>
            </div>

            {/* Soporte */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-[#2f4823] font-semibold">
                ¿Necesitas ayuda?
              </p>
              <p className="text-sm text-[#779385] mt-2">
                Estamos aquí para ayudarte con tu compra
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="mt-3 text-[#2f4823] font-medium hover:underline"
              >
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;