import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const result = await orderService.getOrder(orderId);
          setOrder(result.order);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
      setLoading(false);
    };

    fetchOrder();
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
          <div className="text-6xl mb-4 text-[#779385]">⏳</div>
          <p className="text-[#2f4823]">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 text-green-600">✅</div>
            <h1 className="font-serif font-bold text-3xl text-[#2f4823] mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-[#779385] text-lg">
              Gracias por tu compra. Hemos recibido tu pedido y te contactaremos pronto.
            </p>
          </div>
          
          {order && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información del pedido */}
              <div className="bg-[#f7f2e7] rounded-lg p-6">
                <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Detalles del Pedido</h2>
                <div className="space-y-2">
                  <p><strong>Número de orden:</strong> {order.id}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                  <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString('es-CO')}</p>
                  <p><strong>Subtotal:</strong> {formatPrice(order.subtotal)}</p>
                  <p><strong>Envío:</strong> {formatPrice(order.shipping)}</p>
                  <p><strong className="text-lg">Total:</strong> {formatPrice(order.total)}</p>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="bg-[#f7f2e7] rounded-lg p-6">
                <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Información de Envío</h2>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {order.customer_name}</p>
                  <p><strong>Email:</strong> {order.customer_email}</p>
                  <p><strong>Teléfono:</strong> {order.customer_phone}</p>
                  <p><strong>Dirección:</strong> {order.customer_address}</p>
                  <p><strong>Ciudad:</strong> {order.customer_city}</p>
                  <p><strong>Departamento:</strong> {order.customer_department}</p>
                </div>
              </div>

              {/* Items del pedido */}
              <div className="lg:col-span-2 bg-[#f7f2e7] rounded-lg p-6">
                <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Productos</h2>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-[#779385]/20 pb-3">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.product_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'} 
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-[#2f4823]">{item.product_name}</p>
                          <p className="text-sm text-[#779385]">Talla: {item.size} • {item.quantity} und</p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#2f4823]">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button 
              onClick={() => navigate('/shop-page')}
              className="bg-[#2f4823] text-white px-8 py-3 rounded-lg hover:bg-[#1f3219] transition-colors mr-4"
            >
              Seguir Comprando
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#779385] text-white px-8 py-3 rounded-lg hover:bg-[#5a7265] transition-colors"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;