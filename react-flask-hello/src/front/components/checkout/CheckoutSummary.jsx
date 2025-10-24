import React from 'react';

const CheckoutSummary = ({ cartItems, subtotal, shipping, total }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-4 lg:p-6">
      <h2 className="font-serif font-bold text-xl lg:text-2xl text-[#2f4823] mb-4 lg:mb-6 text-center">
        Resumen del Pedido
      </h2>
      
      {/* Lista de productos */}
      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6 max-h-60 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#2f4823] text-sm truncate">
                {item.name}
              </p>
              <p className="text-[#779385] text-xs">
                Talla: {item.size} • {item.quantity} und
              </p>
              <p className="text-[#2f4823] text-sm font-medium">
                {formatPrice(item.price)} c/u
              </p>
            </div>
            <span className="font-semibold text-[#2f4823] text-sm lg:text-base whitespace-nowrap">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="space-y-2 lg:space-y-3 border-t border-[#779385]/20 pt-4">
        <div className="flex justify-between text-[#2f4823] text-sm lg:text-base">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#2f4823] text-sm lg:text-base">
          <span>Envío:</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-bold text-base lg:text-lg border-t border-[#779385]/20 pt-2 lg:pt-3">
          <span className="text-[#2f4823]">Total:</span>
          <span className="text-[#2f4823]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Información de envío */}
      <div className="mt-4 p-3 bg-[#f7f2e7] rounded-lg">
        <p className="text-xs text-[#2f4823] text-center">
          🚚 Envío gratis en órdenes mayores a $200.000
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;