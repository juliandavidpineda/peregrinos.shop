import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderService } from "../../services/orderService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const hasFetchedRef = useRef(false);
  const isMountedRef = useRef(true);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const paymentStatus = searchParams.get('status');

  useEffect(() => {
    isMountedRef.current = true;

    // ✅ Limpiar carrito una sola vez
    if (!hasFetchedRef.current) {
      clearCart();
      console.log('🧹 Carrito limpiado');
    }

    console.log('🔍 PaymentSuccess - Parámetros:', { orderId, paymentId, paymentStatus });

    // ✅ Prevenir múltiples ejecuciones
    if (hasFetchedRef.current) {
      console.log('⏭️ Fetch ya ejecutado previamente');
      return;
    }

    if (!orderId) {
      console.log('⚠️ No hay order ID');
      setError('No se encontró ID de orden');
      setLoading(false);
      return;
    }

    hasFetchedRef.current = true;

    const fetchOrderDetails = async (attemptNumber = 1) => {
      // ✅ Verificar si el componente sigue montado ANTES de cada operación
      if (!isMountedRef.current) {
        console.log('⏹️ Componente desmontado, cancelando fetch');
        return;
      }

      try {
        console.log(`🔄 Intento ${attemptNumber}/${MAX_RETRIES}`);
        
        const orderData = await orderService.getOrder(orderId);
        
        // ✅ Verificar INMEDIATAMENTE después del await
        if (!isMountedRef.current) {
          console.log('⏹️ Componente desmontado después del fetch');
          return;
        }
        
        console.log('📦 Datos recibidos:', orderData);

        let orderObject = orderData?.order || orderData;

        if (!orderObject?.id) {
          throw new Error('Orden sin ID válido');
        }

        // 🔧 TRANSFORMAR la estructura del backend a la esperada por el frontend
        const transformedOrder = {
          ...orderObject,
          // ✅ Crear customer_info a partir de los campos individuales
          customer_info: {
            name: orderObject.customer_name,
            email: orderObject.customer_email,
            phone: orderObject.customer_phone,
            address: orderObject.customer_address,
            city: orderObject.customer_city,
            department: orderObject.customer_department,
            postal_code: orderObject.customer_postal_code
          },
          // ✅ Transformar items para que usen 'name' e 'image' en lugar de 'product_name' y 'product_image'
          items: orderObject.items?.map(item => ({
            ...item,
            name: item.product_name || item.name,
            image: item.product_image || item.image
          })) || []
        };

        console.log('✅ Orden transformada:', transformedOrder);

        // ✅ Verificar una vez más antes de actualizar el state
        if (!isMountedRef.current) {
          console.log('⏹️ Componente desmontado antes de setState');
          return;
        }

        setOrder(transformedOrder);
        setError(null);
        setLoading(false);
        
      } catch (error) {
        console.error(`❌ Error en intento ${attemptNumber}:`, error);
        
        if (!isMountedRef.current) {
          console.log('⏹️ Componente desmontado durante error');
          return;
        }

        // 🔄 Reintentar
        if (attemptNumber < MAX_RETRIES) {
          console.log(`⏳ Reintentando en ${RETRY_DELAY/1000}s...`);
          setTimeout(() => {
            if (isMountedRef.current) {
              fetchOrderDetails(attemptNumber + 1);
            }
          }, RETRY_DELAY);
        } else {
          setError('No pudimos cargar los detalles. Tu pago fue procesado exitosamente.');
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();

    return () => {
      console.log('🧹 Desmontando PaymentSuccess');
      isMountedRef.current = false;
    };
  }, []); // ✅ Solo ejecutar al montar

  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const shareOnWhatsApp = () => {
    const orderNumber = orderId?.slice(0, 8).toUpperCase() || 'N/A';
    const total = order?.total ? formatPrice(order.total) : 'N/A';
    const message = `¡Acabo de realizar mi pedido en Peregrinos Shop! 🙏\n\nPedido #${orderNumber}\nTotal: ${total}\n\nwww.peregrinos.shop`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRetry = () => {
    console.log('🔄 Reiniciando...');
    window.location.reload();
  };

  // 🔄 Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto"></div>
          <p className="mt-4 text-[#779385] font-medium">Cargando confirmación de tu pedido...</p>
          <p className="text-sm text-[#779385] mt-2">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  // ❌ Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-[#2f4823] mb-3">
            Problema al cargar los detalles
          </h2>
          <p className="text-[#779385] mb-6 leading-relaxed">{error}</p>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={handleRetry}
              className="w-full bg-[#2f4823] text-white px-6 py-3 rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
            >
              🔄 Reintentar
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-[#779385] text-[#779385] px-6 py-3 rounded-lg hover:bg-white transition-colors font-medium"
            >
              🏠 Ir al Inicio
            </button>
          </div>

          {orderId && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    Tu pago fue procesado exitosamente
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Orden:</strong> #{orderId.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    Recibirás un correo de confirmación pronto.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ✅ Vista de éxito
  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header de éxito */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-block animate-bounce">
            <div className="text-6xl lg:text-8xl mb-4">✅</div>
          </div>
          <h1 className="font-serif font-bold text-2xl lg:text-4xl text-[#2f4823] mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-lg lg:text-xl text-[#779385]">
            Gracias por tu compra. Tu orden ha sido confirmada.
          </p>
          {order?.id && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#779385]/20 shadow-sm">
              <span className="text-sm text-[#779385]">Orden:</span>
              <strong className="text-[#2f4823] font-mono text-sm">
                #{order.id.slice(0, 8).toUpperCase()}
              </strong>
            </div>
          )}
          {paymentId && (
            <div className="mt-2 text-xs text-[#779385]">
              ID de pago: {paymentId}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Resumen de la orden */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
            <h2 className="font-serif font-bold text-xl lg:text-2xl text-[#2f4823] mb-6">
              Resumen de tu Orden
            </h2>

            <div className="space-y-4">
              {/* Información del cliente */}
              <div className="border-b border-[#779385]/20 pb-4">
                <h3 className="font-semibold text-[#2f4823] mb-3">Información de Envío</h3>
                {order?.customer_info ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-[#2f4823] font-medium">
                      {order.customer_info.name}
                    </p>
                    <p className="text-[#779385] flex items-center gap-2">
                      <span>📧</span>
                      {order.customer_info.email}
                    </p>
                    <p className="text-[#779385] flex items-center gap-2">
                      <span>📱</span>
                      {order.customer_info.phone}
                    </p>
                    <p className="text-[#779385] flex items-start gap-2">
                      <span className="mt-0.5">📍</span>
                      <span>
                        {order.customer_info.address}
                        {order.customer_info.city && `, ${order.customer_info.city}`}
                        {order.customer_info.department && `, ${order.customer_info.department}`}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-[#779385] text-sm italic">
                    Información no disponible
                  </p>
                )}
              </div>

              {/* Productos */}
              <div className="border-b border-[#779385]/20 pb-4">
                <h3 className="font-semibold text-[#2f4823] mb-3">Productos</h3>
                {order?.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={item.id || index} className="flex gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name || 'Producto'}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <p className="font-medium text-[#2f4823] text-sm">
                              {item.name || 'Producto'}
                            </p>
                            <p className="text-[#779385] text-xs">
                              {item.size && `Talla: ${item.size}`}
                              {item.size && item.quantity && ' • '}
                              {item.quantity && `${item.quantity} und`}
                            </p>
                          </div>
                          <span className="font-semibold text-[#2f4823] text-sm whitespace-nowrap ml-2">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#779385] text-sm italic">
                    No hay productos disponibles
                  </p>
                )}
              </div>

              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between text-[#2f4823]">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-[#2f4823]">
                  <span>Envío:</span>
                  <span>{formatPrice(order?.shipping || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-[#779385]/20 pt-2">
                  <span className="text-[#2f4823]">Total:</span>
                  <span className="text-[#2f4823]">{formatPrice(order?.total || 0)}</span>
                </div>
              </div>
            </div>
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
                  <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs font-semibold mt-1 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-[#2f4823]">Confirmación por Email</p>
                    <p className="text-sm text-[#779385]">
                      Recibirás un email con los detalles completos de tu compra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs font-semibold mt-1 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-[#2f4823]">Preparación del Pedido</p>
                    <p className="text-sm text-[#779385]">
                      Tu pedido será preparado y enviado en 1-2 días hábiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-xs font-semibold mt-1 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-[#2f4823]">Seguimiento</p>
                    <p className="text-sm text-[#779385]">
                      Recibirás un número de seguimiento cuando sea despachado.
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
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg hover:bg-white transition-colors font-medium text-sm"
                  >
                    📄 Imprimir
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg hover:bg-white transition-colors font-medium text-sm"
                  >
                    📱 Compartir
                  </button>
                </div>
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

            {/* Ayuda/Soporte */}
            <div className="text-center text-sm text-[#779385]">
              <p>¿Tienes alguna pregunta?</p>
              <button
                onClick={() => navigate('/contacto')}
                className="text-[#2f4823] font-semibold hover:underline mt-1"
              >
                Contáctanos →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;