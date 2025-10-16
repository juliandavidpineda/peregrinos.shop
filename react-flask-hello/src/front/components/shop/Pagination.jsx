import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generar array de páginas para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar startPage si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg border transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-white text-[#2f4823] border-[#779385] hover:bg-[#f7f2e7] hover:border-[#2f4823]'
        }`}
      >
        ← Anterior
      </button>

      {/* Primera página + elipsis si es necesario */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg border border-[#779385] bg-white text-[#2f4823] hover:bg-[#f7f2e7] transition-colors"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-[#779385]">...</span>
          )}
        </>
      )}

      {/* Números de página */}
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            currentPage === page
              ? 'bg-[#2f4823] text-white border-[#2f4823]'
              : 'bg-white text-[#2f4823] border-[#779385] hover:bg-[#f7f2e7] hover:border-[#2f4823]'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Última página + elipsis si es necesario */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-[#779385]">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg border border-[#779385] bg-white text-[#2f4823] hover:bg-[#f7f2e7] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg border transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-white text-[#2f4823] border-[#779385] hover:bg-[#f7f2e7] hover:border-[#2f4823]'
        }`}
      >
        Siguiente →
      </button>
    </div>
  );
};

export default Pagination;