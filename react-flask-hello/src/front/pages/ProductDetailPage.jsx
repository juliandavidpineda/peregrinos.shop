import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductHero from '../components/product-detail/ProductHero';
import ProductImageGallery from '../components/product-detail/ProductImageGallery';
import ProductInfo from '../components/product-detail/ProductInfo';
import ProductDescription from '../components/product-detail/ProductDescription';
import RelatedProducts from '../components/product-detail/RelatedProducts';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewListPublic from '../components/reviews/ReviewListPublic';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [failedImages, setFailedImages] = useState(new Set());
  const [imageCache, setImageCache] = useState(new Map());
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar producto
        const productResponse = await productService.getProductById(productId);
        
        if (productResponse.product) {
          setProduct(productResponse.product);
          
          // Verificar imágenes antes de renderizar
          if (productResponse.product.images && productResponse.product.images.length > 0) {
            verifyImages(productResponse.product.images);
          }

          // Cargar reseñas del producto
          await loadProductReviews(productId);
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
      loadProductData();
    }
  }, [productId]);

  // Cargar reseñas del producto
  const loadProductReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const response = await reviewService.getProductReviews(productId);
      setReviews(response.reviews || []);
    } catch (error) {
      console.error('Error cargando reseñas:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Manejar envío de nueva reseña
  const handleSubmitReview = async (reviewData) => {
    try {
      await reviewService.createReview(productId, reviewData);
      
      // Recargar reseñas
      await loadProductReviews(productId);
      
      // Ocultar formulario
      setShowReviewForm(false);
      
      // Mostrar mensaje de éxito
      alert('¡Gracias por tu reseña! Será revisada antes de publicarse.');
      
    } catch (error) {
      console.error('Error enviando reseña:', error);
      alert('Error al enviar la reseña. Por favor, intenta nuevamente.');
      throw error; // Re-lanzar para que el formulario maneje el error
    }
  };

  // Verificar qué imágenes existen realmente en el servidor
  const verifyImages = async (images) => {
    const verifiedCache = new Map();
    const newFailedImages = new Set();

    // Verificar cada imagen
    for (const imageUrl of images) {
      try {
        const fullUrl = getFullImageUrl(imageUrl);
        const exists = await checkImageExists(fullUrl);
        
        if (exists) {
          verifiedCache.set(imageUrl, true);
        } else {
          verifiedCache.set(imageUrl, false);
          newFailedImages.add(imageUrl);
        }
      } catch (error) {
        verifiedCache.set(imageUrl, false);
        newFailedImages.add(imageUrl);
      }
    }

    setImageCache(verifiedCache);
    setFailedImages(newFailedImages);
  };

  // Verificar si una imagen existe en el servidor
  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout por si la imagen tarda mucho
      setTimeout(() => resolve(false), 2000);
    });
  };

  // Construir URL completa de imagen
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    
    // ✅ USAR URL BASE FIJA (misma que en MediaUpload)
    const API_BASE_URL = 'http://localhost:3001';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}/api${cleanPath}`;
  };

  // Filtrar imágenes - SOLO las que sabemos que existen
  const getValidImages = () => {
    if (!product || !product.images) return [];
    
    return product.images.filter(image => {
      return imageCache.get(image) !== false && !failedImages.has(image);
    });
  };

  // Manejar error de carga de imagen (fallback)
  const handleImageError = (imagePath) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(imagePath);
      return newSet;
    });
    
    // Actualizar cache
    setImageCache(prev => {
      const newCache = new Map(prev);
      newCache.set(imagePath, false);
      return newCache;
    });
  };

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

  // Obtener imágenes válidas
  const validImages = getValidImages();

  return (
    <div className="min-h-screen bg-[#f7f2e7]">
      <ProductHero 
        name={product.name}
        onBack={() => navigate('/shop-page')}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductImageGallery 
            images={validImages}
            name={product.name}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onImageError={handleImageError}
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

        {/* SECCIÓN DE RESEÑAS */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header de reseñas */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2f4823] mb-2">
                  Reseñas de Clientes
                </h2>
                <div className="flex items-center gap-4 text-[#779385]">
                  <span className="flex items-center gap-1">
                    <span className="text-2xl">⭐</span>
                    <span className="font-semibold">{product.rating || 0}</span>
                    <span>/5</span>
                  </span>
                  <span>•</span>
                  <span>{reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* Botón para agregar reseña */}
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-[#2f4823] text-white px-6 py-3 rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
              >
                {showReviewForm ? 'Cancelar' : 'Escribir Reseña'}
              </button>
            </div>

            {/* Formulario de reseña (condicional) */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm 
                  productId={productId}
                  onSubmit={handleSubmitReview}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {/* Lista de reseñas */}
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2f4823] mx-auto"></div>
                <p className="mt-4 text-[#779385]">Cargando reseñas...</p>
              </div>
            ) : (
              <ReviewListPublic reviews={reviews} />
            )}
          </div>
        </section>

        <RelatedProducts 
          currentProduct={product}
          allProducts={[]}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;