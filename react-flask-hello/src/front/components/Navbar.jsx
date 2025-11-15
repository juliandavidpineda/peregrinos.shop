import React, { useState, useEffect, useRef } from 'react';
import logo_blanco from '../assets/img/branding/logo_blanco.png'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { searchService } from '../services/searchService';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    products: [],
    saints: [],
    suggestions: []
  });
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const { cartItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout, loading } = useUserAuth();

  const searchRef = useRef(null);

  // Calcular el total de unidades
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchResults({ products: [], saints: [], suggestions: [] });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults({ products: [], saints: [], suggestions: [] });
        return;
      }

      setIsSearching(true);
      try {
        const result = await searchService.quickSearch(searchTerm);
        if (result.success) {
          setSearchResults({
            products: result.products || [],
            saints: result.saints || [],
            suggestions: result.suggestions || []
          });
        }
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setSearchResults({ products: [], saints: [], suggestions: [] });
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop-page?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm('');
      setSearchResults({ products: [], saints: [], suggestions: [] });
    }
  };

  // Manejar selección de santo
  const handleSaintClick = (saintId) => {
    navigate(`/saint/${saintId}`);
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults({ products: [], saints: [], suggestions: [] });
  };

  // Manejar selección de sugerencia
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.startsWith('Categoría: ')) {
      const category = suggestion.replace('Categoría: ', '');
      navigate(`/shop-page?category=${encodeURIComponent(category)}`);
    } else if (suggestion.startsWith('Material: ')) {
      const material = suggestion.replace('Material: ', '');
      navigate(`/shop-page?search=${encodeURIComponent(material)}`);
    } else if (suggestion.startsWith('Santo: ')) {
      const saintName = suggestion.replace('Santo: ', '');
      const saint = searchResults.saints?.find(s => s.name === saintName);
      if (saint) {
        navigate(`/saint/${saint.id}`);
      } else {
        navigate(`/santoral?search=${encodeURIComponent(saintName)}`);
      }
    } else if (suggestion.startsWith('Ver todos los ')) {
      navigate(`/shop-page?search=${encodeURIComponent(searchTerm)}`);
    }
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults({ products: [], saints: [], suggestions: [] });
  };

  // Manejar selección de producto
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults({ products: [], saints: [], suggestions: [] });
  };

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

          {/* Menú Desktop */}
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

          {/* Iconos */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">

            {/* BOTÓN BÚSQUEDA ESCRITORIO - SOLO EN DESKTOP */}
            <div className="relative hidden sm:flex" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-2 sm:p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent"
              >
                <span className="text-lg">🔍</span>
              </button>

              {/* Dropdown de Búsqueda Desktop */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#2f4823]/20 z-50 overflow-hidden">
                  <form onSubmit={handleSearch} className="p-4 border-b border-[#2f4823]/10">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar productos, santos, categorías..."
                        className="w-full px-4 py-3 pl-10 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                        autoFocus
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#779385] hover:text-[#2f4823]"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="max-h-96 overflow-y-auto">
                    {isSearching && (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2f4823] mx-auto"></div>
                        <p className="text-sm text-[#779385] mt-2">Buscando...</p>
                      </div>
                    )}

                    {!isSearching && searchResults.products.length > 0 && (
                      <div className="border-b border-[#2f4823]/10">
                        <div className="px-4 py-2 bg-[#f7f2e7]">
                          <p className="text-sm font-semibold text-[#2f4823]">Productos</p>
                        </div>
                        {searchResults.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full text-left px-4 py-3 hover:bg-[#f7f2e7] transition-colors duration-200 border-b border-[#2f4823]/5 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images?.[0] || '/assets/img/default-product.png'}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#2f4823] truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[#779385]">
                                  ${product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!isSearching && searchResults.saints.length > 0 && (
                      <div className="border-b border-[#2f4823]/10">
                        <div className="px-4 py-2 bg-[#f7f2e7]">
                          <p className="text-sm font-semibold text-[#2f4823]">Santos</p>
                        </div>
                        {searchResults.saints.map((saint) => (
                          <button
                            key={saint.id}
                            onClick={() => handleSaintClick(saint.id)}
                            className="w-full text-left px-4 py-3 hover:bg-[#f7f2e7] transition-colors duration-200 border-b border-[#2f4823]/5 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                {saint.image ? (
                                  <img
                                    src={saint.image}
                                    alt={saint.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`${saint.image ? 'hidden' : ''} w-full h-full bg-[#2f4823] text-white flex items-center justify-center text-xs font-bold`}>
                                  ⛪
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#2f4823] truncate">
                                  {saint.name}
                                </p>
                                <p className="text-xs text-[#779385] truncate">
                                  {saint.feast_day || 'Santo'}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!isSearching && searchResults.suggestions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-[#f7f2e7]">
                          <p className="text-sm font-semibold text-[#2f4823]">Sugerencias</p>
                        </div>
                        {searchResults.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-[#f7f2e7] transition-colors duration-200 text-sm text-[#2f4823] border-b border-[#2f4823]/5 last:border-b-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {!isSearching && searchTerm.length >= 2 &&
                      searchResults.products.length === 0 &&
                      searchResults.saints.length === 0 &&
                      searchResults.suggestions.length === 0 && (
                        <div className="p-4 text-center">
                          <p className="text-sm text-[#779385]">No se encontraron resultados</p>
                          <p className="text-xs text-[#779385] mt-1">Intenta con otros términos</p>
                        </div>
                      )}

                    {searchTerm.length > 0 && searchTerm.length < 2 && (
                      <div className="p-4 text-center">
                        <p className="text-sm text-[#779385]">Escribe al menos 2 caracteres</p>
                      </div>
                    )}
                  </div>

                  {searchTerm.trim() && (
                    <div className="p-3 bg-[#f7f2e7] border-t border-[#2f4823]/10">
                      <button
                        onClick={handleSearch}
                        className="w-full bg-[#2f4823] text-white py-2 rounded-xl font-semibold hover:bg-[#1f3219] transition-colors text-sm"
                      >
                        Ver todos los resultados
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTÓN BÚSQUEDA MÓVIL - SOLO EN MÓVIL */}
            <div className="relative sm:hidden" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-2 rounded-2xl border border-[#2f4823]/30 hover:border-transparent"
              >
                <span className="text-lg">🔍</span>
              </button>

              {/* Dropdown de Búsqueda Móvil - CORREGIDO POSICIÓN */}
              {/* Dropdown de Búsqueda Móvil - CENTRADO PERFECTO */}
              {isSearchOpen && (
                <div className="fixed inset-x-0 top-16 z-50 sm:hidden px-4">
                  <div className="mx-auto max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#2f4823]/20 overflow-hidden">
                      <form onSubmit={handleSearch} className="p-4 border-b border-[#2f4823]/10">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar productos, santos..."
                            className="w-full px-4 py-3 pr-10 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300 text-base"
                            autoFocus
                          />
                          {searchTerm && (
                            <button
                              type="button"
                              onClick={() => setSearchTerm('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#779385] hover:text-[#2f4823]"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Contenido de resultados - se expande según necesidad */}
                      {(isSearching || searchTerm.length >= 2) && (
                        <div className="max-h-96 overflow-y-auto">
                          {isSearching && (
                            <div className="p-4 text-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2f4823] mx-auto"></div>
                              <p className="text-sm text-[#779385] mt-2">Buscando...</p>
                            </div>
                          )}

                          {!isSearching && searchResults.products.length > 0 && (
                            <div className="border-b border-[#2f4823]/10">
                              <div className="px-4 py-2 bg-[#f7f2e7]">
                                <p className="text-sm font-semibold text-[#2f4823]">Productos</p>
                              </div>
                              {searchResults.products.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleProductClick(product.id)}
                                  className="w-full text-left px-4 py-3 hover:bg-[#f7f2e7] transition-colors duration-200 border-b border-[#2f4823]/5 last:border-b-0"
                                >
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={product.images?.[0] || '/assets/img/default-product.png'}
                                      alt={product.name}
                                      className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#2f4823] truncate">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-[#779385]">
                                        ${product.price.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {!isSearching && searchResults.saints.length > 0 && (
                            <div className="border-b border-[#2f4823]/10">
                              <div className="px-4 py-2 bg-[#f7f2e7]">
                                <p className="text-sm font-semibold text-[#2f4823]">Santos</p>
                              </div>
                              {searchResults.saints.map((saint) => (
                                <button
                                  key={saint.id}
                                  onClick={() => handleSaintClick(saint.id)}
                                  className="w-full text-left px-4 py-3 hover:bg-[#f7f2e7] transition-colors duration-200 border-b border-[#2f4823]/5 last:border-b-0"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                      {saint.image ? (
                                        <img
                                          src={saint.image}
                                          alt={saint.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling?.classList.remove('hidden');
                                          }}
                                        />
                                      ) : null}
                                      <div className={`${saint.image ? 'hidden' : ''} w-full h-full bg-[#2f4823] text-white flex items-center justify-center text-xs font-bold`}>
                                        ⛪
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#2f4823] truncate">
                                        {saint.name}
                                      </p>
                                      <p className="text-xs text-[#779385] truncate">
                                        {saint.feast_day || 'Santo'}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {!isSearching && searchResults.suggestions.length > 0 && (
                            <div>
                              <div className="px-4 py-2 bg-[#f7f2e7]">
                                <p className="text-sm font-semibold text-[#2f4823]">Sugerencias</p>
                              </div>
                              {searchResults.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="w-full text-left px-4 py-2 hover:bg-[#f7f2e7] transition-colors duration-200 text-sm text-[#2f4823] border-b border-[#2f4823]/5 last:border-b-0"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}

                          {!isSearching && searchTerm.length >= 2 &&
                            searchResults.products.length === 0 &&
                            searchResults.saints.length === 0 &&
                            searchResults.suggestions.length === 0 && (
                              <div className="p-4 text-center">
                                <p className="text-sm text-[#779385]">No se encontraron resultados</p>
                                <p className="text-xs text-[#779385] mt-1">Intenta con otros términos</p>
                              </div>
                            )}

                          {searchTerm.length > 0 && searchTerm.length < 2 && (
                            <div className="p-4 text-center">
                              <p className="text-sm text-[#779385]">Escribe al menos 2 caracteres</p>
                            </div>
                          )}
                        </div>
                      )}

                      {searchTerm.trim() && (
                        <div className="p-3 bg-[#f7f2e7] border-t border-[#2f4823]/10">
                          <button
                            onClick={handleSearch}
                            className="w-full bg-[#2f4823] text-white py-2 rounded-xl font-semibold hover:bg-[#1f3219] transition-colors text-sm"
                          >
                            Ver todos los resultados
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón del Carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-2 sm:p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent relative"
            >
              <span className="text-lg">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#779385] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold transform hover:bg-white hover:text-[#779385] transition-all duration-300 shadow-lg">
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
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}

                  {(!user.picture || user.picture === '') && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2f4823] text-white rounded-full flex items-center justify-center font-semibold text-sm border-2 border-white shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium max-w-16 lg:max-w-24 truncate">
                    {user.name ? user.name.split(' ')[0] : user.email.split('@')[0]}
                  </span>
                </button>

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
              <button
                onClick={handleLogin}
                className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 px-2 sm:px-3 lg:px-4 py-2 rounded-2xl border border-[#2f4823]/30 hover:border-transparent font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Botón Menú Mobile */}
            <button
              className="lg:hidden text-[#2f4823] hover:bg-[#2f4823] hover:text-white p-2 sm:p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
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

            {isAuthenticated && user && (
              <button
                onClick={handleProfile}
                className="block w-full text-left text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 mx-2 text-sm sm:text-base border-t border-[#2f4823]/10"
              >
                👤 Mi Perfil
              </button>
            )}

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