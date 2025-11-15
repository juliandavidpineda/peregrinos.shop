import React, { useState } from 'react';

const ClientUserCard = ({ user, onStatusToggle, isUpdating }) => {

  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No aceptado';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-4 flex-1">
          <img
            src={user.picture || '/assets/img/default-avatar.png'}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-[#2f4823]/20"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{user.name || 'Sin nombre'}</h3>
              {user.email_verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verificado
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{user.email}</p>

            {user.birthdate && (
              <p className="text-xs text-gray-500 mt-1">
                🎂 {new Date(user.birthdate).toLocaleDateString('es-ES')}
              </p>
            )}

            {/* ✅ NUEVO: Badges de Segmentación y Stats */}
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${user.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </span>

              {/* ✅ BADGES DE SEGMENTACIÓN */}
              {user.is_vip && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
                  VIP
                </span>
              )}
              {user.is_recurrent && !user.is_vip && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                  Recurrente
                </span>
              )}
              {user.is_inactive && (
                <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-medium">
                  Inactivo
                </span>
              )}
              {(user.total_orders === 0 || user.total_orders === null) && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 font-medium">
                  Nuevo
                </span>
              )}

              {/* ✅ STATS RÁPIDAS */}
              <span className="text-xs text-gray-500">
                Pedidos: {user.total_orders || 0} | Logins: {user.login_count || 0}
              </span>
            </div>

            <span className="text-xs text-gray-500">
              Registrado: {new Date(user.created_at).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Status Toggle */}
          <button
            onClick={() => onStatusToggle(user.id, user.is_active)}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-2xl font-semibold text-sm transition-all duration-300 ${user.is_active
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? '...' : user.is_active ? 'Desactivar' : 'Activar'}
          </button>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-2xl font-semibold text-sm hover:bg-blue-200 transition-colors duration-300"
          >
            {showDetails ? 'Ocultar' : 'Detalles'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Legal Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Información Legal</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Términos:</span>
                  <span className={user.terms_accepted ? 'text-green-600' : 'text-red-600'}>
                    {user.terms_accepted ? '✅ Aceptado' : '❌ No aceptado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha términos:</span>
                  <span className="text-gray-900">{formatDate(user.terms_accepted_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Privacidad:</span>
                  <span className={user.privacy_policy_accepted ? 'text-green-600' : 'text-red-600'}>
                    {user.privacy_policy_accepted ? '✅ Aceptado' : '❌ No aceptado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marketing:</span>
                  <span className={user.marketing_emails ? 'text-green-600' : 'text-red-600'}>
                    {user.marketing_emails ? '✅ Aceptado' : '❌ No aceptado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Información de Cuenta</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-900 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="text-gray-900 capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cumpleaños:</span>
                  <span className="text-gray-900">
                    {user.birthdate ? new Date(user.birthdate).toLocaleDateString('es-ES') : 'No especificado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Google ID:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {user && user.google_id && user.google_id.trim() !== ''
                      ? user.google_id.substring(0, 10) + '...'
                      : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Segmento:</span>
                  <span className="text-gray-900 capitalize font-medium">{user.user_segment}</span>
                </div>
              </div>
            </div>

            {/* Dates & Stats */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Actividad y Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado:</span>
                  <span className="text-gray-900">{formatDate(user.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actualizado:</span>
                  <span className="text-gray-900">{formatDate(user.updated_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último login:</span>
                  <span className="text-gray-900">{formatDate(user.last_login)}</span>
                </div>
                {/* ✅ NUEVO: Stats de Actividad */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total pedidos:</span>
                  <span className="text-gray-900 font-medium">{user.total_orders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total gastado:</span>
                  <span className="text-gray-900 font-medium">${(user.total_spent || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contador logins:</span>
                  <span className="text-gray-900 font-medium">{user.login_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientUserCard;