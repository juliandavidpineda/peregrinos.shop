import React from 'react';

const ReviewFilters = ({ filters, onFiltersChange, onClearFilters, stats }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-[#779385]/20 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          {/* Filtro por estado */}
          <div className="w-full md:w-48">
            <select
              value={filters.status || 'all'}
              onChange={(e) => onFiltersChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-[#779385]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#779385] focus:border-[#779385] text-[#2f4823]"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Solo pendientes</option>
              <option value="approved">Solo aprobados</option>
            </select>
          </div>

          {/* Estadísticas rápidas */}
          {stats && (
            <div className="flex gap-4 text-sm text-[#779385]">
              <span>Total: {stats.total}</span>
              <span>Pendientes: {stats.pending}</span>
              <span>Aprobados: {stats.approved}</span>
            </div>
          )}
        </div>

        {/* Botón limpiar filtros */}
        <div>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 border border-[#779385] text-[#779385] rounded-md hover:bg-[#f7f2e7] transition-colors whitespace-nowrap"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilters;