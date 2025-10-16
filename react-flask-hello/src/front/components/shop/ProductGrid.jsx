import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  emptyMessage = "No se encontraron prendas",
  columns = 3
}) => {
  const navigate = useNavigate();
  
  // Clases responsivas para columnas
  const gridColumns = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto"></div>
          <p className="mt-4 text-[#779385]">Cargando prendas espirituales...</p>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#779385]">🙏</div>
          <h3 className="text-xl font-semibold text-[#2f4823] mb-2">{emptyMessage}</h3>
          <p className="text-[#779385]">Intenta ajustar los filtros o busca otros términos</p>
        </div>
      </div>
    );
  }

  // Función para navegar al detalle del producto
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className={`grid gap-6 ${gridColumns[columns] || gridColumns[3]}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product} 
          onProductClick={() => handleProductClick(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;