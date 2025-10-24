import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { wompiService } from '../services/wompiService'; // Importar servicio Wompi

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const orderId = searchParams.get('order_id');
  const transactionId = searchParams.get('transaction_id');
  const wompiStatus = searchParams.get('status');

  useEffect(() => {
    const fetchOrderAndVerifyPayment = async () => {
      if (orderId) {
        try {
          // Obtener información de la orden
          const result = await orderService.getOrder(orderId);
          setOrder(result.order);

          // Verificar estado de pago si hay transaction_id
          if (transactionId) {
            const paymentResult = await wompiService.verifyPayment(transactionId);
            if (paymentResult.success && paymentResult.status === 'APPROVED') {
              setPaymentStatus('approved');
            } else {
              setPaymentStatus(paymentResult.status || 'pending');
            }
          } else if (wompiStatus) {
            // Si viene status directo de Wompi
            setPaymentStatus(wompiStatus === 'APPROVED' ? 'approved' : wompiStatus.toLowerCase());
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
      setLoading(false);
    };

    fetchOrderAndVerifyPayment();
  }, [orderId, transactionId, wompiStatus]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      approved: { class: 'bg-green-100 text-green-800', text: 'Aprobado' },
      declined: { class: 'bg-red-100 text-red-800', text: 'Rechazado' },
      error: { class: 'bg-red-100 text-red-800', text: 'Error' },
      voided: { class: 'bg-gray-100 text-gray-800', text: 'Anulado' },
      confirmed: { class: 'bg-blue-100 text-blue-800', text: 'Confirmado' },
      shipped: { class: 'bg-purple-100 text-purple-800', text: 'Enviado' },
      delivered: { class: 'bg-green-100 text-green-800', text: 'Entregado' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#779385]">⏳</div>
          <p className="text-[#2f4823]">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header con estado de pago */}
        <div className="text-center mb-8">
          {paymentStatus === 'approved' ? (
            <>
              <div className="text-6xl mb-4 text-green-600">✅</div>
              <h1 className="font-serif font-bold text-3xl text-[#2f4823] mb-4">
                ¡Pago Exitoso!
              </h1>
              <p className="text-[#779385] text-lg">
                Tu pago ha sido procesado correctamente. Hemos recibido tu pedido.
              </p>
            </>
          ) : paymentStatus === 'declined' ? (
            <>
              <div className="text-6xl mb-4 text-red-600">❌</div>
              <h1 className="font-serif font-bold text-3xl text-[#2f4823] mb-4">
                Pago Rechazado
              </h1>
              <p className="text-[#779385] text-lg">
                Tu pago no pudo ser procesado. Por favor intenta nuevamente.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4 text-[#779385]">⏳</div>
              <h1 className="font-serif font-bold text-3xl text-[#2f4823] mb-4">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-[#779385] text-lg">
                Hemos recibido tu pedido. Estamos procesando tu pago.
              </p>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 lg:p-8">
          {order && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Información del pedido */}
              <div className="bg-[#f7f2e7] rounded-lg p-4 lg:p-6">
                <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Detalles del Pedido</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#2f4823] font-medium">Número de orden:</span>
                    <span className="text-[#779385]">{order.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#2f4823] font-medium">Estado del pago:</span>
                    {getStatusBadge(paymentStatus)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2f4823] font-medium">Estado del pedido:</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2f4823] font-medium">Fecha:</span>
                    <span className="text-[#779385]">
                      {new Date(order.created_at).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="border-t border-[#779385]/20 pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#2f4823]">Subtotal:</span>
                      <span className="text-[#779385]">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2f4823]">Envío:</span>
                      <span className="text-[#779385]">{formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-[#779385]/20 pt-2">
                      <span className="text-[#2f4823]">Total:</span>
                      <span className="text-[#2f4823]">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="bg-[#f7f2e7] rounded-lg p-4 lg:p-6">
                <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Información de Envío</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-[#2f4823] font-medium block mb-1">Nombre:</span>
                    <span className="text-[#779385]">{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-[#2f4823] font-medium block mb-1">Email:</span>
                    <span className="text-[#779385]">{order.customer_email}</span>
                  </div>
                  <div>
                    <span className="text-[#2f4823] font-medium block mb-1">Teléfono:</span>
                    <span className="text-[#779385]">{order.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-[#2f4823] font-medium block mb-1">Dirección:</span>
                    <span className="text-[#779385]">{order.customer_address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[#2f4823] font-medium block mb-1">Ciudad:</span>
                      <span className="text-[#779385]">{order.customer_city}</span>
                    </div>
                    <div>
                      <span className="text-[#2f4823] font-medium block mb-1">Departamento:</span>
                      <span className="text-[#779385]">{order.customer_department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items del pedido */}
              <div className="lg:col-span-2 bg-[#f7f2e7] rounded-lg p-4 lg:p-6">
                <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Productos</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-[#779385]/20 pb-4 last:border-b-0">
                      <div className="flex items-center space-x-4 flex-1">
                        <img 
                          src={item.product_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'} 
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-[#2f4823]">{item.product_name}</p>
                          <p className="text-sm text-[#779385]">Talla: {item.size} • Cantidad: {item.quantity}</p>
                          <p className="text-sm text-[#2f4823] font-medium">
                            {formatPrice(item.price)} c/u
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#2f4823] text-lg">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mensaje según estado del pago */}
          <div className="mt-6 lg:mt-8 p-4 bg-[#f7f2e7] rounded-lg border border-[#779385]/20">
            {paymentStatus === 'approved' ? (
              <div className="text-center">
                <p className="text-[#2f4823] font-semibold mb-2">✅ Tu pago ha sido confirmado</p>
                <p className="text-sm text-[#779385]">
                  Hemos recibido tu pago correctamente. Te contactaremos pronto con los detalles de envío.
                </p>
              </div>
            ) : paymentStatus === 'declined' ? (
              <div className="text-center">
                <p className="text-[#2f4823] font-semibold mb-2">❌ Hubo un problema con tu pago</p>
                <p className="text-sm text-[#779385] mb-4">
                  Tu pedido ha sido creado pero el pago no pudo ser procesado. 
                  Por favor intenta nuevamente o contacta con soporte.
                </p>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="bg-[#2f4823] text-white px-6 py-2 rounded-lg hover:bg-[#1f3219] transition-colors text-sm"
                >
                  Reintentar Pago
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[#2f4823] font-semibold mb-2">⏳ Procesando tu pago</p>
                <p className="text-sm text-[#779385]">
                  Tu pedido ha sido creado y estamos procesando el pago. 
                  Te notificaremos cuando todo esté confirmado.
                </p>
              </div>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="text-center mt-6 lg:mt-8 space-y-3 lg:space-y-0 lg:space-x-4">
            <button 
              onClick={() => navigate('/shop-page')}
              className="bg-[#2f4823] text-white px-6 lg:px-8 py-3 rounded-lg hover:bg-[#1f3219] transition-colors w-full lg:w-auto"
            >
              Seguir Comprando
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#779385] text-white px-6 lg:px-8 py-3 rounded-lg hover:bg-[#5a7265] transition-colors w-full lg:w-auto"
            >
              Ir al Inicio
            </button>
            {order && (
              <button 
                onClick={() => window.print()}
                className="border border-[#779385] text-[#779385] px-6 lg:px-8 py-3 rounded-lg hover:bg-white transition-colors w-full lg:w-auto"
              >
                Imprimir Comprobante
              </button>
            )}
          </div>

          {/* Mensaje espiritual */}
          <div className="text-center mt-6 lg:mt-8 pt-6 border-t border-[#779385]/20">
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
  );
};

export default OrderConfirmation;