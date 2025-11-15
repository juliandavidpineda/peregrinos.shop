import React, { useState } from 'react';

const UserProfileUnified = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    birthdate: user?.birthdate || '',
    marketing_emails: user?.marketing_emails || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await onUpdate(formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        alert(result.error || 'Error al actualizar información');
      }
    } catch (error) {
      alert('Error al actualizar información');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#2f4823] font-serif">Mi Perfil</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300"
          >
            Editar Perfil
          </button>
        )}
      </div>

      <div className="bg-[#f7f2e7] rounded-2xl p-6 border border-[#779385]/20">
        {!isEditing ? (
          // ✅ VISTA UNIFICADA - Solo lectura
          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Información Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Nombre completo</label>
                  <p className="text-[#2f4823] font-semibold text-lg">{user?.name || 'No especificado'}</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Email</label>
                  <p className="text-[#2f4823] font-semibold text-lg">{user?.email}</p>
                  {user?.email_verified && (
                    <span className="inline-flex items-center px-2 py-1 mt-1 bg-green-100 text-green-800 text-xs rounded-full">
                      ✅ Verificado
                    </span>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Teléfono</label>
                  <p className="text-[#2f4823] font-semibold text-lg">{user?.phone || 'No especificado'}</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Fecha de cumpleaños</label>
                  <p className="text-[#2f4823] font-semibold text-lg">{formatDate(user?.birthdate)}</p>
                </div>
              </div>
            </div>

            {/* Comunicaciones y Marketing Unificado */}
            <div className="border-t border-[#779385]/20 pt-6">
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Comunicaciones y Marketing</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#2f4823]">Comunicaciones y Marketing</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user?.marketing_emails
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {user?.marketing_emails ? 'Activado' : 'Desactivado'}
                  </span>
                </div>
                {user?.marketing_emails && (
                  <div className="bg-[#e8dfca] rounded-2xl p-3 border border-[#779385]/20">
                    <p className="text-xs text-[#779385] text-center">
                      Recibes: notificaciones de pedidos, ofertas, nuevos productos y contenido espiritual
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Cuenta */}
            <div className="border-t border-[#779385]/20 pt-6">
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Información de la cuenta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Miembro desde</label>
                  <p className="text-[#2f4823] font-semibold">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Estado de la cuenta</label>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    <span className="text-[#2f4823] font-semibold">
                      {user?.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#779385]/20">
                  <label className="block text-sm font-medium text-[#779385] mb-1">Método de registro</label>
                  <div className="flex items-center space-x-2">
                    {user && user.google_id && user.google_id.trim() !== '' ? (
                      <>
                        <span className="text-blue-500">🔗</span>
                        <span className="text-[#2f4823] font-semibold">Google Account</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">📧</span>
                        <span className="text-[#2f4823] font-semibold">Email y contraseña</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ✅ FORMULARIO UNIFICADO - Edición
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal Editable */}
            <div>
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Información Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Fecha de cumpleaños
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none bg-gray-50 text-gray-600"
                    disabled
                  />
                  <p className="text-xs text-[#779385] mt-1">El email no se puede modificar</p>
                </div>
              </div>
            </div>

            {/* Comunicaciones y Marketing Unificado */}
            <div className="border-t border-[#779385]/20 pt-6">
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Comunicaciones y Marketing</h4>
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="marketing_emails"
                    checked={formData.marketing_emails}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                  />
                  <div>
                    <span className="font-medium text-[#2f4823]">Comunicaciones y Marketing</span>
                    <p className="text-sm text-[#779385] mt-1">
                      Recibir emails con: notificaciones de pedidos, ofertas especiales, nuevos productos,
                      newsletter espiritual y contenido de fe. Puedes desactivarlo cuando quieras.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Información de Solo Lectura */}
            <div className="bg-[#e8dfca] rounded-2xl p-4 border border-[#779385]/20">
              <h4 className="font-semibold text-[#2f4823] mb-2">Información que no se puede modificar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#779385]">Método de registro:</span>
                  <p className="text-[#2f4823] font-medium">
                    {user?.google_id ? 'Google Account' : 'Email y contraseña'}
                  </p>
                </div>
                <div>
                  <span className="text-[#779385]">Fecha de registro:</span>
                  <p className="text-[#2f4823] font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfileUnified;