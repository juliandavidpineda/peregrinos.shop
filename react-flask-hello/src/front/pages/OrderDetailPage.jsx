// OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useUserAuth } from '../context/UserAuthContext';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(orderId);
      
      if (response.order) {
        setOrder(response.order);
      } else {
        setError('No se pudo cargar el detalle del pedido');
      }
    } catch (err) {
      setError('Error al cargar el detalle del pedido');
      console.error('Error loading order detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      processing: 'En proceso',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto mb-4"></div>
          <p className="text-[#779385] text-lg">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#779385]">📄</div>
          <h2 className="text-2xl font-bold text-[#2f4823] mb-2">Factura no encontrada</h2>
          <p className="text-[#779385] mb-6">{error || 'La factura solicitada no existe.'}</p>
          <button
            onClick={() => navigate('/mi-perfil')}
            className="px-6 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300"
          >
            Volver a Mis Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header de la factura */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#779385]/20 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2f4823] font-serif">Factura</h1>
              <p className="text-[#779385]">Peregrinos Shop - Tienda de artículos religiosos</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-bold text-[#2f4823]">#{order.id.slice(-8).toUpperCase()}</div>
              <p className="text-[#779385]">Fecha: {formatDate(order.created_at)}</p>
            </div>
          </div>

          {/* Información del cliente y pedido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-[#2f4823] mb-3 text-lg">Información del Cliente</h3>
              <div className="space-y-2 text-[#779385]">
                <p><strong className="text-[#2f4823]">Nombre:</strong> {order.customer_name}</p>
                <p><strong className="text-[#2f4823]">Email:</strong> {order.customer_email}</p>
                <p><strong className="text-[#2f4823]">Teléfono:</strong> {order.customer_phone}</p>
                {order.customer_address && (
                  <p><strong className="text-[#2f4823]">Dirección:</strong> {order.customer_address}</p>
                )}
                {(order.customer_city || order.customer_department) && (
                  <p>
                    <strong className="text-[#2f4823]">Ubicación:</strong> 
                    {order.customer_city && ` ${order.customer_city}`}
                    {order.customer_department && `, ${order.customer_department}`}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#2f4823] mb-3 text-lg">Detalles del Pedido</h3>
              <div className="space-y-2 text-[#779385]">
                <p><strong className="text-[#2f4823]">Estado:</strong> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </p>
                <p><strong className="text-[#2f4823]">Actualizado:</strong> {formatDate(order.updated_at)}</p>
                <p><strong className="text-[#2f4823]">Productos:</strong> {order.items?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#2f4823] mb-4 text-lg">Productos</h3>
            <div className="border border-[#779385]/20 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f7f2e7]">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#2f4823]">Producto</th>
                    <th className="text-center p-4 font-semibold text-[#2f4823]">Talla</th>
                    <th className="text-center p-4 font-semibold text-[#2f4823]">Cantidad</th>
                    <th className="text-right p-4 font-semibold text-[#2f4823]">Precio Unit.</th>
                    <th className="text-right p-4 font-semibold text-[#2f4823]">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f7f2e7]/30'}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-[#f7f2e7] rounded-lg overflow-hidden flex-shrink-0">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#779385] flex items-center justify-center text-white text-xs">
                                IMG
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#2f4823]">{item.product_name}</p>
                            <p className="text-sm text-[#779385]">SKU: {item.product_id?.slice(-8) || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-4 text-[#779385] font-medium">{item.size}</td>
                      <td className="text-center p-4 text-[#779385] font-medium">{item.quantity}</td>
                      <td className="text-right p-4 text-[#779385]">${item.price.toLocaleString()}</td>
                      <td className="text-right p-4 font-semibold text-[#2f4823]">
                        ${(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="border-t border-[#779385]/20 pt-6">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#779385]">Subtotal:</span>
                <span className="font-semibold text-[#2f4823]">${order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#779385]">Envío:</span>
                <span className="font-semibold text-[#2f4823]">${order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-lg border-t border-[#779385]/20 pt-3">
                <span className="font-semibold text-[#2f4823]">Total:</span>
                <span className="font-bold text-[#2f4823] text-xl">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-[#2f4823] text-[#2f4823] rounded-2xl font-semibold hover:bg-[#2f4823] hover:text-white transition-all duration-300 flex items-center space-x-2"
            >
              <span>🖨️</span>
              <span>Imprimir Factura</span>
            </button>
            
            {order.status === 'delivered' && (
              <Link
                to={`/review/${order.id}`}
                className="px-6 py-3 bg-[#779385] text-white rounded-2xl font-semibold hover:bg-[#2f4823] transition-all duration-300 flex items-center space-x-2"
              >
                <span>⭐</span>
                <span>Calificar Productos</span>
              </Link>
            )}
          </div>
          
          <button
            onClick={() => navigate('/mi-perfil')}
            className="px-6 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Volver a Mis Pedidos</span>
          </button>
        </div>

        {/* Nota legal */}
        <div className="mt-8 text-center text-sm text-[#779385]">
          <p>Esta factura es un comprobante de compra en Peregrinos Shop</p>
          <p>Para consultas sobre su pedido, contacte a: info@peregrinos.shop</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;