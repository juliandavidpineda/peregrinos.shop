import React from 'react';

const RecentOrders = ({ orders, formatOrderId, formatPrice, formatTimeAgo }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBorder = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (!orders.length) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Pedidos Recientes</h2>
        <div className="text-center py-12 text-[#779385]">
          <div className="text-4xl mb-2">📦</div>
          <p>No hay pedidos recientes</p>
          <p className="text-sm mt-1">Los nuevos pedidos aparecerán aquí</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <header className="flex justify-between items-center mb-4">
        <h2 className="font-serif font-bold text-xl text-[#2f4823]">Pedidos Recientes</h2>
        <span className="text-sm text-[#779385]">{orders.length} pedidos</span>
      </header>

      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="flex items-center justify-between p-4 bg-[#f7f2e7] rounded-lg hover:bg-[#e8dfd1] transition-colors group">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-10 rounded-full ${getStatusBorder(order.status)} group-hover:scale-110 transition-transform`}></div>
              <div>
                <p className="font-medium text-[#2f4823]">{formatOrderId(order.id)}</p>
                <p className="text-sm text-[#779385]">{order.customer_name} • {order.customer_email}</p>
                <p className="text-xs text-gray-500">{formatTimeAgo(order.created_at)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#2f4823] text-lg">{formatPrice(order.total)}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentOrders;