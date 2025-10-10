import React from 'react';

const ProductInfo = ({ 
  product, 
  selectedSize, 
  onSizeChange, 
  quantity, 
  onQuantityChange, 
  onAddToCart, 
  onBuyNow 
}) => {
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-amber-500 text-lg">★</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-lg">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-6 sticky top-4">
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        {product.isNew && (
          <span className="bg-[#2f4823] text-white px-3 py-1 rounded-full text-xs font-bold">
            Nuevo
          </span>
        )}
        {product.isOnSale && (
          <span className="bg-[#779385] text-white px-3 py-1 rounded-full text-xs font-bold">
            Oferta
          </span>
        )}
        <span className="bg-[#f7f2e7] text-[#2f4823] px-3 py-1 rounded-full text-xs font-bold border border-[#779385]/20">
          {product.category}
        </span>
      </div>

      {/* Nombre */}
      <h1 className="font-serif font-bold text-3xl text-[#2f4823] mb-2">
        {product.name}
      </h1>
      
      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        {renderStars(product.rating)}
        <span className="text-[#779385] text-sm">({product.reviewCount} reseñas)</span>
      </div>

      {/* Precio */}
      <div className="mb-6">
        {product.isOnSale && product.originalPrice && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl text-[#779385] line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
              Ahorras {formatPrice(product.originalPrice - product.price)}
            </span>
          </div>
        )}
        <span className="text-3xl font-bold text-[#2f4823]">
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Selector de talla */}
      <div className="mb-6">
        <label className="block text-[#2f4823] font-semibold mb-3">
          Talla
          <span className="text-[#779385] text-sm font-normal ml-2">
            (Selecciona una talla)
          </span>
        </label>
        
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                selectedSize === size
                  ? 'border-[#2f4823] bg-[#2f4823] text-white'
                  : 'border-[#779385] text-[#2f4823] hover:border-[#2f4823] hover:bg-[#f7f2e7]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de cantidad */}
      <div className="mb-6">
        <label className="block text-[#2f4823] font-semibold mb-2">
          Cantidad
        </label>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold text-[#2f4823]">
            {quantity}
          </span>
          <button 
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-10 h-10 rounded-lg border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3 mb-6">
        <button 
          onClick={onAddToCart}
          disabled={!product.inStock}
          className="w-full bg-[#2f4823] text-white py-4 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
        </button>
        
        <button 
          onClick={onBuyNow}
          disabled={!product.inStock}
          className="w-full bg-[#779385] text-white py-4 rounded-lg font-semibold hover:bg-[#5a7568] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Comprar Ahora
        </button>
      </div>

      {/* Mensaje espiritual */}
      <div className="p-4 bg-[#f7f2e7] rounded-lg border border-[#779385]/20 text-center">
        <p className="text-sm text-[#2f4823] italic">
          "Cada compra apoya nuestra misión espiritual"
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;