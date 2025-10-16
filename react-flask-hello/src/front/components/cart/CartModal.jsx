import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemsCount,
    clearCart 
  } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10000 : 0;
  const total = subtotal + shipping;
  const itemCount = getCartItemsCount();

  const handleCheckout = () => {
    onClose();
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

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
          <div>
            <h2 className="font-serif font-bold text-xl">
              Tu Carrito de compras
            </h2>
            <p className="text-[#779385] text-sm mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
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
              <h3 className="text-[#2f4823] font-semibold mb-2">Carrito Vacío</h3>
              <p className="text-[#779385] text-sm">
                Aún no has agregado prendas espirituales a tu carrito
              </p>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/shop-page');
                }}
                className="mt-4 bg-[#2f4823] text-white px-6 py-2 rounded-lg hover:bg-[#1f3219] transition-colors"
              >
                Explorar Tienda
              </button>
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
                      className="w-20 h-20 object-cover rounded-lg border border-[#779385]/20"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2f4823] text-sm leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[#779385] text-xs mt-1">Talla: {item.size}</p>
                      <p className="text-[#2f4823] font-bold mt-2">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="font-semibold text-[#2f4823] min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-[#779385] text-[#779385] flex items-center justify-center hover:bg-[#779385] hover:text-white transition-colors text-sm"
                        >
                          +
                        </button>
                        
                        {/* Eliminar */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 transition-colors text-xs font-medium"
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* Subtotal del item */}
                      <div className="text-right mt-2">
                        <span className="text-[#779385] text-sm">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </span>
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
                <div className="space-y-3">
                  <div className="flex justify-between text-[#2f4823]">
                    <span>Subtotal ({itemCount} items):</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#2f4823]">
                    <span>Envío:</span>
                    <span>{subtotal > 0 ? formatPrice(shipping) : 'Gratis'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-[#779385]/20 pt-3">
                    <span className="text-[#2f4823]">Total:</span>
                    <span className="text-[#2f4823]">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Mensaje de envío gratuito */}
                {subtotal > 0 && subtotal < 100000 && (
                  <div className="mt-3 p-3 bg-[#2f4823]/10 rounded-lg border border-[#2f4823]/20">
                    <p className="text-[#2f4823] text-sm text-center">
                      <strong>¡Faltan {formatPrice(100000 - subtotal)}</strong> para envío gratuito
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Botones de acción */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#779385]/20 space-y-3 bg-white/50">
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#2f4823] text-white py-4 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors shadow-sm"
            >
              Finalizar Pedido - {formatPrice(total)}
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={handleViewCart}
                className="flex-1 border border-[#2f4823] text-[#2f4823] py-3 rounded-lg font-semibold hover:bg-[#2f4823] hover:text-white transition-colors"
              >
                Ver Carrito
              </button>
              
              <button 
                onClick={clearCart}
                className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors"
              >
                Vaciar
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full border border-[#779385] text-[#779385] py-3 rounded-lg font-semibold hover:bg-[#779385] hover:text-white transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;