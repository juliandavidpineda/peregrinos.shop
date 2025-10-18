import React, { useState, useEffect } from 'react';
import ShopHero from '../components/shop/ShopHero';
import ShopSidebar from '../components/shop/ShopSidebar';
import ProductFilters from '../components/shop/ProductFilters';
import ProductGrid from '../components/shop/ProductGrid';
import Pagination from '../components/shop/Pagination'; // Nuevo componente
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(800000); // Aumentado a 800,000
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); // 9 productos por página (3x3 grid)
  const [totalPages, setTotalPages] = useState(1);

  // Cargar productos y categorías desde la API
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      
      console.log('🛍️ Productos cargados:', productsResponse);
      console.log('🔍 ShopPage - Datos de productos crudos:', productsResponse.products.map(p => ({
  id: p.id,
  name: p.name,
  images: p.images,
  hasImages: p.images && p.images.length > 0,
  imageType: typeof p.images
})));
      
      if (productsResponse.products) {
        // ✅ PROCESAR IMÁGENES ANTES DE GUARDAR
        const processedProducts = productsResponse.products.map(product => ({
          ...product,
          // Asegurar que images sea un array
          images: Array.isArray(product.images) ? product.images : [],
          // Debug: verificar las imágenes
          _debug_images: product.images
        }));
        
        console.log('🔍 Productos procesados:', processedProducts.map(p => ({
          name: p.name,
          images: p.images,
          hasImages: p.images.length > 0
        })));
        
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } else {
        throw new Error('Formato de respuesta inesperado en productos');
      }

      if (categoriesResponse.categories) {
        setCategories(categoriesResponse.categories);
      } else {
        throw new Error('Formato de respuesta inesperado en categorías');
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los productos. Por favor, intenta nuevamente.');
      setProducts([]);
      setFilteredProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  // Filtrar productos y calcular paginación
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category_id)
      );
    }

    // Filtrar por precio
    filtered = filtered.filter(product => product.price <= priceRange);

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
    
    // Calcular total de páginas
    const totalPagesCount = Math.ceil(filtered.length / productsPerPage);
    setTotalPages(totalPagesCount);
    
    // Resetear a página 1 si los filtros cambian
    setCurrentPage(1);
  }, [products, selectedCategories, priceRange, searchTerm, productsPerPage]);

  // Obtener productos actuales para la página
  const getCurrentProducts = () => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  // Manejar cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(cat => cat !== categoryId)
        : [...prev, categoryId]
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
        // Orden por defecto: más recientes primero
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    
    setFilteredProducts(sorted);
    setCurrentPage(1); // Resetear a primera página al ordenar
  };

  // Manejar click en producto
  const handleProductClick = (productId) => {
    console.log('Producto clickeado:', productId);
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

  // Obtener categorías para el sidebar
  const sidebarCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
    count: products.filter(p => p.category_id === category.id).length
  })).filter(cat => cat.count > 0);

  // Recargar productos
  const handleReload = () => {
    window.location.reload();
  };

  // Información de paginación para mostrar
  const currentProducts = getCurrentProducts();
  const totalProducts = filteredProducts.length;
  const showingFrom = ((currentPage - 1) * productsPerPage) + 1;
  const showingTo = Math.min(currentPage * productsPerPage, totalProducts);

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
              categories={sidebarCategories}
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
              totalProducts={totalProducts}
            />
            
            {/* Información de paginación */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-[#779385]">
                Mostrando {showingFrom}-{showingTo} de {totalProducts} productos
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-[#779385]">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>
            
            {/* Grid de productos */}
            <ProductGrid
              products={currentProducts}
              loading={loading}
              columns={3}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              emptyMessage="No encontramos prendas que coincidan con tu búsqueda"
            />

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;