import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from "../../services/orderService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');

  useEffect(() => {

     console.log('🔍 PaymentSuccess montado');
    console.log('🔍 Order ID:', orderId);

    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          console.log('🔍 Fetching order...');
          const orderData = await orderService.getOrder(orderId);
          console.log('🔍 Order data recibida:', orderData);
          setOrder(orderData.order);
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('⚠️ No hay order ID');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto"></div>
          <p className="mt-4 text-[#779385]">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header de éxito */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="text-6xl lg:text-8xl mb-4 text-green-500">✅</div>
          <h1 className="font-serif font-bold text-2xl lg:text-4xl text-[#2f4823] mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-lg lg:text-xl text-[#779385]">
            Gracias por tu compra. Tu orden ha sido confirmada.
          </p>
          {order && (
            <p className="text-sm lg:text-base text-[#779385] mt-2">
              Número de orden: <strong>{order.id}</strong>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Resumen de la orden */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
            <h2 className="font-serif font-bold text-xl lg:text-2xl text-[#2f4823] mb-6">
              Resumen de tu Orden
            </h2>

            {order ? (
              <div className="space-y-4">
                {/* Información del cliente */}
                <div className="border-b border-[#779385]/20 pb-4">
                  <h3 className="font-semibold text-[#2f4823] mb-2">Información de Envío</h3>
                  <p className="text-[#779385] text-sm">
                    {order.customer_info?.name}<br />
                    {order.customer_info?.email}<br />
                    {order.customer_info?.phone}<br />
                    {order.customer_info?.address}, {order.customer_info?.city}
                  </p>
                </div>

                {/* Productos */}
                <div className="border-b border-[#779385]/20 pb-4">
                  <h3 className="font-semibold text-[#2f4823] mb-3">Productos</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-[#2f4823] text-sm">
                            {item.name}
                          </p>
                          <p className="text-[#779385] text-xs">
                            Talla: {item.size} • {item.quantity} und
                          </p>
                        </div>
                        <span className="font-semibold text-[#2f4823] text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[#2f4823]">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#2f4823]">
                    <span>Envío:</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-[#779385]/20 pt-2">
                    <span className="text-[#2f4823]">Total:</span>
                    <span className="text-[#2f4823]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#779385]">No se pudo cargar la información de la orden.</p>
              </div>
            )}
          </div>

          {/* Información de seguimiento */}
          <div className="space-y-6 lg:space-y-8">
            {/* Próximos pasos */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
              <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
                Próximos Pasos
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-[#2f4823]">Confirmación por Email</p>
                    <p className="text-sm text-[#779385]">
                      Recibirás un email con los detalles de tu compra en los próximos minutos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-[#2f4823]">Preparación del Pedido</p>
                    <p className="text-sm text-[#779385]">
                      Tu pedido será preparado y enviado en un plazo de 1-2 días hábiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs mt-1">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-[#2f4823]">Seguimiento</p>
                    <p className="text-sm text-[#779385]">
                      Recibirás un número de seguimiento una vez tu pedido sea despachado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-[#f7f2e7] rounded-2xl border border-[#779385]/20 p-6">
              <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
                ¿Qué deseas hacer ahora?
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
                {order && (
                  <button
                    onClick={() => window.print()}
                    className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg hover:bg-white transition-colors font-medium"
                  >
                    Imprimir Comprobante
                  </button>
                )}
              </div>
            </div>

            {/* Mensaje espiritual */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
              <div className="text-3xl mb-3">🙏</div>
              <p className="text-[#2f4823] font-semibold italic">
                "Que el Señor bendiga cada puntada de tus nuevas prendas"
              </p>
              <p className="text-sm text-[#779385] mt-2">
                Gracias por apoyar nuestro ministerio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;