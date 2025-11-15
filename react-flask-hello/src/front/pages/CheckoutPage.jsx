import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext'; // ✅ NUEVO
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { userService } from '../services/userService'; // ✅ NUEVO
import CheckoutSummary from '../components/checkout/CheckoutSummary';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user: authUser, isAuthenticated } = useUserAuth(); // ✅ NUEVO
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('shipping');
  const [orderId, setOrderId] = useState('');

  // ✅ NUEVO: Estados para direcciones
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: ''
  });

  useEffect(() => {
  console.log('🔍 useEffect PRINCIPAL ejecutado');
  console.log('🔍 isAuthenticated:', isAuthenticated);
  console.log('🔍 authUser:', authUser);
  
  if (isAuthenticated && authUser) {
    console.log('🔍 ✅ CONDICIÓN CUMPLIDA - Llamando loadUserAddresses');
    loadUserAddresses();
    
    // Pre-llenar email y nombre
    setFormData(prev => ({
      ...prev,
      email: authUser.email || '',
      nombre: authUser.name || ''
    }));
  }
}, [isAuthenticated, authUser]); // ✅ Solo depende de estos

  const loadUserAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await userService.getUserAddresses();
      if (response.success) {
        const addresses = response.addresses || [];
        setUserAddresses(addresses);

        const primaryAddress = addresses.find(addr => addr.is_primary);
        if (primaryAddress) {
          setSelectedAddressId(primaryAddress.id);
          setUseSavedAddress(true);

          // ✅ MOVER EL AUTO-COMPLETADO AQUÍ (después de establecer estados)
          setFormData(prev => ({
            ...prev,
            direccion: primaryAddress.address,
            ciudad: primaryAddress.city,
            departamento: primaryAddress.department,
            codigoPostal: primaryAddress.postal_code || '',
            telefono: primaryAddress.phone
          }));

          console.log('📍 Formulario auto-completado con dirección principal');
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // ✅ NUEVO: Cuando se selecciona una dirección guardada
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId) {
      const selectedAddress = userAddresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        setFormData(prev => ({
          ...prev,
          direccion: selectedAddress.address,
          ciudad: selectedAddress.city,
          departamento: selectedAddress.department,
          codigoPostal: selectedAddress.postal_code || '',
          telefono: selectedAddress.phone || prev.telefono
        }));
      }
    }
  };

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

  // ✅ NUEVO: Función de envío actualizada
  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
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
        total: total,
        // ✅ NUEVO: Incluir user_address_id si se usa dirección guardada
        user_address_id: useSavedAddress && selectedAddressId ? selectedAddressId : null
      };

      const result = await orderService.createOrder(orderData);
      const orderId = result.order.id;
      setOrderId(orderId);

      // Crear pago en Mercado Pago
      const paymentResult = await paymentService.createPayment(
        total,
        orderId,
        formData.email,
        formData.nombre,
        cartItems
      );

      console.log('🔗 Payment Result:', paymentResult);

      if (paymentResult.success) {
        localStorage.setItem('pending_order_id', orderId);
        window.open(
          paymentResult.sandbox_init_point || paymentResult.init_point || paymentResult.payment_url,
          '_blank'
        );
        setTimeout(() => {
          navigate(`/payment-processing?order_id=${orderId}`);
        }, 1000);
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

              {/* ✅ NUEVO: Selector de Direcciones Guardadas */}
              {isAuthenticated && userAddresses.length > 0 && (
                <div className="mb-6 p-4 bg-[#f7f2e7] rounded-2xl border border-[#779385]/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#2f4823]">🏠 Usar dirección guardada</h3>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSavedAddress}
                        onChange={(e) => setUseSavedAddress(e.target.checked)}
                        className="w-4 h-4 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                      />
                      <span className="text-sm text-[#2f4823]">Usar dirección guardada</span>
                    </label>
                  </div>

                  {useSavedAddress && (
                    <div className="space-y-3">
                      {loadingAddresses ? (
                        <div className="text-center py-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2f4823] mx-auto"></div>
                          <p className="text-sm text-[#779385] mt-2">Cargando direcciones...</p>
                        </div>
                      ) : (
                        <select
                          value={selectedAddressId}
                          onChange={(e) => handleAddressSelect(e.target.value)}
                          className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300 bg-white"
                        >
                          <option value="">Seleccionar dirección...</option>
                          {userAddresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.alias} {address.is_primary && '⭐'} - {address.address}, {address.city}
                            </option>
                          ))}
                        </select>
                      )}

                      {selectedAddressId && (
                        <div className="text-xs text-[#779385] bg-white p-3 rounded-lg border border-[#779385]/20">
                          <p>✅ Dirección seleccionada. Los campos se llenarán automáticamente.</p>
                          <p className="mt-1">Puedes modificar cualquier campo manualmente si lo necesitas.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Información para usuarios no logueados */}
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <span>💡</span>
                    <p className="text-sm">
                      <strong>¿Tienes una cuenta?</strong> Inicia sesión para usar tus direcciones guardadas y acelerar el checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}

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