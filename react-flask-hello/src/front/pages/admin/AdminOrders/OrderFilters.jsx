import React, { useState, useEffect } from 'react';

const OrderFilters = ({ orders, onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  const applyFilters = () => {
    let filtered = [...orders];

    // Filtro por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filtro por fecha
    if (filters.dateRange !== 'all') {
      const today = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        
        switch (filters.dateRange) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.customer_name.toLowerCase().includes(searchLower) ||
        order.customer_email.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower)
      );
    }

    onFilterChange(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#779385]/20 p-6">
      <h3 className="font-semibold text-lg text-[#2f4823] mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-[#779385] mb-2">
            Estado
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border border-[#779385]/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f4823]"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Filtro por fecha */}
        <div>
          <label className="block text-sm font-medium text-[#779385] mb-2">
            Fecha
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full border border-[#779385]/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f4823]"
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-[#779385] mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Cliente, email o ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full border border-[#779385]/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f4823]"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;