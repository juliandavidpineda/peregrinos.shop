import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';
import { useUserAuth } from '../context/UserAuthContext';
import ReviewStars from '../components/reviews/ReviewStars';
import toast from 'react-hot-toast';

const ReviewProductsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(orderId);
      
      if (response.order) {
        setOrder(response.order);
        
        // Inicializar reviews vacías para cada producto
        const initialReviews = {};
        response.order.items.forEach(item => {
          initialReviews[item.product_id] = {
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            size: item.size,
            quantity: item.quantity,
            rating: 0,
            title: '',
            comment: ''
          };
        });
        setReviews(initialReviews);
      } else {
        setError('No se pudo cargar la orden');
      }
    } catch (err) {
      setError('Error al cargar los detalles de la orden');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (productId, rating) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating
      }
    }));
  };

  const handleReviewChange = (productId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const getCompletedReviews = () => {
    return Object.values(reviews).filter(review => review.rating > 0);
  };

  const submitReviews = async () => {
    try {
      setSubmitting(true);
      
      const completedReviews = getCompletedReviews();
      
      if (completedReviews.length === 0) {
        toast.error('Por favor califica al menos un producto');
        return;
      }

      // Preparar datos para el endpoint masivo
      const reviewsToSubmit = completedReviews.map(review => ({
        product_id: review.product_id,
        rating: review.rating,
        title: review.title || '',
        comment: review.comment || ''
      }));

      // ✅ Usar el nuevo endpoint de reseñas masivas por orden
      const response = await reviewService.submitOrderReviews(orderId, reviewsToSubmit);
      
      if (response.success) {
        toast.success(`✅ ${response.reviews_created} reseñas enviadas correctamente`);
        navigate('/mi-perfil'); // Volver al perfil
      } else {
        toast.error('Error al enviar las reseñas: ' + response.error);
      }
    } catch (err) {
      console.error('Error submitting reviews:', err);
      toast.error('Error al enviar las reseñas');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto mb-4"></div>
          <p className="text-[#779385] text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#779385]">⭐</div>
          <h2 className="text-2xl font-bold text-[#2f4823] mb-2">No se puede calificar</h2>
          <p className="text-[#779385] mb-6">{error || 'La orden no existe o no está disponible para calificar.'}</p>
          <button
            onClick={() => navigate('/mi-perfil')}
            className="px-6 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300"
          >
            Volver a Mis Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#779385]/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2f4823] font-serif">Calificar Productos</h1>
              <p className="text-[#779385]">Orden #{order.id.slice(-8).toUpperCase()} • {order.items.length} productos</p>
            </div>
            <button
              onClick={() => navigate('/mi-perfil')}
              className="px-4 py-2 border border-[#2f4823] text-[#2f4823] rounded-2xl font-semibold hover:bg-[#2f4823] hover:text-white transition-all duration-300"
            >
              ← Volver
            </button>
          </div>

          <div className="bg-[#f7f2e7] rounded-2xl p-4 border border-[#779385]/20">
            <p className="text-[#2f4823] font-medium text-center">
              Califica los productos de tu pedido entregado. Tu opinión ayuda a otros clientes.
            </p>
          </div>
        </div>

        {/* Lista de productos para calificar */}
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                
                {/* Imagen del producto */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-[#f7f2e7] rounded-2xl overflow-hidden">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#779385] flex items-center justify-center text-white text-sm">
                        IMG
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del producto */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#2f4823] mb-1">
                    {item.product_name}
                  </h3>
                  <p className="text-[#779385] text-sm mb-3">
                    Talla: {item.size} • Cantidad: {item.quantity}
                  </p>

                  {/* Calificación con estrellas */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2f4823] mb-2">
                      Tu calificación *
                    </label>
                    <ReviewStars 
                      rating={reviews[item.product_id]?.rating || 0}
                      onRatingChange={(rating) => handleRatingChange(item.product_id, rating)}
                    />
                    {reviews[item.product_id]?.rating > 0 && (
                      <p className="text-sm text-[#779385] mt-1">
                        {reviews[item.product_id].rating} estrella{reviews[item.product_id].rating !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Título de la reseña (opcional) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2f4823] mb-2">
                      Título de tu reseña (opcional)
                    </label>
                    <input
                      type="text"
                      value={reviews[item.product_id]?.title || ''}
                      onChange={(e) => handleReviewChange(item.product_id, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                      placeholder="Ej: ¡Excelente calidad!"
                      maxLength={200}
                    />
                  </div>

                  {/* Comentario de la reseña (opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-[#2f4823] mb-2">
                      Tu experiencia (opcional)
                    </label>
                    <textarea
                      value={reviews[item.product_id]?.comment || ''}
                      onChange={(e) => handleReviewChange(item.product_id, 'comment', e.target.value)}
                      className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent resize-none"
                      placeholder="Comparte tu experiencia con este producto..."
                      rows="3"
                      maxLength={1000}
                    />
                    <p className="text-xs text-[#779385] mt-1">
                      {(reviews[item.product_id]?.comment || '').length}/1000 caracteres
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen y botón de enviar */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <p className="text-[#2f4823] font-semibold">
                {getCompletedReviews().length} de {order.items.length} productos calificados
              </p>
              <p className="text-sm text-[#779385]">
                Solo los productos con calificación serán enviados
              </p>
            </div>
            
            <button
              onClick={submitReviews}
              disabled={submitting || getCompletedReviews().length === 0}
              className="px-8 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : `✅ Enviar ${getCompletedReviews().length} Reseñas`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProductsPage;