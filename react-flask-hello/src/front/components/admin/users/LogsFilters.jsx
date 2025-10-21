import React from 'react';

const LogsFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          {/* Filtro por búsqueda */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar en descripciones..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro por acción */}
          <div className="w-full md:w-48">
            <select
              value={filters.action || ''}
              onChange={(e) => onFiltersChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las acciones</option>
              <option value="user_created">Usuario Creado</option>
              <option value="user_updated">Usuario Actualizado</option>
              <option value="user_deleted">Usuario Eliminado</option>
              <option value="user_status_changed">Estado Cambiado</option>
              <option value="login">Inicio de Sesión</option>
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        <div>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsFilters;