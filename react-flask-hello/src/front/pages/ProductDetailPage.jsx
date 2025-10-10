import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductHero from '../components/product-detail/ProductHero';
import ProductImageGallery from '../components/product-detail/ProductImageGallery';
import ProductInfo from '../components/product-detail/ProductInfo';
import ProductDescription from '../components/product-detail/ProductDescription';
import RelatedProducts from '../components/product-detail/RelatedProducts';

// Datos de ejemplo - luego vendrán de tu API Python
const sampleProducts = [
  {
    id: 1,
    name: "Camiseta BeTone Hombre",
    price: 120000,
    originalPrice: 150000,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop"
    ],
    category: "Hombre",
    subcategory: "Camiseta BeTone",
    rating: 4.8,
    reviewCount: 24,
    isNew: true,
    isOnSale: true,
    features: ["Algodón orgánico 100%", "Diseño modesto", "Comfortable para todo el día", "Hecho con amor y oración"],
    description: "Esta camiseta BeTone combina estilo y comodidad con un diseño pensado para quienes buscan vestir su fe con elegancia. Confeccionada con algodón orgánico de la más alta calidad.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockQuantity: 15,
    materials: "100% Algodón Orgánico",
    care: "Lavable a máquina, secado natural",
    madeIn: "Hecho en Colombia por artesanos locales"
  },
  {
    id: 2,
    name: "Blusa Bordada Mujer",
    price: 180000,
    originalPrice: null,
    images: [
      "https://images.unsplash.com/photo-1589810635657-232948472d98?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop"
    ],
    category: "Mujer",
    subcategory: "Blusa Bordada",
    rating: 4.9,
    reviewCount: 36,
    isNew: true,
    isOnSale: false,
    features: ["Bordado artesanal", "Tela natural", "Elegancia espiritual", "Detalles únicos"],
    description: "Blusa con bordados artesanales que reflejan la belleza de la fe. Cada detalle está cuidadosamente elaborado para ofrecer una prenda única y especial.",
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    stockQuantity: 8,
    materials: "Algodón y encaje natural",
    care: "Lavado a mano recomendado",
    madeIn: "Hecho en Colombia por artesanos locales"
  }
];

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundProduct = sampleProducts.find(p => p.id === parseInt(productId));
      setProduct(foundProduct);
      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity: quantity
    };

    console.log('Agregar al carrito:', cartItem);
    alert(`¡${product.name} agregada al carrito!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto"></div>
          <p className="mt-4 text-[#779385] text-lg">Cargando prenda espiritual...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#779385]">🙏</div>
          <h2 className="text-2xl font-serif font-bold text-[#2f4823] mb-4">Prenda no encontrada</h2>
          <button 
            onClick={() => navigate('/shop-page')}
            className="bg-[#2f4823] text-white px-6 py-3 rounded-lg hover:bg-[#1f3219] transition-colors"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7]">
      <ProductHero 
        name={product.name}
        onBack={() => navigate('/shop-page')}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductImageGallery 
            images={product.images}
            name={product.name}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          <ProductInfo 
            product={product}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        <ProductDescription product={product} />

        <RelatedProducts 
          currentProduct={product}
          allProducts={sampleProducts}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;