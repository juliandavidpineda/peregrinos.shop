import React, { useState, useEffect } from 'react';
import { clientUserService } from '../../../services/clientUserService';

const ClientUserCard = ({ user, onStatusToggle, isUpdating }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);

  // Cargar direcciones cuando se muestren los detalles
  useEffect(() => {
    if (showDetails && showAddresses) {
      loadAddresses();
    }
  }, [showDetails, showAddresses]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await clientUserService.getClientUserAddresses(user.id);
      if (response.success) {
        setAddresses(response.addresses || []);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

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

            {/* ✅ ACTUALIZADO: Agregar direcciones a los badges */}
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

              {/* ✅ STATS RÁPIDAS - AGREGAR DIRECCIONES */}
              <span className="text-xs text-gray-500">
                📍 {user.addresses_count || 0} | 📦 {user.total_orders || 0} | 👤 {user.login_count || 0}
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
          {/* Botón para mostrar/ocultar direcciones */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddresses(!showAddresses)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-200 transition-colors duration-300"
            >
              <span>🏠</span>
              <span>
                {showAddresses ? 'Ocultar Direcciones' : `Ver Direcciones (${addresses.length})`}
              </span>
            </button>
          </div>

          {/* Sección de Direcciones */}
          {showAddresses && (
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">🗺️ Direcciones del Usuario</h4>
              
              {loadingAddresses ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2f4823] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando direcciones...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>El usuario no tiene direcciones registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div key={address.id} className="p-3 bg-white rounded-2xl border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-gray-900">{address.alias}</h5>
                            {address.is_primary && (
                              <span className="px-2 py-1 bg-[#2f4823] text-white text-xs rounded-full">
                                PRINCIPAL
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>📍 Dirección:</strong> {address.address}</p>
                            <p><strong>🏙️ Ciudad:</strong> {address.city}, {address.department}</p>
                            {address.postal_code && (
                              <p><strong>📮 Código Postal:</strong> {address.postal_code}</p>
                            )}
                            <p><strong>📞 Teléfono:</strong> {address.phone}</p>
                            
                            {address.special_instructions && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-xs text-yellow-800">
                                  <strong>📝 Instrucciones:</strong> {address.special_instructions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <span>Creado: {formatDate(address.created_at)}</span>
                        {address.updated_at !== address.created_at && (
                          <span className="ml-3">Actualizado: {formatDate(address.updated_at)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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