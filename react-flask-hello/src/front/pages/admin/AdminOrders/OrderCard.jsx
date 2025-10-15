import React from 'react';

const OrderCard = ({ order, onStatusUpdate }) => {
  const formatOrderId = (uuid) => {
    return `ORD-${uuid.slice(0, 8).toUpperCase()}`;
  };

  const formatColombiaTime = (dateString) => {
    const date = new Date(dateString);
    const colombiaOffset = -5 * 60;
    const localOffset = date.getTimezoneOffset();
    const offsetDiff = colombiaOffset + localOffset;
    const colombiaTime = new Date(date.getTime() + offsetDiff * 60000);
    
    return colombiaTime.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#779385]/20 p-6">
      {/* Header de la orden */}
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
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
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

      {/* Productos */}
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
  );
};

export default OrderCard;