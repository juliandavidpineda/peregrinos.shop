import React from 'react';

const KeyMetrics = ({ orders, products }) => {
  const calculateMetrics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Simulación de conversión (en un caso real vendría de analytics)
    const conversionRate = totalOrders > 0 ? Math.min((totalOrders / 100) * 100, 15) : 0;
    
    const repeatCustomers = new Set(orders.map(order => order.customer_email)).size;
    const repeatRate = totalOrders > 0 ? ((repeatCustomers / totalOrders) * 100).toFixed(1) : 0;

    return {
      averageTicket,
      conversionRate,
      repeatRate,
      totalCustomers: repeatCustomers
    };
  };

  const metrics = calculateMetrics();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const metricCards = [
    {
      label: 'Ticket Promedio',
      value: formatPrice(metrics.averageTicket),
      icon: '💰',
      description: 'Valor promedio por orden'
    },
    {
      label: 'Tasa de Conversión',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: '📊',
      description: 'Eficiencia en ventas'
    },
    {
      label: 'Clientes Recurrentes',
      value: `${metrics.repeatRate}%`,
      icon: '🔄',
      description: 'Fidelización de clientes'
    },
    {
      label: 'Clientes Únicos',
      value: metrics.totalCustomers.toString(),
      icon: '👥',
      description: 'Total de clientes'
    }
  ];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-6">Métricas Clave</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {metricCards.map((metric, index) => (
          <article key={index} className="text-center p-4 bg-gradient-to-br from-[#f7f2e7] to-[#e8dfd1] rounded-lg">
            <div className="text-2xl mb-2">{metric.icon}</div>
            <p className="text-lg font-bold text-[#2f4823]">{metric.value}</p>
            <p className="text-sm text-[#779385] font-medium">{metric.label}</p>
            <p className="text-xs text-[#779385] mt-1">{metric.description}</p>
          </article>
        ))}
      </div>

      {orders.length > 0 && (
        <footer className="mt-4 pt-4 border-t border-[#779385]/20 text-center">
          <p className="text-sm text-[#779385]">
            Basado en {orders.length} órdenes • {products.length} productos
          </p>
        </footer>
      )}
    </section>
  );
};

export default KeyMetrics;