import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductHero from '../components/product-detail/ProductHero';
import ProductImageGallery from '../components/product-detail/ProductImageGallery';
import ProductInfo from '../components/product-detail/ProductInfo';
import ProductDescription from '../components/product-detail/ProductDescription';
import RelatedProducts from '../components/product-detail/RelatedProducts';
import { productService } from '../services/productService';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Cargando producto ID:', productId);
        const response = await productService.getProductById(productId);
        console.log('Producto cargado desde API:', response);
        
        if (response.product) {
          setProduct(response.product);
        } else {
          throw new Error('Producto no encontrado');
        }
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('Error al cargar el producto. Por favor, intenta nuevamente.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    if (!product.in_stock) {
      alert('Este producto está agotado');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
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

  const handleRetry = () => {
    window.location.reload();
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex justify-center items-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4 text-[#779385]">⚠️</div>
          <h2 className="text-2xl font-serif font-bold text-[#2f4823] mb-4">Error al cargar</h2>
          <p className="text-[#779385] mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleRetry}
              className="bg-[#2f4823] text-white px-6 py-3 rounded-lg hover:bg-[#1f3219] transition-colors"
            >
              Reintentar
            </button>
            <button 
              onClick={() => navigate('/shop-page')}
              className="bg-[#779385] text-white px-6 py-3 rounded-lg hover:bg-[#5a7568] transition-colors"
            >
              Volver a la Tienda
            </button>
          </div>
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
          <p className="text-[#779385] mb-6">La prenda que buscas no existe o fue removida.</p>
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
            images={product.images || []}
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
          allProducts={[]} // Por ahora vacío, luego podemos cargar productos relacionados
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;