import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10000;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Limpiar carrito y redirigir a confirmación
    clearCart();
    navigate('/order-confirmation');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4 text-[#779385]">🛒</div>
          <h1 className="font-serif font-bold text-3xl text-[#2f4823] mb-4">Carrito Vacío</h1>
          <p className="text-[#779385] mb-8">Agrega productos a tu carrito antes de proceder al pago</p>
          <button 
            onClick={() => navigate('/shop-page')}
            className="bg-[#2f4823] text-white px-8 py-3 rounded-lg hover:bg-[#1f3219] transition-colors"
          >
            Ir a la Tienda
          </button>
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
            Finalizar Compra
          </h1>
          <p className="text-xl text-[#779385]">
            Completa tu información para recibir tus prendas bendecidas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Formulario de envío */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
            <h2 className="font-serif font-bold text-2xl text-[#2f4823] mb-6">
              Información de Envío
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Información personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2f4823] font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-[#2f4823] font-semibold mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion"
                  required
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                  placeholder="Dirección completa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    required
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                    placeholder="Ciudad"
                  />
                </div>

                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    required
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                    placeholder="Departamento"
                  />
                </div>

                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                    placeholder="Código postal"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#2f4823] text-white py-4 rounded-xl font-semibold hover:bg-[#1f3219] disabled:bg-gray-400 transition-colors text-lg mt-6"
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 h-fit sticky top-4">
            <h2 className="font-serif font-bold text-2xl text-[#2f4823] mb-6 text-center">
              Resumen del Pedido
            </h2>
            
            {/* Lista de productos */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-[#2f4823] text-sm">
                      {item.name}
                    </p>
                    <p className="text-[#779385] text-xs">
                      Talla: {item.size} • {item.quantity} und
                    </p>
                  </div>
                  <span className="font-semibold text-[#2f4823]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-3 border-t border-[#779385]/20 pt-4">
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

            {/* Mensaje espiritual */}
            <div className="mt-6 p-4 bg-[#f7f2e7] rounded-xl border border-[#779385]/20 text-center">
              <p className="text-sm text-[#2f4823] italic">
                "Tu compra será bendecida antes del envío"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;