import React, { useState } from 'react';

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice,
  image, 
  category, 
  subcategory,
  rating = 0, 
  reviewCount = 0,
  isNew = false,
  isOnSale = false,
  features = [],
  onProductClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = isOnSale && originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
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

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-[#779385]/20 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:border-[#779385]/40 group"
      onClick={onProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-[#f7f2e7]">
        <img 
          src={image} 
          alt={name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-[#2f4823] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Nuevo
            </span>
          )}
          {isOnSale && (
            <span className="bg-[#779385] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-[#2f4823] px-2 py-1 rounded text-xs font-semibold border border-[#779385]/20">
            {category}
          </span>
        </div>

        {/* Overlay con features en hover */}
        {isHovered && features.length > 0 && (
          <div className="absolute inset-0 bg-[#2f4823]/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="text-white text-center">
              <h4 className="font-semibold mb-3">Características:</h4>
              <ul className="text-sm space-y-1">
                {features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <p className="text-xs mt-3 text-amber-200">Haz click para ver detalles</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs text-[#779385] uppercase font-semibold tracking-wide">
            {subcategory}
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
          <span className="text-xs text-[#779385]">({reviewCount})</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          {isOnSale && originalPrice && (
            <span className="text-sm text-[#779385] line-through font-medium">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-lg font-bold text-[#2f4823]">
            {formatPrice(price)}
          </span>
        </div>
        
        <button 
          className="w-full bg-[#2f4823] hover:bg-[#1f3219] text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-sm"
          onClick={(e) => {
            e.stopPropagation(); // Evita que se active el click del card
            onProductClick();
          }}
        >
          Ver Detalles
        </button>

        {/* Mensaje espiritual */}
        <div className="text-center mt-3">
          <span className="text-xs text-[#779385] italic">
            Haz click para más información
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;