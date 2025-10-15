import React from 'react';

const SalesChart = ({ orders }) => {
  // Generar datos últimos 7 días
  const getLast7DaysSales = () => {
    const days = [];
    const sales = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('es-CO', { weekday: 'short' });
      
      const daySales = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      }).reduce((sum, order) => sum + order.total, 0);
      
      days.push(dateString);
      sales.push(daySales);
    }
    
    return { days, sales };
  };

  const { days, sales } = getLast7DaysSales();
  const maxSales = Math.max(...sales, 1); // Evitar división por cero

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-6">Ventas Últimos 7 Días</h2>
      
      <div className="space-y-4">
        {/* Gráfico de barras simple */}
        <div className="flex items-end justify-between h-32">
          {sales.map((sale, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="text-xs text-[#779385]">{formatPrice(sale)}</div>
              <div
                className="w-8 bg-gradient-to-t from-[#2f4823] to-[#779385] rounded-t transition-all hover:opacity-80"
                style={{ height: `${(sale / maxSales) * 80}px` }}
                title={`${days[index]}: ${formatPrice(sale)}`}
              ></div>
              <div className="text-xs text-[#779385] font-medium">{days[index]}</div>
            </div>
          ))}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#779385]/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#2f4823]">{formatPrice(sales.reduce((a, b) => a + b, 0))}</p>
            <p className="text-xs text-[#779385]">Total 7 días</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#2f4823]">{orders.filter(order => {
              const orderDate = new Date(order.created_at);
              const today = new Date();
              return orderDate.toDateString() === today.toDateString();
            }).length}</p>
            <p className="text-xs text-[#779385]">Pedidos hoy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#2f4823]">
              {sales.length > 1 ? Math.max(...sales) > 0 ? '📈' : '➡️' : '📊'}
            </p>
            <p className="text-xs text-[#779385]">Tendencia</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesChart;