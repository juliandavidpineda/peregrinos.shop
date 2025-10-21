import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const ReviewCard = ({ review, onModerate, onDelete }) => {
  const { isSuperAdmin, user } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const canDelete = isSuperAdmin() || user?.role === 'content_manager';

  return (
    <div className="bg-white border border-[#779385]/20 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header con info básica */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-[#2f4823]">{review.customer_name}</h3>
          <p className="text-sm text-[#779385]">{review.customer_email}</p>
        </div>
        <div className="text-right">
          <div className="text-lg">{renderStars(review.rating)}</div>
          <div className="text-xs text-[#779385]">{formatDate(review.created_at)}</div>
        </div>
      </div>

      {/* Contenido de la reseña */}
      {review.title && (
        <h4 className="font-medium text-[#2f4823] mb-2">{review.title}</h4>
      )}
      {review.comment && (
        <p className="text-[#2f4823] mb-4">{review.comment}</p>
      )}

      {/* Info del producto */}
      <div className="text-sm text-[#779385] mb-4">
        Producto ID: {review.product_id}
      </div>

      {/* Estado y acciones */}
      <div className="flex justify-between items-center pt-3 border-t border-[#779385]/20">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          review.is_approved 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {review.is_approved ? '✅ Aprobado' : '⏳ Pendiente'}
        </span>

        <div className="flex gap-2">
          {/* Botones de moderación */}
          {!review.is_approved && (
            <button
              onClick={() => onModerate(review.id, true)}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              Aprobar
            </button>
          )}
          
          {review.is_approved && (
            <button
              onClick={() => onModerate(review.id, false)}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              Rechazar
            </button>
          )}

          {/* Botón eliminar (solo content_manager+) */}
          {canDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;