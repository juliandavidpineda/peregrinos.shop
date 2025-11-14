import React, { useState } from 'react';

const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    birthdate: user?.birthdate || '',
    preferences: user?.preferences || {
      email_notifications: true,
      marketing_emails: user?.marketing_emails || false,
      newsletter: true
    }
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
        alert(result.error || 'Error al actualizar');
      }
    } catch (error) {
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#2f4823] font-serif">Configuración del Perfil</h3>
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
          // ✅ VISTA SIMPLIFICADA - Solo información básica
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Nombre completo</label>
                <p className="text-[#2f4823] font-semibold">{user?.name || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Teléfono</label>
                <p className="text-[#2f4823] font-semibold">{user?.phone || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Fecha de cumpleaños</label>
                <p className="text-[#2f4823] font-semibold">
                  {user?.birthdate ? new Date(user.birthdate).toLocaleDateString('es-ES') : 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Email</label>
                <p className="text-[#2f4823] font-semibold">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Estado de la cuenta</label>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  <span className="text-[#2f4823] font-semibold">
                    {user?.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SOLO PREFERENCIAS - Eliminado segmentación y estadísticas */}
            <div className="border-t border-[#779385]/20 pt-6">
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Preferencias de comunicación</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#2f4823]">Notificaciones por email</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user?.preferences?.email_notifications !== false
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {user?.preferences?.email_notifications !== false ? 'Activado' : 'Desactivado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2f4823]">Emails de marketing</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user?.marketing_emails
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {user?.marketing_emails ? 'Activado' : 'Desactivado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2f4823]">Newsletter espiritual</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user?.preferences?.newsletter !== false
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {user?.preferences?.newsletter !== false ? 'Activado' : 'Desactivado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Formulario de edición (igual que antes)
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">Nombre completo *</label>
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
                <label className="block text-sm font-medium text-[#2f4823] mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            {/* Preferencias editables */}
            <div className="border-t border-[#779385]/20 pt-6">
              <h4 className="text-lg font-semibold text-[#2f4823] mb-4">Preferencias de comunicación</h4>
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="preferences.email_notifications"
                    checked={formData.preferences.email_notifications}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                  />
                  <div>
                    <span className="font-medium text-[#2f4823]">Notificaciones por email</span>
                    <p className="text-sm text-[#779385] mt-1">Recibir notificaciones sobre tus pedidos y cuenta</p>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="preferences.marketing_emails"
                    checked={formData.preferences.marketing_emails}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                  />
                  <div>
                    <span className="font-medium text-[#2f4823]">Emails de marketing</span>
                    <p className="text-sm text-[#779385] mt-1">Ofertas especiales, nuevos productos y contenido espiritual</p>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="preferences.newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                  />
                  <div>
                    <span className="font-medium text-[#2f4823]">Newsletter espiritual</span>
                    <p className="text-sm text-[#779385] mt-1">Reflexiones, santoral y contenido de fe semanal</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-6 border-t border-[#779385]/20">
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

export default UserProfile;