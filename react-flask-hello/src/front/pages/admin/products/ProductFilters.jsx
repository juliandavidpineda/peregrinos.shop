import React, { useState, useEffect } from 'react';

const ProductFilters = ({ products, categories, onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    inStock: '',
    isOnSale: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Filtro de categoría
    if (filters.category) {
      filtered = filtered.filter(product => product.category_id === filters.category);
    }

    // Filtro de stock
    if (filters.inStock === 'true') {
      filtered = filtered.filter(product => product.in_stock && product.stock_quantity > 0);
    } else if (filters.inStock === 'false') {
      filtered = filtered.filter(product => !product.in_stock || product.stock_quantity === 0);
    }

    // Filtro de ofertas
    if (filters.isOnSale === 'true') {
      filtered = filtered.filter(product => product.is_on_sale);
    }

    onFilterChange(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      inStock: '',
      isOnSale: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2f4823]">
          🔍 Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#779385] hover:text-[#2f4823] transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Buscar
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Nombre del producto..."
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Disponibilidad
          </label>
          <select
            value={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.value)}
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">En stock</option>
            <option value="false">Sin stock</option>
          </select>
        </div>

        {/* Ofertas */}
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Estado
          </label>
          <select
            value={filters.isOnSale}
            onChange={(e) => handleFilterChange('isOnSale', e.target.value)}
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">En oferta</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;