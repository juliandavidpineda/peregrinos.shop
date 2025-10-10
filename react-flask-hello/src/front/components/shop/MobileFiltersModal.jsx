import React from 'react';

const MobileFiltersModal = ({ 
  isOpen, 
  onClose, 
  categories = [],
  products = [],
  selectedCategories = [],
  onCategoryChange,
  priceRange,
  onPriceRangeChange 
}) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Panel lateral */}
      <div className="absolute right-0 top-0 h-full w-80 bg-[#f7f2e7] shadow-xl overflow-y-auto">
        
        {/* Header */}
        <div className="bg-[#2f4823] text-white p-4 flex justify-between items-center">
          <h3 className="font-serif font-semibold text-lg">Filtros</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#779385] transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-6">
          
          {/* Categorías */}
          <div>
            <h4 className="font-semibold text-[#2f4823] mb-3 flex items-center gap-2">
              <span className="text-[#779385]">●</span>
              Categorías
            </h4>
            <div className="space-y-3">
              {categories.map(category => (
                <label key={category.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => onCategoryChange(category.name)}
                      className="w-4 h-4 text-[#2f4823] rounded border-[#779385] focus:ring-[#2f4823]"
                    />
                    <span className="text-[#2f4823] group-hover:text-[#1f3219] transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm text-[#779385] bg-white px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de Prenda */}
          <div>
            <h4 className="font-semibold text-[#2f4823] mb-3 flex items-center gap-2">
              <span className="text-[#779385]">●</span>
              Tipo de Prenda
            </h4>
            <div className="space-y-3">
              {products.map(product => (
                <label key={product.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#2f4823] rounded border-[#779385] focus:ring-[#2f4823]"
                    />
                    <span className="text-[#2f4823] text-sm group-hover:text-[#1f3219] transition-colors">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm text-[#779385] bg-white px-2 py-1 rounded-full">
                    {product.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <h4 className="font-semibold text-[#2f4823] mb-3 flex items-center gap-2">
              <span className="text-[#779385]">●</span>
              Rango de Precio
            </h4>
            <input
              type="range"
              min="120000"
              max="300000"
              step="10000"
              value={priceRange}
              onChange={onPriceRangeChange}
              className="w-full h-2 bg-[#779385]/30 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2f4823]"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-[#779385]">{formatPrice(120000)}</span>
              <span className="font-semibold text-[#2f4823] bg-white px-3 py-1 rounded-full text-sm">
                Hasta {formatPrice(priceRange)}
              </span>
              <span className="text-sm text-[#779385]">{formatPrice(300000)}</span>
            </div>
          </div>

          {/* Botón aplicar */}
          <button 
            onClick={onClose}
            className="w-full bg-[#2f4823] text-white py-3 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors"
          >
            Aplicar Filtros
          </button>

          {/* Mensaje espiritual */}
          <div className="p-4 bg-white rounded-lg border border-[#779385]/10">
            <p className="text-sm text-[#2f4823] text-center italic">
              "Vístanse de amor"
            </p>
            <p className="text-xs text-[#779385] text-center mt-1">Colosenses 3:14</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFiltersModal;