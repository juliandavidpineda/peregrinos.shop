import React from 'react';

const CartSummary = ({ subtotal, shipping, total, onCheckout }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 sticky top-4">
      
      {/* Header */}
      <h2 className="font-serif font-bold text-2xl text-[#2f4823] mb-6 text-center">
        Resumen del Pedido
      </h2>

      {/* Detalles de precios */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-[#2f4823]">
          <span className="text-lg">Subtotal:</span>
          <span className="text-lg font-semibold">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center text-[#2f4823]">
          <div>
            <span className="text-lg">Envío:</span>
            <p className="text-[#779385] text-sm">A todo Colombia</p>
          </div>
          <span className="text-lg font-semibold">{formatPrice(shipping)}</span>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-[#779385]/20 pt-4"></div>

        {/* Total */}
        <div className="flex justify-between items-center text-[#2f4823] text-xl font-bold">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Botón de checkout */}
      <button 
        onClick={onCheckout}
        className="w-full bg-[#2f4823] text-white py-4 rounded-xl font-semibold hover:bg-[#1f3219] transition-colors text-lg mb-4 shadow-lg hover:shadow-xl"
      >
        Proceder al Pago
      </button>

      {/* Beneficios */}
      <div className="space-y-3 text-sm text-[#779385]">
        <div className="flex items-center gap-2">
          <span className="text-[#2f4823]">✓</span>
          <span>Envíos el siguiente día de la compra</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#2f4823]">✓</span>
          <span>Devoluciones gratuitas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#2f4823]">✓</span>
          <span>Pago seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#2f4823]">✓</span>
          <span>Prendas únicas</span>
        </div>
      </div>

    </div>
  );
};

export default CartSummary;