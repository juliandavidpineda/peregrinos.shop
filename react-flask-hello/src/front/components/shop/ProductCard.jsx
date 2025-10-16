import React, { useState } from 'react';

const ProductCard = ({ 
  product, // ✅ Recibir el producto completo como objeto
  onProductClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Desestructurar con valores por defecto
  const {
    id,
    name, 
    price, 
    original_price, 
    images = [], 
    category, 
    subcategory,
    rating = 0, 
    review_count = 0,
    is_new = false,
    is_on_sale = false,
    features = [],
    in_stock = true
  } = product || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función mejorada para obtener imagen
  const getMainImage = () => {
    console.log('🖼️ ProductCard - Imágenes para:', name, images);
    
    // Verificar si hay imágenes válidas
    if (images && 
        Array.isArray(images) && 
        images.length > 0 && 
        images[0] && 
        images[0].trim() !== '') {
      return images[0];
    }
    
    // Imagen por defecto
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';
  };

  const mainImage = getMainImage();
  const hasRealImage = mainImage !== 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';

  const discountPercentage = is_on_sale && original_price 
    ? Math.round(((original_price - price) / original_price) * 100) 
    : 0;

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-amber-500">★</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };

  const handleCardClick = () => {
    if (in_stock && onProductClick) {
      onProductClick(id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md group ${
        in_stock ? 'border-[#779385]/20 hover:border-[#779385]/40' : 'border-red-200 opacity-70'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-[#f7f2e7]">
        <img 
          src={mainImage} 
          alt={name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${!in_stock ? 'grayscale' : ''}`}
          onError={(e) => {
            console.log('❌ Error cargando imagen para:', name);
            e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';
          }}
        />
        
        {/* Badge para imágenes por defecto */}
        {!hasRealImage && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full z-10">
            Sin imagen
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {is_new && (
            <span className="bg-[#2f4823] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Nuevo
            </span>
          )}
          {is_on_sale && (
            <span className="bg-[#779385] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {!in_stock && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Agotado
            </span>
          )}
        </div>

        {/* Category badge */}
        {category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-[#2f4823] px-2 py-1 rounded text-xs font-semibold border border-[#779385]/20">
              {category}
            </span>
          </div>
        )}

        {/* Overlay con features en hover */}
        {isHovered && in_stock && features && features.length > 0 && (
          <div className="absolute inset-0 bg-[#2f4823]/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="text-white text-center">
              <h4 className="font-semibold mb-3">Características:</h4>
              <ul className="text-sm space-y-1">
                {features.slice(0, 3).map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <p className="text-xs mt-3 text-amber-200">Haz click para ver detalles</p>
            </div>
          </div>
        )}

        {/* Overlay para productos agotados */}
        {!in_stock && (
          <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="text-white text-center">
              <h4 className="font-semibold mb-2">Producto Agotado</h4>
              <p className="text-sm">Próximamente disponible</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs text-[#779385] uppercase font-semibold tracking-wide">
            {subcategory || 'Prenda'}
          </div>
          <div className="text-xs text-[#2f4823] font-semibold">
            {category}
          </div>
        </div>
        
        <h3 className="font-semibold text-[#2f4823] mb-2 line-clamp-2 group-hover:text-[#1f3219] transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {renderStars()}
          <span className="text-xs text-[#779385]">({review_count})</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          {is_on_sale && original_price && (
            <span className="text-sm text-[#779385] line-through font-medium">
              {formatPrice(original_price)}
            </span>
          )}
          <span className={`text-lg font-bold ${is_on_sale ? 'text-red-600' : 'text-[#2f4823]'}`}>
            {formatPrice(price)}
          </span>
        </div>
        
        <button 
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-sm ${
            in_stock 
              ? 'bg-[#2f4823] hover:bg-[#1f3219] text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          disabled={!in_stock}
        >
          {in_stock ? 'Ver Detalles' : 'Agotado'}
        </button>

        {/* Mensaje espiritual */}
        <div className="text-center mt-3">
          <span className="text-xs text-[#779385] italic">
            {in_stock ? 'Haz click para más información' : 'Próximamente disponible'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;