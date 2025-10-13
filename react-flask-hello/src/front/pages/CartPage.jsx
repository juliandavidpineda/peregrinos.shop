import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 10000 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-8xl mb-6 text-[#779385]">🛒</div>
            <h1 className="font-serif font-bold text-4xl text-[#2f4823] mb-4">
              Tu Carrito está Vacío
            </h1>
            <p className="text-xl text-[#779385] mb-8">
              Descubre nuestras prendas y llena tu carrito de Fe en acción
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/shop-page')}
                className="bg-[#2f4823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors text-lg"
              >
                Explorar la Tienda
              </button>
              <button 
                onClick={() => navigate('/')}
                className="border border-[#779385] text-[#779385] px-8 py-4 rounded-lg font-semibold hover:bg-[#779385] hover:text-white transition-colors text-lg"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif font-bold text-4xl text-[#2f4823] mb-4">
            Tu Carrito de Compras
          </h1>
          <p className="text-xl text-[#779385]">
            Revisa y modifica tus prendas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Lista de productos - Ocupa 2/3 en desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
              
              {/* Header de la lista */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#779385]/20">
                <h2 className="font-serif font-bold text-2xl text-[#2f4823]">
                  Productos ({cartItems.length})
                </h2>
                <span className="text-[#779385]">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)} unidades
                </span>
              </div>

              {/* Lista de items */}
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <CartItem item={item} />
                    {/* Línea separadora excepto para el último */}
                    {index < cartItems.length - 1 && (
                      <div className="border-t border-[#779385]/10 mt-6 pt-6"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón seguir comprando */}
              <div className="mt-8 pt-6 border-t border-[#779385]/20">
                <button 
                  onClick={() => navigate('/shop-page')}
                  className="w-full border border-[#779385] text-[#779385] py-4 rounded-xl font-semibold hover:bg-[#779385] hover:text-white transition-colors text-lg"
                >
                  ← Seguir Comprando
                </button>
              </div>
            </div>

            {/* Mensaje espiritual */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
              <p className="text-[#2f4823] italic text-lg">
                "Cada prenda en tu carrito es una oportunidad para vestir tu fe con amor y modestia"
              </p>
              <p className="text-[#779385] text-sm mt-2">Colosenses 3:14</p>
            </div>
          </div>

          {/* Resumen del pedido - Ocupa 1/3 en desktop */}
          <div className="lg:col-span-1">
            <CartSummary 
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              onCheckout={() => navigate('/checkout')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;