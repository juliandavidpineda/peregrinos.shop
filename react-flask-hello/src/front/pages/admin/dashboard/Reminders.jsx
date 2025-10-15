import React from 'react';

const Reminders = ({ orders, formatOrderId, formatTimeAgo }) => {
  const getPendingReminders = () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    return orders.filter(order => 
      order.status === 'pending' && 
      new Date(order.created_at) < twoDaysAgo
    );
  };

  const pendingReminders = getPendingReminders();

  if (!pendingReminders.length) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Recordatorios</h2>
        <div className="text-center py-8 text-[#779385]">
          <div className="text-4xl mb-2">⏰</div>
          <p>No hay recordatorios pendientes</p>
          <p className="text-sm mt-1">Todo al día</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Recordatorios</h2>
      
      <div className="space-y-3">
        {pendingReminders.map((order) => (
          <article key={order.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-yellow-800">{formatOrderId(order.id)}</p>
                <p className="text-sm text-yellow-600">{order.customer_name}</p>
                <p className="text-xs text-yellow-500">Pendiente desde: {formatTimeAgo(order.created_at)}</p>
              </div>
              <div className="text-yellow-600 text-2xl">⚠️</div>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              ⏳ Orden pendiente por más de 2 días
            </p>
          </article>
        ))}
      </div>

      <footer className="mt-4 pt-4 border-t border-yellow-200 text-center">
        <p className="text-sm text-yellow-600">
          {pendingReminders.length} órdenes requieren atención
        </p>
      </footer>
    </section>
  );
};

export default Reminders;