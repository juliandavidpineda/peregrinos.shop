import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Función para formatear el UUID
  const formatOrderId = (uuid) => {
    return `ORD-${uuid.slice(0, 8).toUpperCase()}`;
  };

  // Función para corregir la zona horaria (UTC to Colombia)
  const formatColombiaTime = (dateString) => {
    const date = new Date(dateString);
    
    // Ajustar a zona horaria de Colombia (UTC-5)
    const colombiaOffset = -5 * 60; // Colombia está en UTC-5
    const localOffset = date.getTimezoneOffset();
    const offsetDiff = colombiaOffset + localOffset;
    
    const colombiaTime = new Date(date.getTime() + offsetDiff * 60000);
    
    return colombiaTime.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota'
    });
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token || !isAuthenticated) {
        navigate('/admin/login');
        return;
      }

      const result = await orderService.getAllOrders(token);
      setOrders(result.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await orderService.updateOrderStatus(orderId, newStatus, token);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el estado');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-2xl mb-4">📦</div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2f4823]">Gestión de Órdenes</h1>
          <p className="text-[#779385] text-sm">
            Conectado como: {user?.email} • {orders.length} órdenes encontradas
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-[#779385] text-white px-4 py-2 rounded hover:bg-[#5a7265] transition-colors"
        >
          Actualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 text-gray-400">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay órdenes</h3>
          <p className="text-gray-500">Todavía no se han realizado pedidos.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-[#779385]/20 p-6">
              {/* Header de la orden - CORREGIDO */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-[#2f4823] mb-1">
                    Orden: {formatOrderId(order.id)}
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-[#779385] text-sm cursor-help border-b border-dashed border-[#779385]"
                      title={`ID completo: ${order.id}`}
                    >
                      ID: {order.id.slice(0, 8)}...
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[#779385] text-sm">{order.customer_name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[#779385] text-sm">{order.customer_email}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    📅 {formatColombiaTime(order.created_at)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-sm border border-[#779385]/30 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#2f4823]"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Información de envío */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-[#2f4823] mb-2">📦 Dirección de Envío</h4>
                  <p className="text-sm text-gray-700">
                    {order.customer_address}<br/>
                    {order.customer_city}, {order.customer_department}<br/>
                    {order.customer_postal_code && `📮 Código Postal: ${order.customer_postal_code}`}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#2f4823] mb-2">💰 Totales</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span>{formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-[#779385]/20 pt-2 mt-1">
                      <span>Total:</span>
                      <span className="text-[#2f4823]">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos - CORREGIDO (sin duplicados) */}
              <div>
                <h4 className="font-semibold text-[#2f4823] mb-3">🛍️ Productos ({order.items.length})</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center justify-between p-3 bg-[#f7f2e7] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.product_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop'} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-[#2f4823]">{item.product_name}</p>
                          <p className="text-sm text-[#779385]">
                            📏 Talla: {item.size} • 🔢 Cantidad: {item.quantity}
                          </p>
                          <p className="text-xs text-gray-500">
                            💰 {formatPrice(item.price)} c/u
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2f4823] text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-[#779385]">
                          Subtotal
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;