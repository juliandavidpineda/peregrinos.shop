import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Productos Totales', value: '12', icon: '👕', color: 'bg-blue-500' },
    { label: 'Categorías', value: '3', icon: '📁', color: 'bg-green-500' },
    { label: 'Pedidos Hoy', value: '5', icon: '📦', color: 'bg-yellow-500' },
    { label: 'Ingresos Mes', value: '$2.4M', icon: '💰', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h1 className="font-serif font-bold text-3xl text-[#2f4823]">
          Dashboard
        </h1>
        <p className="text-[#779385] mt-2">
          Bienvenido de vuelta, <span className="font-semibold">{user?.first_name} {user?.last_name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#779385]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#2f4823] mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-center">
            <div className="text-2xl mb-2">➕</div>
            <div className="font-medium">Agregar Producto</div>
          </button>
          <button className="p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-center">
            <div className="text-2xl mb-2">📁</div>
            <div className="font-medium">Gestionar Categorías</div>
          </button>
          <button className="p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Ver Reportes</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-[#f7f2e7] rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              ✅
            </div>
            <div>
              <p className="font-medium text-[#2f4823]">Nuevo pedido recibido</p>
              <p className="text-sm text-[#779385]">Hace 2 minutos</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#f7f2e7] rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              👕
            </div>
            <div>
              <p className="font-medium text-[#2f4823]">Producto actualizado</p>
              <p className="text-sm text-[#779385]">Hace 1 hora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;