import React from 'react';

const ActivityLogs = ({ logs, loading, pagination, onPageChange }) => {
  const getActionBadge = (action) => {
    const actionStyles = {
      user_created: 'bg-green-100 text-green-800',
      user_updated: 'bg-blue-100 text-blue-800',
      user_updated_self: 'bg-blue-100 text-blue-800',
      user_deleted: 'bg-red-100 text-red-800',
      user_status_changed: 'bg-orange-100 text-orange-800',
      login: 'bg-purple-100 text-purple-800'
    };

    const actionLabels = {
      user_created: 'Usuario Creado',
      user_updated: 'Usuario Actualizado',
      user_updated_self: 'Perfil Actualizado',
      user_deleted: 'Usuario Eliminado',
      user_status_changed: 'Estado Cambiado',
      login: 'Inicio de Sesión'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${actionStyles[action] || 'bg-gray-100 text-gray-800'}`}>
        {actionLabels[action] || action}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500 text-lg mb-2">No se encontraron registros de actividad</div>
        <div className="text-gray-400">Los logs de actividad aparecerán aquí</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {log.admin_user?.first_name?.[0]}{log.admin_user?.last_name?.[0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {log.admin_user?.first_name} {log.admin_user?.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{log.admin_user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getActionBadge(log.action)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                  {log.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(log.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.ip_address || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación para logs */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 p-4 border-t border-gray-200">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-700">
            Página {pagination.page} de {pagination.pages}
          </span>
          
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;