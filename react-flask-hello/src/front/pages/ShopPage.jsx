import React, { useState, useEffect } from 'react';
import ShopHero from '../components/shop/ShopHero';
import ShopSidebar from '../components/shop/ShopSidebar';
import ProductFilters from '../components/shop/ProductFilters';
import ProductGrid from '../components/shop/ProductGrid';

// Productos específicos para tienda católica de ropa
const sampleProducts = [
  {
    id: 1,
    name: "Camiseta BeTone Hombre",
    price: 120000,
    originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    category: "Hombre",
    subcategory: "Camiseta BeTone",
    rating: 4.8,
    reviewCount: 24,
    isNew: true,
    isOnSale: true,
    features: ["Algodón orgánico", "Diseño modesto", "Comfortable"]
  },
  {
    id: 2,
    name: "Blusa Bordada Mujer",
    price: 180000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1589810635657-232948472d98?w=300&h=300&fit=crop",
    category: "Mujer",
    subcategory: "Blusa Bordada",
    rating: 4.9,
    reviewCount: 36,
    isNew: true,
    isOnSale: false,
    features: ["Bordado artesanal", "Tela natural", "Elegancia espiritual"]
  },
  {
    id: 3,
    name: "Camiseta Manga Larga con Botones",
    price: 160000,
    originalPrice: 190000,
    image: "https://images.unsplash.com/photo-1589810635657-232948472d98?w=300&h=300&fit=crop",
    category: "Hombre",
    subcategory: "Camiseta Manga Larga con Botones",
    rating: 4.7,
    reviewCount: 18,
    isNew: false,
    isOnSale: true,
    features: ["Algodón pima", "Botones madera", "Estilo clásico"]
  },
  {
    id: 4,
    name: "Saco con Cierre Mujer",
    price: 250000,
    originalPrice: 300000,
    image: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=300&h=300&fit=crop",
    category: "Mujer",
    subcategory: "Saco con Cierre",
    rating: 4.6,
    reviewCount: 15,
    isNew: true,
    isOnSale: true,
    features: ["Lana natural", "Cierre durable", "Abrigo espiritual"]
  },
  {
    id: 5,
    name: "Camiseta BeTone Mujer",
    price: 130000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop",
    category: "Mujer",
    subcategory: "Camiseta BeTone",
    rating: 4.8,
    reviewCount: 29,
    isNew: false,
    isOnSale: false,
    features: ["Algodón premium", "Ajuste perfecto", "Modesta elegancia"]
  },
  {
    id: 6,
    name: "Saco con Cierre Hombre",
    price: 270000,
    originalPrice: 320000,
    image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=300&h=300&fit=crop",
    category: "Hombre",
    subcategory: "Saco con Cierre",
    rating: 4.5,
    reviewCount: 12,
    isNew: true,
    isOnSale: true,
    features: ["Material resistente", "Diseño sobrio", "Calidad premium"]
  }
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(300000);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setLoading(false);
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
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
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
        sorted.sort((a, b) => b.rating - a.rating);
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

  // Categorías para los filtros
  const categories = [
    { name: "Hombre", count: sampleProducts.filter(p => p.category === "Hombre").length },
    { name: "Mujer", count: sampleProducts.filter(p => p.category === "Mujer").length }
  ];

  return (
    <div className="min-h-screen bg-[#f7f2e7]">
      <ShopHero 
        title="Tienda Católica" 
        subtitle="Viste tu fe con modesta elegancia y significado espiritual"
        verse="Vístanse con la armadura de Dios" 
        verseLocation="Efesios 6:11"
      />
      
      <div className="container mx-auto px-4 py-8">
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