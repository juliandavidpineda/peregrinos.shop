import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService'; // ✅ CAMBIADO
import CheckoutSummary from '../components/checkout/CheckoutSummary';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('shipping');
  const [orderId, setOrderId] = useState('');

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
  const shipping = subtotal > 200000 ? 0 : 10000;
  const total = subtotal + shipping;

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Crear orden en el backend
      const orderData = {
        customer_name: formData.nombre,
        customer_email: formData.email,
        customer_phone: formData.telefono,
        customer_address: formData.direccion,
        customer_city: formData.ciudad,
        customer_department: formData.departamento,
        customer_postal_code: formData.codigoPostal,
        items: cartItems,
        subtotal: subtotal,
        shipping: shipping,
        total: total
      };

      const result = await orderService.createOrder(orderData);
      setOrderId(result.order.id);

      // ✅ MIGRACIÓN COMPLETA: Mercado Pago en lugar de Wompi
      const paymentResult = await paymentService.createPayment(
        total,
        result.order.id,
        formData.email,
        formData.nombre,
        cartItems  // ✅ NUEVO: items para Mercado Pago
      );

      console.log('🔗 Payment Result:', paymentResult); // DEBUG

      // Reemplaza desde la línea 55 hasta 66 aproximadamente

      if (paymentResult.success) {
        // ✅ CORRECTO: Usar sandbox_init_point para pruebas
        if (paymentResult.sandbox_init_point) {
          console.log('🎯 Redirigiendo a Sandbox:', paymentResult.sandbox_init_point);
          window.location.href = paymentResult.sandbox_init_point;
        } else if (paymentResult.init_point) {
          console.log('🎯 Redirigiendo a Producción:', paymentResult.init_point);
          window.location.href = paymentResult.init_point;
        } else if (paymentResult.payment_url) {
          // Fallback para compatibilidad
          console.log('🎯 Redirigiendo a payment_url:', paymentResult.payment_url);
          window.location.href = paymentResult.payment_url;
        } else {
          throw new Error('No se recibió URL de pago válida');
        }
      } else {
        throw new Error(paymentResult.error || 'Error al crear el enlace de pago');
      }

    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Error al procesar el pedido: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] py-8 lg:py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl lg:text-6xl mb-4 text-[#779385]">🛒</div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[#2f4823] mb-4">Carrito Vacío</h1>
          <p className="text-[#779385] mb-6 lg:mb-8 text-sm lg:text-base">
            Agrega productos a tu carrito antes de proceder al pago
          </p>
          <button
            onClick={() => navigate('/shop-page')}
            className="bg-[#2f4823] text-white px-6 lg:px-8 py-3 rounded-lg hover:bg-[#1f3219] transition-colors text-sm lg:text-base"
          >
            Ir a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-4 lg:py-8">
      <div className="container mx-auto px-3 lg:px-4">

        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="font-serif font-bold text-2xl lg:text-4xl text-[#2f4823] mb-3 lg:mb-4">
            Finalizar Compra
          </h1>
          <p className="text-base lg:text-xl text-[#779385]">
            Completa tu información para recibir tu compra
          </p>

          {/* Steps Indicator */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2f4823] text-white">
                1
              </div>
              <div className="mx-2 text-[#779385]">→</div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">
                2
              </div>
            </div>
          </div>
          <p className="text-sm text-[#779385]">
            Paso 1 de 2: Información de envío → Paso 2: Pago en Mercado Pago
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">

          {/* Columna izquierda - Formulario */}
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-4 lg:p-6">
              <h2 className="font-serif font-bold text-xl lg:text-2xl text-[#2f4823] mb-4 lg:mb-6">
                Información de Envío
              </h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4 lg:space-y-6">

                {/* Información personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      required
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    required
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                    placeholder="Dirección completa"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                  <div>
                    <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      required
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                      placeholder="Ciudad"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                      Departamento *
                    </label>
                    <input
                      type="text"
                      name="departamento"
                      required
                      value={formData.departamento}
                      onChange={handleInputChange}
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                      placeholder="Departamento"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2f4823] font-semibold mb-2 text-sm lg:text-base">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white text-sm lg:text-base"
                      placeholder="Código postal"
                    />
                  </div>
                </div>

                {/* Botón de continuar a pago */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#2f4823] text-white py-3 lg:py-4 rounded-xl font-semibold hover:bg-[#1f3219] disabled:bg-gray-400 transition-colors text-sm lg:text-base mt-4"
                >
                  {isProcessing ? 'Procesando...' : 'Continuar al Pago en Mercado Pago'}
                </button>

                {/* Información de Mercado Pago */}
                <div className="mt-4 p-3 bg-[#f7f2e7] rounded-lg border border-[#779385]/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-[#2f4823]">
                    <span>🔒</span>
                    <span>Serás redirigido a Mercado Pago para completar el pago seguro</span>
                  </div>
                  <p className="text-xs text-[#779385] text-center mt-1">
                    Aceptamos Tarjetas, PSE, Efecty y más métodos de pago
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:sticky lg:top-4">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;