import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const navigate = useNavigate();
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 group">
      
      {/* Imagen del producto */}
      <div 
        className="flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/product/${item.productId}`)}
      >
        <img 
          src={item.image} 
          alt={item.name}
          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        
        {/* Nombre y precio */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <h3 
            className="font-semibold text-[#2f4823] text-lg cursor-pointer hover:text-[#1f3219] transition-colors line-clamp-2"
            onClick={() => navigate(`/product/${item.productId}`)}
          >
            {item.name}
          </h3>
          <p className="text-xl font-bold text-[#2f4823] whitespace-nowrap">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Detalles (talla) */}
        <p className="text-[#779385] text-sm mb-4">
          Talla: <span className="font-semibold">{item.size}</span>
        </p>

        {/* Controles de cantidad y eliminar */}
        <div className="flex items-center justify-between">
          
          {/* Selector de cantidad */}
          <div className="flex items-center gap-3">
            <span className="text-[#2f4823] font-medium text-sm">Cantidad:</span>
            <div className="flex items-center gap-2 bg-[#f7f2e7] rounded-lg p-1">
              <button 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-8 h-8 rounded-lg border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors text-sm"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-[#2f4823]">
                {item.quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-8 h-8 rounded-lg border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Subtotal y eliminar */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#2f4823] text-lg">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
              title="Eliminar producto"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;