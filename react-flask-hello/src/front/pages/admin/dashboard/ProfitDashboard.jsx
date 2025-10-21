import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../../services/analyticsService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfitDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [compareWithPrevious, setCompareWithPrevious] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const { user, isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async (period = selectedPeriod, compare = compareWithPrevious) => {
    try {
      setLoading(true);
      const response = await analyticsService.getProfitAnalytics(period, compare);
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await analyticsService.exportToPDF(selectedPeriod);
      toast.success('Reporte exportado exitosamente');
    } catch (err) {
      toast.error('Error exportando reporte: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getChangeIndicator = (current, previous) => {
    if (!previous || previous === 0) return null;
    
    const change = ((current - previous) / previous * 100);
    const isPositive = change >= 0;
    
    return (
      <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} ml-2`}>
        {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  const periodOptions = [
    { value: 'all', label: '📅 Todos los tiempos' },
    { value: 'today', label: '🕐 Hoy' },
    { value: 'week', label: '📆 Esta semana' },
    { value: 'month', label: '🗓️ Este mes' },
    { value: '3months', label: '📊 Últimos 3 meses' }
  ];

  // Función para determinar si mostrar datos financieros
  const shouldShowFinancialData = () => {
    return isSuperAdmin();
  };

  // Función para determinar si mostrar sección completa
  const shouldShowFullDashboard = () => {
  const userRole = user?.role?.toLowerCase();
  return isSuperAdmin() || userRole === 'content_manager';
};

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="text-center text-red-600">
          <div className="text-2xl mb-2">❌</div>
          <p>Error: {error}</p>
          <button 
            onClick={() => fetchProfitData()}
            className="mt-4 bg-[#2f4823] text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="text-center text-gray-500">
          No hay datos de utilidades disponibles
        </div>
      </div>
    );
  }

  const { metrics, comparison, weekly_trends } = data;

  // Si no es SuperAdmin y no hay datos financieros, mostrar mensaje amigable
if (!shouldShowFinancialData() && metrics.total_revenue === 0) {
  // Normalizar el rol para evitar problemas de case sensitivity
  const userRole = user?.role?.toLowerCase() || '';
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-[#2f4823] mb-2">
          Panel de Utilidades
        </h3>
        <p className="text-[#779385] mb-4">
          {userRole === 'editor' 
            ? 'Como Editor, tu enfoque está en la gestión de productos y categorías.'
            : userRole === 'content_manager' 
              ? 'Como Content Manager, puedes gestionar pedidos, productos y reportes básicos.'
              : `Como ${user?.role || 'Usuario'}, tu acceso es limitado según tus permisos.`
          }
        </p>
        <div className="bg-[#f7f2e7] rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-[#2f4823]">
            <strong>Información disponible para tu rol:</strong>
          </p>
          <ul className="text-sm text-[#779385] mt-2 text-left">
            {userRole === 'editor' && (
              <>
                <li>• Gestión de productos y categorías</li>
                <li>• Control de inventario y stock</li>
                <li>• Contenido y descripciones de productos</li>
                <li>• Activar/desactivar productos</li>
              </>
            )}
            {userRole === 'content_manager' && (
              <>
                <li>• Gestión de pedidos y estados</li>
                <li>• Reportes de ventas (solo cantidades)</li>
                <li>• Productos más vendidos</li>
                <li>• Gestión de clientes y pedidos</li>
                <li>• Tendencias de productos</li>
              </>
            )}
            {!['editor', 'content_manager'].includes(userRole) && (
              <>
                <li>• Consulta con el administrador del sistema</li>
                <li>• Revisa tus permisos de acceso</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      {/* Header con Controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#2f4823]">
          📊 Panel de Utilidades 
          {!shouldShowFinancialData() && (
            <span className="text-sm font-normal text-[#779385] ml-2">
              (Vista Limitada)
            </span>
          )}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              fetchProfitData(e.target.value, compareWithPrevious);
            }}
            className="bg-white border border-[#779385]/30 rounded-lg px-4 py-2 text-[#2f4823] focus:ring-2 focus:ring-[#779385]"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {shouldShowFinancialData() && (
            <label className="flex items-center gap-2 bg-[#f7f2e7] px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={compareWithPrevious}
                onChange={(e) => {
                  setCompareWithPrevious(e.target.checked);
                  fetchProfitData(selectedPeriod, e.target.checked);
                }}
                className="w-4 h-4 text-[#2f4823] rounded focus:ring-2 focus:ring-[#779385]"
              />
              <span className="text-sm text-[#2f4823] font-medium">Comparar con periodo anterior</span>
            </label>
          )}
          
          {shouldShowFinancialData() && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="bg-[#779385] hover:bg-[#5a7265] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {exporting ? '⏳' : '📄'} Exportar
            </button>
          )}
        </div>
      </div>
      
      {/* Métricas Principales con Comparación */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-green-600 text-sm font-semibold flex items-center">
            {shouldShowFinancialData() ? 'Ingresos Totales' : 'Ventas Totales'}
            {shouldShowFinancialData() && getChangeIndicator(metrics.total_revenue, comparison?.total_revenue)}
          </div>
          <div className="text-2xl font-bold text-[#2f4823]">
            {shouldShowFinancialData() 
              ? formatPrice(metrics.total_revenue)
              : `${metrics.total_orders} órdenes`
            }
          </div>
          {shouldShowFinancialData() && comparison && (
            <div className="text-xs text-green-600 mt-1">
              Anterior: {formatPrice(comparison.total_revenue)}
            </div>
          )}
        </div>
        
        {shouldShowFinancialData() && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-blue-600 text-sm font-semibold flex items-center">
              Costos Totales
              {getChangeIndicator(metrics.total_cost, comparison?.total_cost)}
            </div>
            <div className="text-2xl font-bold text-[#2f4823]">
              {formatPrice(metrics.total_cost)}
            </div>
            {comparison && (
              <div className="text-xs text-blue-600 mt-1">
                Anterior: {formatPrice(comparison.total_cost)}
              </div>
            )}
          </div>
        )}
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-amber-600 text-sm font-semibold flex items-center">
            {shouldShowFinancialData() ? 'Utilidad Bruta' : 'Productos Vendidos'}
            {shouldShowFinancialData() && getChangeIndicator(metrics.gross_profit, comparison?.gross_profit)}
          </div>
          <div className="text-2xl font-bold text-[#2f4823]">
            {shouldShowFinancialData() 
              ? formatPrice(metrics.gross_profit)
              : metrics.total_products_sold || 0
            }
          </div>
          {shouldShowFinancialData() && comparison && (
            <div className="text-xs text-amber-600 mt-1">
              Anterior: {formatPrice(comparison.gross_profit)}
            </div>
          )}
        </div>
        
        {shouldShowFinancialData() && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="text-purple-600 text-sm font-semibold flex items-center">
              Margen %
              {getChangeIndicator(metrics.profit_margin, comparison?.profit_margin)}
            </div>
            <div className="text-2xl font-bold text-[#2f4823]">
              {metrics.profit_margin}%
            </div>
            {comparison && (
              <div className="text-xs text-purple-600 mt-1">
                Anterior: {comparison.profit_margin}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gráfico de Tendencias - Solo para roles con acceso */}
      {shouldShowFullDashboard() && weekly_trends && weekly_trends.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#2f4823] mb-4">
            📈 Tendencias Semanales (Últimos 3 meses) 
            <span className="text-sm font-normal text-[#779385] ml-2">
              • Semana actual resaltada
            </span>
          </h3>
          <div className="bg-[#f7f2e7] rounded-lg p-4">
            <div className="flex items-end justify-between h-32 gap-1">
              {weekly_trends.map((week, index) => {
                // Calcular altura relativa basada en órdenes para todos los roles
                const maxOrders = Math.max(...weekly_trends.map(w => w.orders), 1);
                const height = Math.max((week.orders / maxOrders) * 80, 8);
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full rounded-t transition-all hover:opacity-80 cursor-pointer ${
                        week.is_current_week 
                          ? 'bg-[#779385] border-2 border-[#2f4823]'
                          : week.orders > 0 
                            ? 'bg-[#2f4823]' 
                            : 'bg-gray-300'
                      } ${week.orders === 0 ? 'opacity-50' : ''}`}
                      style={{ height: `${height}px` }}
                      title={`${week.week}${week.is_current_week ? ' (SEMANA ACTUAL)' : ''}: ${week.orders} órdenes`}
                    ></div>
                    <div className={`text-xs mt-1 text-center ${
                      week.is_current_week ? 'font-bold text-[#2f4823]' : 'text-[#779385]'
                    }`}>
                      {week.week}
                      {week.is_current_week && (
                        <span className="block text-[10px] text-[#779385]">Actual</span>
                      )}
                    </div>
                    {week.orders > 0 && (
                      <div className="text-xs text-[#2f4823] font-semibold mt-1">
                        {week.orders}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Leyenda */}
            <div className="flex justify-center gap-4 mt-4 text-xs text-[#2f4823]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#2f4823] rounded"></div>
                <span>Semanas con órdenes</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#779385] border border-[#2f4823] rounded"></div>
                <span>Semana actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Sin actividad</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-[#2f4823] mt-2">
              {weekly_trends.filter(w => w.orders > 0).length} de {weekly_trends.length} semanas con actividad
            </div>
          </div>
        </div>
      )}

      {/* Productos Más Vendidos/Rentables */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2f4823] mb-4">
          {shouldShowFinancialData() ? '🏆 Productos Más Rentables' : '🏆 Productos Más Vendidos'}
        </h3>
        <div className="space-y-3">
          {metrics.top_products.map((product, index) => (
            <div key={index} className="flex justify-between items-center p-3 border border-[#779385]/20 rounded-lg hover:bg-[#f7f2e7] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2f4823] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-[#2f4823]">{product.name}</div>
                  <div className="text-sm text-[#779385]">
                    {product.total_quantity} vendidos
                    {shouldShowFinancialData() && ` • Margen: ${product.margin.toFixed(1)}%`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#2f4823]">
                  {shouldShowFinancialData() 
                    ? formatPrice(product.total_profit)
                    : `${product.total_quantity} unidades`
                  }
                </div>
                <div className="text-sm text-[#779385]">
                  {shouldShowFinancialData() ? 'Utilidad Total' : 'Total Vendido'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      {shouldShowFinancialData() && (
        <div className="p-4 bg-[#f7f2e7] rounded-lg">
          <div className="text-sm text-[#2f4823]">
            <strong>Resumen Ejecutivo:</strong> {metrics.total_orders} órdenes procesadas • 
            Valor promedio: {formatPrice(metrics.avg_order_value)} • 
            {comparison && (
              <span className={`ml-2 ${metrics.gross_profit >= (comparison.gross_profit || 0) ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.gross_profit >= (comparison.gross_profit || 0) ? '📈 Mejorando' : '📉 Decreciendo'} vs periodo anterior
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitDashboard;