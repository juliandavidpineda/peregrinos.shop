import React, { useState, useEffect } from 'react';
import ShopHero from '../components/shop/ShopHero';
import ShopSidebar from '../components/shop/ShopSidebar';
import ProductFilters from '../components/shop/ProductFilters';
import ProductGrid from '../components/shop/ProductGrid';
import { productService } from '../services/productService';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(300000);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getProducts();
        console.log('Productos cargados desde API:', response);
        
        if (response.products) {
          setProducts(response.products);
          setFilteredProducts(response.products);
        } else {
          throw new Error('Formato de respuesta inesperado');
        }
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('Error al cargar los productos. Por favor, intenta nuevamente.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Filtrar por precio
    filtered = filtered.filter(product => product.price <= priceRange);

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, priceRange, searchTerm]);

  // Manejar cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  // Manejar cambio de precio
  const handlePriceRangeChange = (e) => {
    setPriceRange(Number(e.target.value));
  };

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Manejar ordenamiento
  const handleSortChange = (sortValue) => {
    let sorted = [...filteredProducts];
    
    switch (sortValue) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };

  // Manejar click en producto
  const handleProductClick = (productId) => {
    console.log('Producto clickeado:', productId);
    // Navegar a página de detalle del producto
    window.location.href = `/product/${productId}`;
  };

  // Manejar agregar al carrito
  const handleAddToCart = (product) => {
    console.log('Agregar al carrito:', product);
    // Lógica del carrito
  };

  // Manejar modal móvil
  const handleMobileModalToggle = () => {
    setIsMobileModalOpen(!isMobileModalOpen);
  };

  // Obtener categorías únicas de los productos reales
  const categories = [...new Set(products.map(product => product.category))]
    .filter(category => category) // Remover categorías null/undefined
    .map(category => ({
      name: category,
      count: products.filter(p => p.category === category).length
    }));

  // Recargar productos
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f7f2e7]">
      <ShopHero 
        title="Tienda Católica" 
        subtitle="Viste tu fe con modesta elegancia y significado espiritual"
        verse="Vístanse con la armadura de Dios" 
        verseLocation="Efesios 6:11"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Verifica que el backend esté corriendo en http://localhost:3001
                </p>
              </div>
              <button
                onClick={handleReload}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ShopSidebar 
              categories={categories}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              isMobileModalOpen={isMobileModalOpen}
              onMobileModalToggle={handleMobileModalToggle}
            />
          </div>
          
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <ProductFilters 
              onSortChange={handleSortChange}
              onSearch={handleSearch}
              totalProducts={filteredProducts.length}
            />
            
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              columns={3}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              emptyMessage="No encontramos prendas que coincidan con tu búsqueda"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;