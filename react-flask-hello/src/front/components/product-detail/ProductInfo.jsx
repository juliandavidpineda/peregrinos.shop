import React from 'react';
import { useCart } from '../../context/CartContext';

const ProductInfo = ({ 
  product, 
  selectedSize, 
  onSizeChange, 
  quantity, 
  onQuantityChange, 
  onBuyNow 
}) => {
  
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    if (!product.in_stock) {
      alert('Este producto está agotado');
      return;
    }

    addToCart(product, selectedSize, quantity);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
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
        {product.is_new && (
          <span className="bg-[#2f4823] text-white px-3 py-1 rounded-full text-xs font-bold">
            Nuevo
          </span>
        )}
        {product.is_on_sale && (
          <span className="bg-[#779385] text-white px-3 py-1 rounded-full text-xs font-bold">
            Oferta
          </span>
        )}
        {!product.in_stock && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Agotado
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
        <span className="text-[#779385] text-sm">({product.review_count || 0} reseñas)</span>
      </div>

      {/* Precio */}
      <div className="mb-6">
        {product.is_on_sale && product.original_price && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl text-[#779385] line-through">
              {formatPrice(product.original_price)}
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
              Ahorras {formatPrice(product.original_price - product.price)}
            </span>
          </div>
        )}
        <span className={`text-3xl font-bold ${product.is_on_sale ? 'text-red-600' : 'text-[#2f4823]'}`}>
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
          {(product.sizes || []).map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              disabled={!product.in_stock}
              className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                selectedSize === size
                  ? 'border-[#2f4823] bg-[#2f4823] text-white'
                  : product.in_stock
                    ? 'border-[#779385] text-[#2f4823] hover:border-[#2f4823] hover:bg-[#f7f2e7]'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              {size}
            </button>
          ))}
          
          {/* Mensaje si no hay tallas definidas */}
          {(product.sizes || []).length === 0 && (
            <p className="text-[#779385] text-sm italic">
              Talla única
            </p>
          )}
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
            disabled={!product.in_stock}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
              product.in_stock
                ? 'border-[#779385] text-[#779385] hover:bg-[#779385] hover:text-white'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className={`w-12 text-center font-semibold ${
            product.in_stock ? 'text-[#2f4823]' : 'text-gray-400'
          }`}>
            {quantity}
          </span>
          <button 
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={!product.in_stock}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
              product.in_stock
                ? 'border-[#779385] text-[#779385] hover:bg-[#779385] hover:text-white'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
        
        {/* Stock disponible */}
        {product.in_stock && product.stock_quantity && (
          <p className="text-sm text-[#779385] mt-2">
            {product.stock_quantity} unidades disponibles
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="space-y-3 mb-6">
        <button 
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${
            product.in_stock
              ? 'bg-[#2f4823] text-white hover:bg-[#1f3219]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.in_stock ? 'Agregar al Carrito' : 'Agotado'}
        </button>
        
        <button 
          onClick={onBuyNow}
          disabled={!product.in_stock}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${
            product.in_stock
              ? 'bg-[#779385] text-white hover:bg-[#5a7568]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
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