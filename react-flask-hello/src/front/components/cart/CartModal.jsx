import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10000;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal lateral */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#f7f2e7] shadow-xl overflow-y-auto">
        
        {/* Header */}
        <div className="bg-[#2f4823] text-white p-6 flex justify-between items-center">
          <h2 className="font-serif font-bold text-xl">
            Carrito de Compras ({cartItems.length})
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#779385] transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Lista de productos */}
        <div className="p-6 space-y-6 flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-[#779385]">🛒</div>
              <p className="text-[#2f4823]">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  {/* Producto */}
                  <div className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2f4823] text-sm">
                        {item.name}
                      </h3>
                      <p className="text-[#779385] text-xs mt-1">Talla: {item.size}</p>
                      <p className="text-[#2f4823] font-bold mt-2">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold text-[#2f4823] min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors"
                        >
                          +
                        </button>
                        
                        {/* Eliminar */}
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 transition-colors text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Línea separadora */}
                  {index < cartItems.length - 1 && (
                    <div className="border-t border-[#779385]/20 mt-6 pt-6"></div>
                  )}
                </div>
              ))}

              {/* Totales */}
              <div className="border-t border-[#779385]/30 pt-6 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[#2f4823]">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#2f4823]">
                    <span>Envío:</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-[#779385]/20 pt-3">
                    <span className="text-[#2f4823]">Total:</span>
                    <span className="text-[#2f4823]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Botones de acción - ACTUALIZADOS */}
        <div className="p-6 border-t border-[#779385]/20 space-y-3">
          <button 
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
            className="w-full bg-[#2f4823] text-white py-4 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors"
          >
            Finalizar Pedido
          </button>
          
          <button 
            onClick={() => {
              onClose();
              navigate('/cart');
            }}
            className="w-full border border-[#2f4823] text-[#2f4823] py-3 rounded-lg font-semibold hover:bg-[#2f4823] hover:text-white transition-colors"
          >
            Ver Carrito Completo
          </button>
          
          <button 
            onClick={onClose}
            className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg font-semibold hover:bg-[#779385] hover:text-white transition-colors"
          >
            Seguir Comprando
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartModal;