import React from 'react';

const OrderStats = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    confirmed: orders.filter(order => order.status === 'confirmed').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#779385]/20 p-6">
      <h3 className="font-semibold text-lg text-[#2f4823] mb-4">Estadísticas</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Órdenes</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-800">Pendientes</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</div>
          <div className="text-sm text-green-800">Ingresos Totales</div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;