import React from 'react';
import MobileFiltersModal from './MobileFiltersModal';

const ShopSidebar = ({
  categories = [],
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  selectedCategories = [],
  isMobileModalOpen = false,
  onMobileModalToggle
}) => {

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    // Limpiar categorías seleccionadas
    selectedCategories.forEach(categoryId => {
      onCategoryChange(categoryId);
    });
    // Resetear precio al máximo
    onPriceRangeChange({ target: { value: 800000 } });
  };

  return (
    <>
      {/* Botón para abrir filtros en móvil */}
      <button
        onClick={onMobileModalToggle}
        className="lg:hidden flex items-center gap-2 bg-[#2f4823] text-white px-4 py-3 rounded-lg hover:bg-[#1f3219] transition-colors w-full justify-center mb-4"
      >
        <span>☰</span>
        Filtros y Categorías
      </button>

      {/* Sidebar normal - oculto en móvil */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-[#779385]/20 p-6 sticky top-4">

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-[#779385]/20">
          <h2 className="font-serif font-bold text-[#2f4823] text-xl">Filtros</h2>
          <p className="text-sm text-[#779385] mt-1">Refina tu búsqueda</p>
        </div>

        {/* Filtro por categorías - CORREGIDO */}
        <div className="mb-8">
          <h3 className="font-semibold text-[#2f4823] mb-4 flex items-center gap-2">
            <span className="text-[#779385]">●</span>
            Categorías
          </h3>
          <div className="space-y-3">
            {categories.map(category => (
              <label key={category.id} className={`flex items-center justify-between group cursor-pointer ${category.count === 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => onCategoryChange(category.id)}
                    disabled={category.count === 0} // Opcional: deshabilitar si no hay productos
                    className="w-4 h-4 text-[#2f4823] rounded border-[#779385] focus:ring-[#2f4823] focus:ring-2"
                  />
                  <span className="text-[#2f4823] group-hover:text-[#1f3219] transition-colors">
                    {category.name}
                    {category.count === 0 && (
                      <span className="text-xs text-[#779385] ml-2">(próximamente)</span>
                    )}
                  </span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${category.count === 0
                    ? 'text-[#779385] bg-gray-100'
                    : 'text-[#779385] bg-[#f7f2e7]'
                  }`}>
                  {category.count}
                </span>
              </label>
            ))}

            {/* Mensaje si no hay categorías */}
            {categories.length === 0 && (
              <p className="text-sm text-[#779385] italic">
                No hay categorías disponibles
              </p>
            )}
          </div>
        </div>

        {/* Filtro por tipo de producto - OPCIONAL */}
        <div className="mb-8">
          <h3 className="font-semibold text-[#2f4823] mb-4 flex items-center gap-2">
            <span className="text-[#779385]">●</span>
            Tipo de Prenda
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-[#779385] italic">
              Próximamente más filtros...
            </div>
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

        {/* Botón limpiar filtros */}
        {(selectedCategories.length > 0 || priceRange < 800000) && (
          <button
            className="w-full py-2 px-4 border border-[#779385] text-[#779385] rounded-lg hover:bg-[#f7f2e7] transition-colors font-medium"
            onClick={handleClearFilters}
          >
            Limpiar Filtros
          </button>
        )}

        {/* Mensaje espiritual */}
        <div className="mt-8 p-4 bg-[#f7f2e7] rounded-lg border border-[#779385]/10">
          <p className="text-sm text-[#2f4823] text-center italic">
            "Que todo lo que hagas, lo hagas con amor"
          </p>
          <p className="text-xs text-[#779385] text-center mt-1">1 Corintios 16:14</p>
        </div>
      </div>

      {/* Modal para móvil */}
      <MobileFiltersModal
        isOpen={isMobileModalOpen}
        onClose={onMobileModalToggle}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
        onClearFilters={handleClearFilters}
      />
    </>
  );
};

export default ShopSidebar;