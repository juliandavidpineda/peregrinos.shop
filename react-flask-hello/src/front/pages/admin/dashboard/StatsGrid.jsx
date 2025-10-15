import React from 'react';

const StatsGrid = ({ stats, formatPrice }) => {
  const statsData = [
    { 
      label: 'Productos Totales', 
      value: stats.totalProducts.toString(), 
      icon: '👕', 
      color: 'bg-blue-500',
      description: 'Productos en inventario'
    },
    { 
      label: 'Categorías', 
      value: stats.totalCategories.toString(), 
      icon: '📁', 
      color: 'bg-green-500',
      description: 'Categorías activas'
    },
    { 
      label: 'Pedidos Hoy', 
      value: stats.todayOrders.toString(), 
      icon: '📦', 
      color: 'bg-yellow-500',
      description: 'Pedidos del día de hoy'
    },
    { 
      label: 'Ingresos Mes', 
      value: formatPrice(stats.monthlyRevenue), 
      icon: '💰', 
      color: 'bg-purple-500',
      description: 'Ingresos del mes actual'
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <article key={index} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-[#779385]">{stat.label}</p>
              <p className="text-2xl font-bold text-[#2f4823] mt-1">{stat.value}</p>
              <p className="text-xs text-[#779385] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                {stat.description}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default StatsGrid;