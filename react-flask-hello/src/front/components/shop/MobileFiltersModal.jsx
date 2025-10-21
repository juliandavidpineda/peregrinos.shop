import React from 'react';

const MobileFiltersModal = ({ 
  isOpen, 
  onClose, 
  categories = [], 
  selectedCategories = [], 
  onCategoryChange, 
  priceRange, 
  onPriceRangeChange,
  onClearFilters 
}) => {
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#779385]/20">
            <h2 className="font-serif font-bold text-[#2f4823] text-xl">Filtros</h2>
            <button 
              onClick={onClose}
              className="text-[#779385] hover:text-[#2f4823] text-2xl"
            >
              ×
            </button>
          </div>

          {/* Filtro por categorías - ACTUALIZADO CON LA NUEVA LÓGICA */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#2f4823] mb-4 flex items-center gap-2">
              <span className="text-[#779385]">●</span>
              Categorías
            </h3>
            <div className="space-y-3">
              {categories.map(category => (
                <label 
                  key={category.id} 
                  className={`flex items-center justify-between group cursor-pointer ${
                    category.count === 0 ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => onCategoryChange(category.id)}
                      disabled={category.count === 0}
                      className="w-4 h-4 text-[#2f4823] rounded border-[#779385] focus:ring-[#2f4823] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-[#2f4823] group-hover:text-[#1f3219] transition-colors">
                      {category.name}
                      {category.count === 0 && (
                        <span className="text-xs text-[#779385] ml-2">(próximamente)</span>
                      )}
                    </span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    category.count === 0 
                      ? 'text-[#779385] bg-gray-100' 
                      : 'text-[#779385] bg-[#f7f2e7]'
                  }`}>
                    {category.count}
                  </span>
                </label>
              ))}
              
              {categories.length === 0 && (
                <p className="text-sm text-[#779385] italic">
                  No hay categorías disponibles
                </p>
              )}
            </div>
          </div>

          {/* Filtro por precio */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#2f4823] mb-4 flex items-center gap-2">
              <span className="text-[#779385]">●</span>
              Rango de Precio
            </h3>
            <input
              type="range"
              min="0"
              max="800000"
              step="10000"
              value={priceRange}
              onChange={onPriceRangeChange}
              className="w-full h-2 bg-[#779385]/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2f4823]"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-[#779385]">{formatPrice(0)}</span>
              <span className="font-semibold text-[#2f4823] bg-[#f7f2e7] px-3 py-1 rounded-full text-sm">
                Hasta {formatPrice(priceRange)}
              </span>
              <span className="text-sm text-[#779385]">{formatPrice(800000)}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {(selectedCategories.length > 0 || priceRange < 300000) && (
              <button 
                className="w-full py-3 px-4 border border-[#779385] text-[#779385] rounded-lg hover:bg-[#f7f2e7] transition-colors font-medium"
                onClick={onClearFilters}
              >
                Limpiar Filtros
              </button>
            )}
            
            <button 
              className="w-full py-3 px-4 bg-[#2f4823] text-white rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
              onClick={onClose}
            >
              Aplicar Filtros
            </button>
          </div>

          {/* Mensaje espiritual */}
          <div className="mt-8 p-4 bg-[#f7f2e7] rounded-lg border border-[#779385]/10">
            <p className="text-sm text-[#2f4823] text-center italic">
              "Que todo lo que hagas, lo hagas con amor"
            </p>
            <p className="text-xs text-[#779385] text-center mt-1">1 Corintios 16:14</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFiltersModal;