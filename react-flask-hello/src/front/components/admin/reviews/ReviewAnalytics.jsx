import React from 'react';

const ReviewAnalytics = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-6">
        <div className="text-center text-gray-500">
          Cargando métricas...
        </div>
      </div>
    );
  }

  const {
    total,
    pending,
    approved,
    averageRating
  } = analytics;

  const approvalRate = total > 0 ? (approved / total * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-6">
      <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-6">
        📊 Métricas de Reseñas
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Reviews */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-blue-800">Total Reseñas</div>
        </div>

        {/* Pendientes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          <div className="text-sm text-yellow-800">Pendientes</div>
        </div>

        {/* Aprobados */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{approved}</div>
          <div className="text-sm text-green-800">Aprobados</div>
        </div>

        {/* Rating Promedio */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-purple-800">Rating Promedio</div>
        </div>
      </div>

      {/* Barra de progreso - Tasa de aprobación */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#2f4823]">Tasa de Aprobación</span>
          <span className="text-sm text-[#779385]">{approvalRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${approvalRate}%` }}
          ></div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-[#f7f2e7] rounded-lg p-4">
        <h4 className="font-semibold text-[#2f4823] mb-2">💡 Insights</h4>
        <ul className="text-sm text-[#779385] space-y-1">
          {pending > 0 && (
            <li>• Tienes {pending} reseñas pendientes de moderación</li>
          )}
          {averageRating >= 4 && (
            <li>• Excelente rating promedio de {averageRating.toFixed(1)} estrellas</li>
          )}
          {approvalRate > 80 && (
            <li>• Alta tasa de aprobación ({approvalRate.toFixed(1)}%)</li>
          )}
          {total === 0 && (
            <li>• Aún no hay reseñas en el sistema</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReviewAnalytics;