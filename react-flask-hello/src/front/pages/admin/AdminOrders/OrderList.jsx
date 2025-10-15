import React, { useState } from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, loading, onStatusUpdate, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Calcular órdenes para la página actual
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[#779385] text-[#779385] rounded hover:bg-[#779385] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          
          <span className="text-[#779385]">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[#779385] text-[#779385] rounded hover:bg-[#779385] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;