import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = ({ orders, onRefresh }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

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
      day: 'numeric'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-[#2f4823] font-serif mb-6">Mis Pedidos</h3>
        <div className="bg-[#f7f2e7] rounded-2xl p-12 border border-[#779385]/20">
          <div className="text-6xl mb-4 text-[#779385]">📦</div>
          <h4 className="text-xl font-semibold text-[#2f4823] mb-2">Aún no tienes pedidos</h4>
          <p className="text-[#779385] mb-6 max-w-md mx-auto">
            Cuando realices tu primera compra, aparecerá aquí tu historial de pedidos.
          </p>
          <button
            onClick={() => navigate('/shop-page')}
            className="px-6 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300 transform hover:scale-105"
          >
            Descubrir Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#2f4823] font-serif mb-4 md:mb-0">Mis Pedidos</h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmados</option>
            <option value="processing">En proceso</option>
            <option value="shipped">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
          
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#779385] text-white rounded-2xl font-semibold hover:bg-[#2f4823] transition-all duration-300"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Header del pedido */}
            <div className="bg-gradient-to-r from-[#f7f2e7] to-[#e8dfca] p-4 border-b border-[#779385]/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="font-semibold text-[#2f4823]">Pedido #{order.id.slice(-8).toUpperCase()}</h4>
                  <p className="text-sm text-[#779385]">Realizado el {formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="text-lg font-bold text-[#2f4823]">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Items del pedido */}
            <div className="p-4">
              <div className="space-y-3">
                {order.items?.slice(0, 2).map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#f7f2e7] rounded-lg overflow-hidden">
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
                    <div className="flex-1">
                      <p className="font-medium text-[#2f4823] text-sm">{item.product_name}</p>
                      <p className="text-xs text-[#779385]">
                        {item.quantity}x • Talla: {item.size} • ${item.price.toLocaleString()} c/u
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#2f4823] text-sm">
                        ${(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.items && order.items.length > 2 && (
                <div className="mt-3 pt-3 border-t border-[#779385]/10">
                  <p className="text-sm text-[#779385] text-center">
                    +{order.items.length - 2} productos más en este pedido
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#779385]/10">
                <div className="text-sm text-[#779385]">
                  {order.items?.reduce((total, item) => total + item.quantity, 0)} productos
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="px-4 py-2 text-sm border border-[#2f4823] text-[#2f4823] rounded-2xl font-semibold hover:bg-[#2f4823] hover:text-white transition-all duration-300"
                  >
                    Ver Detalle
                  </button>
                  
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate(`/review/${order.id}`)}
                      className="px-4 py-2 text-sm bg-[#779385] text-white rounded-2xl font-semibold hover:bg-[#2f4823] transition-all duration-300"
                    >
                      Calificar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="mt-6 bg-[#f7f2e7] rounded-2xl p-6 border border-[#779385]/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#2f4823]">{orders.length}</div>
            <div className="text-sm text-[#779385]">Total Pedidos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2f4823]">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-[#779385]">Entregados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2f4823]">
              {orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length}
            </div>
            <div className="text-sm text-[#779385]">En Proceso</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2f4823]">
              ${orders.reduce((total, order) => total + order.total, 0).toLocaleString()}
            </div>
            <div className="text-sm text-[#779385]">Total Gastado</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;