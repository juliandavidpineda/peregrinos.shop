import React from 'react';

const Notifications = ({ products, orders }) => {
  const getNotifications = () => {
    const notifications = [];

    // Notificaciones de stock bajo
    const lowStockProducts = products.filter(product => 
      product.stock_quantity < 10 && product.stock_quantity > 0
    );
    
    const outOfStockProducts = products.filter(product => 
      product.stock_quantity === 0
    );

    if (lowStockProducts.length > 0) {
      notifications.push({
        type: 'warning',
        message: 'Stock Bajo',
        details: `${lowStockProducts.length} productos con stock bajo (< 10 unidades)`,
        icon: '📦',
        color: 'bg-orange-100 text-orange-600'
      });
    }

    if (outOfStockProducts.length > 0) {
      notifications.push({
        type: 'error',
        message: 'Stock Agotado',
        details: `${outOfStockProducts.length} productos sin stock`,
        icon: '❌',
        color: 'bg-red-100 text-red-600'
      });
    }

    // Notificación de reviews pendientes (simulada)
    const pendingReviews = orders.filter(order => 
      order.status === 'delivered'
    ).length;

    if (pendingReviews > 0) {
      notifications.push({
        type: 'info',
        message: 'Reviews Pendientes',
        details: `${pendingReviews} órdenes entregadas esperando review`,
        icon: '⭐',
        color: 'bg-blue-100 text-blue-600'
      });
    }

    // Notificación de órdenes pendientes
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    if (pendingOrders > 0) {
      notifications.push({
        type: 'info',
        message: 'Órdenes Pendientes',
        details: `${pendingOrders} órdenes esperando procesamiento`,
        icon: '⏳',
        color: 'bg-yellow-100 text-yellow-600'
      });
    }

    return notifications;
  };

  const notifications = getNotifications();

  if (!notifications.length) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Notificaciones</h2>
        <div className="text-center py-8 text-[#779385]">
          <div className="text-4xl mb-2">🔔</div>
          <p>No hay notificaciones</p>
          <p className="text-sm mt-1">Todo está bajo control</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Notificaciones</h2>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <article key={index} className={`p-3 rounded-lg border ${notification.color.split(' ')[0].replace('bg-', 'border-')} ${notification.color}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.color}`}>
                <span className="text-sm">{notification.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm opacity-90">{notification.details}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className="mt-4 pt-4 border-t border-[#779385]/20 text-center">
        <p className="text-sm text-[#779385]">
          {notifications.length} notificaciones activas
        </p>
      </footer>
    </section>
  );
};

export default Notifications;