import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { getFirstValidImage } from '../utils/imageHelper';

export const ProductGrid = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [sizeModal, setSizeModal] = useState({ show: false, product: null });

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await productService.getTopSellingProducts(4);
      
      if (response.success && response.products) {
        const formattedProducts = response.products.map((product, index) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: getFirstValidImage(product.images),
          description: product.description || 'Producto • Algodón 100%',
          badge: getBadgeByRank(index),
          sizes: product.sizes || ['S', 'M', 'L', 'XL'],
          stock: product.stock || 0,
          totalSold: product.total_sold || 0
        }));
        
        setTopProducts(formattedProducts);
      } else {
        setTopProducts([]);
      }

    } catch (error) {
      console.error('Error fetching top products:', error);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeByRank = (rank) => {
    const badges = ['🔥 Más Vendido', '⭐ Popular', '✨ Destacado', '🆕 Nuevo'];
    return badges[rank] || '⭐ Popular';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleOpenSizeModal = (e, product) => {
    e.stopPropagation();
    setSizeModal({ show: true, product });
  };

  const handleCloseSizeModal = () => {
    setSizeModal({ show: false, product: null });
  };

  const handleAddToCartWithSize = (size) => {
    if (!sizeModal.product) return;
    addToCart(sizeModal.product, size, 1);
    showNotification(`✅ ${sizeModal.product.name} (Talla ${size}) agregado al carrito`);
    handleCloseSizeModal();
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  const getGridClasses = () => {
    const count = topProducts.length;
    if (count === 0) return 'grid grid-cols-1';
    if (count === 1) return 'grid grid-cols-1 max-w-sm mx-auto gap-8';
    if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8';
    if (count === 3) return 'grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-8';
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8';
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#f7f2e7] rounded-3xl mx-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2f4823] font-serif mb-6">
              Nuestra <span className="text-[#779385]">Colección</span>
            </h2>
            <p className="text-xl text-[#2f4823]/80 max-w-2xl mx-auto">
              Cargando productos destacados...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-80 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Notificación Toast - Usando Portal para renderizar en body */}
      {notification && createPortal(
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999] animate-slide-up pointer-events-none">
          <div className="bg-white text-[#2f4823] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#779385]/20">
            <span className="text-xl">✓</span>
            <span className="font-medium text-sm">{notification}</span>
          </div>
        </div>,
        document.body
      )}

      <section className="py-20 bg-[#f7f2e7] rounded-3xl mx-4 mt-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Modal de Selección de Talla */}
          {sizeModal.show && sizeModal.product && (
            <div 
              className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
              onClick={handleCloseSizeModal}
            >
              <div 
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-[#2f4823] mb-4 font-serif">
                  Selecciona tu talla
                </h3>
                <p className="text-[#779385] mb-6">
                  {sizeModal.product.name}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {(sizeModal.product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleAddToCartWithSize(size)}
                      className="bg-[#f7f2e7] hover:bg-[#2f4823] hover:text-white text-[#2f4823] font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Talla {size}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCloseSizeModal}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Encabezado */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2f4823] font-serif mb-6">
              Los <span className="text-[#779385]">Más Vendidos</span>
            </h2>
            <p className="text-xl text-[#2f4823]/80 max-w-2xl mx-auto">
              Descubre las piezas favoritas de nuestra comunidad, confeccionadas con devoción y el mejor algodón natural
            </p>
          </div>

          {/* Grid de Productos */}
          {topProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-[#779385] mb-4">
                No hay productos disponibles en este momento
              </p>
              <button 
                onClick={() => navigate('/shop-page')}
                className="bg-[#2f4823] hover:bg-[#1f371c] text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300"
              >
                Explorar Tienda
              </button>
            </div>
          ) : (
            <div className={getGridClasses()}>
              {topProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group cursor-pointer relative"
                  onClick={() => handleProductClick(product.id)}
                >
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#2f4823] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Contador de ventas */}
                  {product.totalSold > 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-[#779385] text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.totalSold} vendidos
                      </span>
                    </div>
                  )}

                  {/* Imagen del Producto */}
                  <div className="relative overflow-hidden">
                    <div className="h-80 bg-gray-200 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center hidden">
                        <span className="text-gray-400 text-lg">🖼️ {product.name}</span>
                      </div>
                    
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="bg-[#f7f2e7] text-[#2f4823] hover:bg-white transform hover:scale-110 transition-all duration-300 font-bold py-3 px-6 rounded-2xl shadow-lg">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#2f4823] mb-2 font-serif">
                      {product.name}
                    </h3>
                    <p className="text-[#779385] text-sm mb-4">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#2f4823]">
                        {formatPrice(product.price)}
                      </span>
                      <button 
                        className="bg-[#2f4823] hover:bg-[#1f371c] text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                        onClick={(e) => handleOpenSizeModal(e, product)}
                        title="Agregar al carrito"
                      >
                        <span className="text-lg">🛒</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón Ver Todos */}
          {topProducts.length > 0 && (
            <div className="text-center mt-12">
              <button 
                className="bg-[#2f4823] hover:bg-[#1f371c] text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                onClick={() => navigate('/shop-page')}
              >
                Ver Colección Completa
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Estilos */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-in {
          0% { 
            opacity: 0; 
            transform: translate(-50%, 100px) scale(0.8); 
          }
          50% { 
            transform: translate(-50%, -10px) scale(1.05); 
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, 0) scale(1); 
          }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>
    </>
  );
};