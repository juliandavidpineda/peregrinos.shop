import React, { useState } from 'react';

const ProductFilters = ({ 
  onSortChange, 
  onSearch, 
  totalProducts = 0,
  sortOptions = [
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating-desc', label: 'Mejor Valorados' }
  ] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="bg-[#f7f2e7] rounded-lg shadow-sm border border-[#779385]/20 p-6 mb-8">
      
      {/* Header con contador */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-serif font-semibold text-[#2f4823] text-xl">
            Nuestra Colección
          </h2>
          <p className="text-[#779385] text-sm mt-1">
            {totalProducts > 0 
              ? `${totalProducts} prenda${totalProducts !== 1 ? 's' : ''} únicas${totalProducts !== 1 ? ' :-)' : ''}`
              : 'Buscando prendas...'
            }
          </p>
        </div>
        
        {/* Versículo */}
        <div className="text-xs text-[#779385] italic bg-white px-3 py-2 rounded-lg border border-[#779385]/10">
          "Vístanse de amor" — Colosenses 3:14
        </div>
      </div>

      {/* Controles de filtro */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        
        {/* Búsqueda */}
        <div className="w-full lg:flex-1">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre o tipo de prenda..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all duration-200 bg-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#779385]">
              🔍
            </div>
          </div>
        </div>

        {/* Ordenamiento */}
        <div className="w-full lg:w-64">
          <div className="relative">
            <select 
              onChange={(e) => onSortChange(e.target.value)} 
              className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all duration-200 bg-white appearance-none"
            >
              <option value="">Ordenar por</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#779385]">
              <span>▼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;