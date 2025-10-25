import React from 'react';

const ClientUserFilters = ({ filters, onFiltersChange, onRefresh }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Email o nombre..."
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        {/* Terms Accepted Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Términos
          </label>
          <select
            value={filters.terms_accepted}
            onChange={(e) => handleFilterChange('terms_accepted', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="accepted">Aceptados</option>
            <option value="not_accepted">No Aceptados</option>
          </select>
        </div>

        {/* Marketing Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marketing
          </label>
          <select
            value={filters.marketing_emails}
            onChange={(e) => handleFilterChange('marketing_emails', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-[#2f4823] focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="accepted">Aceptado</option>
            <option value="not_accepted">No Aceptado</option>
          </select>
        </div>

        {/* Refresh Button */}
        <div>
          <button
            onClick={onRefresh}
            className="w-full bg-[#2f4823] hover:bg-[#1f3723] text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientUserFilters;