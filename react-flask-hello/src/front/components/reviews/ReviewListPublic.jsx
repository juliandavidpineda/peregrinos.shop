import React from 'react';
import ReviewStars from './ReviewStars';

const ReviewListPublic = ({ reviews }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-[#779385]">Aún no hay reseñas para este producto</p>
        <p className="text-sm text-[#779385] mt-1">Sé el primero en compartir tu experiencia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-serif font-bold text-xl text-[#2f4823]">
        Reseñas de clientes ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-[#2f4823]">{review.customer_name}</h4>
              <ReviewStars rating={review.rating} readonly={true} />
            </div>
            <span className="text-sm text-[#779385]">{formatDate(review.created_at)}</span>
          </div>

          {/* Contenido */}
          {review.title && (
            <h5 className="font-medium text-[#2f4823] mb-2">{review.title}</h5>
          )}
          
          {review.comment && (
            <p className="text-[#2f4823] leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewListPublic;