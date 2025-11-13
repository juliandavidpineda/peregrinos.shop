import React, { useState } from 'react';
import logo_blanco from '../assets/img/branding/logo_blanco.png'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout, loading } = useUserAuth();

  // Calcular el total de unidades (suma de cantidades)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    navigate('/mi-perfil');
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <nav className="bg-[#f7f2e7] border-b border-[#2f4823]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo placeholder */}
            <div className="flex-shrink-0">
              <div className="bg-[#2f4823] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-2xl">
                <img
                  src={logo_blanco}
                  alt="Peregrinos Shop"
                  className='h-8 sm:h-10 w-auto'
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#f7f2e7] border-b border-[#2f4823]/20 sticky top-0 z-50 transition-all duration-300 shadow-sm rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-[#2f4823] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={logo_blanco}
                alt="Peregrinos Shop"
                className='h-8 sm:h-10 w-auto cursor-pointer'
                onClick={() => navigate('/')}
              />
            </div>
          </div>

          {/* Menú Desktop - OCULTO EN MÓVIL */}
          <div className="hidden lg:flex space-x-2 xl:space-x-4">
            {[
              { name: 'Inicio', path: '/' },
              { name: 'Tienda', path: '/shop-page' },
              { name: 'Nuestra Historia', path: '/about' },
              { name: 'Santoral', path: '/santoral' },
              { name: 'Contacto', path: '/contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium transition-all duration-300 relative group px-3 py-2 rounded-xl text-sm xl:text-base"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#2f4823] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
            ))}
          </div>

          {/* Iconos - VERSIÓN RESPONSIVE */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Botón Búsqueda - OCULTO EN MÓVIL PEQUEÑO */}
            <button className="hidden sm:flex text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-2 sm:p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent">
              <span className="text-lg">🔍</span>
            </button>

            {/* Botón del Carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-2 sm:p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent relative group"
            >
              <span className="text-lg">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#779385] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold transform group-hover:bg-white group-hover:text-[#779385] group-hover:border group-hover:border-[#779385] transition-all duration-300 shadow-lg">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Usuario Logueado */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-105 transition-all duration-300 p-1 sm:p-2 rounded-2xl border border-[#2f4823]/30 hover:border-transparent"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        console.error('❌ Error cargando imagen de Google:', user.picture);
                        // Fallback: mostrar inicial
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}

                  {/* Fallback: Inicial si falla la imagen */}
                  {(!user.picture || user.picture === '') && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2f4823] text-white rounded-full flex items-center justify-center font-semibold text-sm border-2 border-white shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium max-w-16 lg:max-w-24 truncate">
                    {user.name ? user.name.split(' ')[0] : user.email.split('@')[0]}
                  </span>
                </button>

                {/* Menú desplegable del usuario - ACTUALIZADO */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-[#2f4823]/20 py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#2f4823]/10">
                      <p className="text-sm font-semibold text-[#2f4823] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    
                    {/* ✅ NUEVA OPCIÓN: Mi Perfil */}
                    <button
                      onClick={handleProfile}
                      className="block w-full text-left px-4 py-2 text-sm text-[#2f4823] hover:bg-[#2f4823] hover:text-white transition-colors duration-200"
                    >
                      👤 Mi Perfil
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-[#2f4823]/10"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Botón Iniciar Sesión - SOLO TEXTO EN MÓVIL, COMPLETO EN DESKTOP */
              <button
                onClick={handleLogin}
                className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 px-2 sm:px-3 lg:px-4 py-2 rounded-2xl border border-[#2f4823]/30 hover:border-transparent font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Botón Menú Mobile - SOLO EN MÓVIL */}
            <button
              className="lg:hidden text-[#2f4823] hover:bg-[#2f4823] hover:text-white p-2 sm:p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Menú Mobile - ACTUALIZADO */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-2xl mt-2 border border-[#2f4823]/20 shadow-lg">
            {[
              { name: 'Inicio', path: '/' },
              { name: 'Tienda', path: '/shop-page' },
              { name: 'Nuestra Historia', path: '/about' },
              { name: 'Santoral', path: '/santoral' },
              { name: 'Contacto', path: '/contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 mx-2 text-sm sm:text-base"
              >
                {item.name}
              </button>
            ))}

            {/* ✅ NUEVA OPCIÓN EN MÓVIL: Mi Perfil (solo si está logueado) */}
            {isAuthenticated && user && (
              <button
                onClick={handleProfile}
                className="block w-full text-left text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 mx-2 text-sm sm:text-base border-t border-[#2f4823]/10"
              >
                👤 Mi Perfil
              </button>
            )}

            {/* Búsqueda en menú móvil */}
            <button className="block w-full text-left text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 mx-2 text-sm sm:text-base border-t border-[#2f4823]/10">
              🔍 Buscar
            </button>

            {/* Opción de login/cierre en móvil */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 mx-2 text-sm sm:text-base border-t border-[#2f4823]/10"
              >
                🚪 Cerrar Sesión
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="block w-full text-left text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 mx-2 text-sm sm:text-base border-t border-[#2f4823]/10"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};