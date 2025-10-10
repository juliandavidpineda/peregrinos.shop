import React from 'react';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ currentProduct, allProducts }) => {
  const navigate = useNavigate();
  
  const relatedProducts = allProducts
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 3);

  if (relatedProducts.length === 0) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-6">
      <h3 className="font-serif font-bold text-2xl text-[#2f4823] mb-6 text-center">
        Otras Prendas que te pueden gustar
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-[#f7f2e7] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-[#2f4823] mb-2 line-clamp-2">
                {product.name}
              </h4>
              <p className="text-lg font-bold text-[#2f4823]">
                {formatPrice(product.price)}
              </p>
              <button className="w-full mt-3 bg-[#2f4823] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#1f3219] transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;