import React from 'react';
import ProductCard from './ProductCard';
import { getFirstValidImage } from '../../utils/imageHelper'; // ✅ IMPORTAR EL HELPER

const ProductGrid = ({ 
  products, 
  loading, 
  columns = 3,
  onProductClick,
  onAddToCart,
  emptyMessage = "No se encontraron productos" 
}) => {
  
  // ✅ PROCESAR PRODUCTOS CON IMÁGENES CORRECTAS
  const processedProducts = products.map(product => ({
    ...product,
    // Asegurar que las imágenes estén procesadas correctamente
    images: product.images || [],
    // Debug info para verificar
    _processed: true
  }));

  const gridClasses = {
    1: 'grid grid-cols-1 gap-6',
    2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  };

  if (loading) {
    return (
      <div className={gridClasses[columns]}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-[#779385]/20 overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!processedProducts || processedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-[#2f4823] mb-2">
          {emptyMessage}
        </h3>
        <p className="text-[#779385]">
          Intenta ajustar los filtros o explorar otras categorías
        </p>
      </div>
    );
  }

  // ✅ DEBUG: Verificar que las imágenes se procesen correctamente
  console.log('🛍️ ProductGrid - Productos procesados:', processedProducts.map(p => ({
    name: p.name,
    images: p.images,
    firstImage: p.images && p.images.length > 0 ? getFirstValidImage(p.images) : 'No image'
  })));

  return (
    <div className={gridClasses[columns]}>
      {processedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;