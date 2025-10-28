import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header pendiente */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="text-6xl lg:text-8xl mb-4 text-yellow-500">⏳</div>
          <h1 className="font-serif font-bold text-2xl lg:text-4xl text-[#2f4823] mb-4">
            Pago en Proceso
          </h1>
          <p className="text-lg lg:text-xl text-[#779385]">
            Estamos verificando tu transacción. Esto puede tomar unos minutos.
          </p>
          {orderId && (
            <p className="text-sm lg:text-base text-[#779385] mt-2">
              Número de orden: <strong>{orderId}</strong>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Información del proceso */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
            <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-6">
              ¿Qué está pasando?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                  1
                </div>
                <div>
                  <p className="font-semibold text-[#2f4823]">Transacción enviada</p>
                  <p className="text-sm text-[#779385]">
                    Tu pago ha sido recibido y está siendo procesado.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                  2
                </div>
                <div>
                  <p className="font-semibold text-[#2f4823]">Verificación en curso</p>
                  <p className="text-sm text-[#779385]">
                    El sistema está confirmando los fondos y validando la transacción.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                  3
                </div>
                <div>
                  <p className="font-semibold text-[#2f4823]">Notificación pendiente</p>
                  <p className="text-sm text-[#779385]">
                    Te enviaremos un email cuando el pago sea confirmado.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Este proceso puede tomar de 5 a 30 minutos
              </p>
            </div>
          </div>

          {/* Acciones y seguimiento */}
          <div className="space-y-6">
            <div className="bg-[#f7f2e7] rounded-2xl border border-[#779385]/20 p-6">
              <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
                Mientras tanto...
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/shop-page')}
                  className="w-full bg-[#2f4823] text-white py-3 rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
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

            {/* Información de contacto */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
              <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4 text-center">
                ¿Preguntas?
              </h3>
              <div className="text-center">
                <p className="text-sm text-[#779385] mb-3">
                  Si no recibes confirmación en 24 horas:
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-[#2f4823] font-medium hover:underline"
                >
                  Contáctanos
                </button>
              </div>
            </div>

            {/* Mensaje de tranquilidad */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
              <div className="text-3xl mb-3">🙏</div>
              <p className="text-[#2f4823] font-semibold italic">
                "En paz me acuesto y en paz me duermo, porque sólo tú, Señor, me haces vivir confiado"
              </p>
              <p className="text-xs text-[#779385] mt-2">
                Salmos 4:8
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;