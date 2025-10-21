import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ 
  reviews, 
  loading, 
  onModerate, 
  onDelete,
  pagination,
  onPageChange 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-6">
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-8 text-center">
        <div className="text-4xl mb-4">📝</div>
        <div className="text-gray-500 text-lg mb-2">No se encontraron reseñas</div>
        <div className="text-gray-400">Intenta ajustar los filtros de búsqueda</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de reviews */}
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onModerate={onModerate}
          onDelete={onDelete}
        />
      ))}

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6 pt-4 border-t border-[#779385]/20">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-[#779385]/30 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7f2e7] transition-colors text-sm"
          >
            Anterior
          </button>
          
          <span className="text-sm text-[#779385]">
            Página {pagination.page} de {pagination.pages}
          </span>
          
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 border border-[#779385]/30 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7f2e7] transition-colors text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;