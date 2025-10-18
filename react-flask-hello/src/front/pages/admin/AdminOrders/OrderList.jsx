import React, { useState } from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, loading, onStatusUpdate, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  // Calcular órdenes para la página actual
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageSizeChange = (e) => {
    setOrdersPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a primera página
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl mb-4">📦</div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 text-gray-400">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay órdenes</h3>
        <p className="text-gray-500">Todavía no se han realizado pedidos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contador y selector de items por página */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-[#779385]/20">
        <div className="text-sm text-[#779385]">
          Mostrando {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} de {orders.length} órdenes
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#779385]">Órdenes por página:</label>
          <select 
            value={ordersPerPage}
            onChange={handlePageSizeChange}
            className="text-sm border border-[#779385]/30 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#2f4823]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="grid gap-6">
        {currentOrders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>

      {/* Paginación mejorada */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-4 bg-white rounded-lg border border-[#779385]/20">
          {/* Información de página */}
          <div className="text-sm text-[#779385]">
            Página {currentPage} de {totalPages} • {orders.length} órdenes totales
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center gap-2">
            {/* Botón Primera página */}
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-[#779385] text-[#779385] rounded hover:bg-[#779385] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              title="Primera página"
            >
              ⏮️
            </button>

            {/* Botón Anterior */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-[#779385] text-[#779385] rounded hover:bg-[#779385] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Anterior
            </button>

            {/* Números de página */}
            <div className="flex gap-1">
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-[#2f4823] text-white'
                      : 'border border-[#779385] text-[#779385] hover:bg-[#779385] hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-[#779385] text-[#779385] rounded hover:bg-[#779385] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Siguiente
            </button>

            {/* Botón Última página */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-[#779385] text-[#779385] rounded hover:bg-[#779385] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              title="Última página"
            >
              ⏭️
            </button>
          </div>

          {/* Saltar a página específica */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#779385]">Ir a:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                goToPage(page);
              }}
              className="w-16 px-2 py-1 border border-[#779385]/30 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#2f4823]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;