import React, { useState } from 'react';
import ReviewStars from './ReviewStars';

const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 0,
    title: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        product_id: productId
      });
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        rating: 0,
        title: '',
        comment: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
        Deja tu reseña
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Tu calificación *
          </label>
          <ReviewStars 
            rating={formData.rating} 
            onRatingChange={handleRatingChange} 
          />
          {formData.rating > 0 && (
            <p className="text-sm text-[#779385] mt-1">
              {formData.rating} estrella{formData.rating !== 1 ? 's' : ''} seleccionada{formData.rating !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-[#2f4823] mb-2">
            Tu nombre *
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            required
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#779385] focus:border-[#779385] transition-all bg-white"
            placeholder="Ingresa tu nombre"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-[#2f4823] mb-2">
            Tu email
          </label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#779385] focus:border-[#779385] transition-all bg-white"
            placeholder="tu@email.com (opcional)"
          />
        </div>

        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#2f4823] mb-2">
            Título de tu reseña
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#779385] focus:border-[#779385] transition-all bg-white"
            placeholder="Ej: ¡Excelente calidad!"
            maxLength={200}
          />
        </div>

        {/* Comentario */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-[#2f4823] mb-2">
            Tu experiencia *
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={4}
            value={formData.comment}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#779385] focus:border-[#779385] transition-all bg-white resize-none"
            placeholder="Comparte tu experiencia con este producto..."
            maxLength={1000}
          />
          <p className="text-xs text-[#779385] mt-1">
            {formData.comment.length}/1000 caracteres
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || formData.rating === 0}
            className="flex-1 bg-[#2f4823] text-white py-3 px-6 rounded-lg hover:bg-[#1f3219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-[#779385] text-[#779385] rounded-lg hover:bg-[#f7f2e7] transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Nota */}
        <p className="text-xs text-[#779385] text-center">
          * Tu reseña será revisada antes de publicarse
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;