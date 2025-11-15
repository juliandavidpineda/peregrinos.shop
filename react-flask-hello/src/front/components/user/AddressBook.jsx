import React, { useState } from 'react';

const AddressBook = ({ addresses, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    alias: '',
    address: '',
    city: '',
    department: '',
    postal_code: '',
    phone: '',
    instructions: '',
    is_primary: false
  });

  const resetForm = () => {
    setFormData({
      alias: '',
      address: '',
      city: '',
      department: '',
      postal_code: '',
      phone: '',
      instructions: '',
      is_primary: false
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (editingAddress) {
        result = await onUpdate(editingAddress.id, formData);
      } else {
        result = await onAdd(formData);
      }

      if (result.success) {
        resetForm();
      } else {
        alert(result.error || `Error al ${editingAddress ? 'actualizar' : 'agregar'} dirección`);
      }
    } catch (error) {
      alert(`Error al ${editingAddress ? 'actualizar' : 'agregar'} dirección`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      alias: address.alias || '',
      address: address.address || '',
      city: address.city || '',
      department: address.department || '',
      postal_code: address.postal_code || '',
      phone: address.phone || '',
      instructions: address.special_instructions || address.instructions || '',
      is_primary: address.is_primary || false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await onDelete(addressId);
      if (!result.success) {
        alert(result.error || 'Error al eliminar dirección');
      }
    } catch (error) {
      alert('Error al eliminar dirección');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila',
    'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
    'Putumayo', 'Quindío', 'Risaralda', 'San Andrés', 'Santander',
    'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#2f4823] font-serif mb-4 md:mb-0">
          Mis Direcciones
        </h3>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300 transform hover:scale-105"
          >
            + Agregar Dirección
          </button>
        )}
      </div>

      {/* Formulario de agregar/editar dirección */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-[#779385]/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-[#2f4823]">
              {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
            </h4>
            <button
              onClick={resetForm}
              className="text-[#779385] hover:text-[#2f4823] transition-colors duration-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Alias de la dirección *
                </label>
                <input
                  type="text"
                  name="alias"
                  value={formData.alias}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                  placeholder="Ej: Casa, Oficina, Apartamento"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Teléfono de contacto *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2f4823] mb-2">
                Dirección completa *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                placeholder="Calle, Número, Barrio"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                  placeholder="Ej: Medellín, Bogotá"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Departamento *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300 bg-white"
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                  placeholder="110111"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2f4823] mb-2">
                Instrucciones especiales de entrega
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-[#779385]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Ej: Timbre azul, portería, llamar antes de entregar..."
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
              />
              <label className="text-sm font-medium text-[#2f4823]">
                Establecer como dirección principal
              </label>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-[#779385]/20">
              <button
                type="button"
                onClick={resetForm}
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
                {loading ? 'Guardando...' : editingAddress ? 'Actualizar Dirección' : 'Agregar Dirección'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de direcciones */}
      <div className="space-y-4">
        {addresses.length === 0 && !showAddForm ? (
          <div className="bg-[#f7f2e7] rounded-2xl p-12 border border-[#779385]/20 text-center">
            <div className="text-6xl mb-4 text-[#779385]">🏠</div>
            <h4 className="text-xl font-semibold text-[#2f4823] mb-2">No tienes direcciones guardadas</h4>
            <p className="text-[#779385] mb-6 max-w-md mx-auto">
              Agrega tu primera dirección para facilitar tus compras futuras en Peregrinos Shop.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-[#2f4823] text-white rounded-2xl font-semibold hover:bg-[#1f3219] transition-all duration-300 transform hover:scale-105"
            >
              Agregar Mi Primera Dirección
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="font-bold text-[#2f4823] text-lg">{address.alias}</h4>
                      {address.is_primary && (
                        <span className="px-2 py-1 bg-[#2f4823] text-white text-xs rounded-full font-medium">
                          PRINCIPAL
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-[#2f4823]">
                      <p className="font-medium">{address.address}</p>
                      <p>
                        {address.city}, {address.department}
                        {address.postal_code && ` • ${address.postal_code}`}
                      </p>
                      <p className="text-[#779385]">📞 {address.phone}</p>
                      
                      {address.instructions && (
                        <div className="mt-3 p-3 bg-[#f7f2e7] rounded-2xl border border-[#779385]/20">
                          <p className="text-sm text-[#2f4823]">
                            <span className="font-semibold">Instrucciones:</span> {address.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEdit(address)}
                      className="px-4 py-2 text-sm border border-[#779385] text-[#779385] rounded-2xl font-semibold hover:bg-[#779385] hover:text-white transition-all duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      {addresses.length > 0 && (
        <div className="mt-6 bg-[#f7f2e7] rounded-2xl p-6 border border-[#779385]/20">
          <h4 className="font-semibold text-[#2f4823] mb-3">💡 Información sobre direcciones</h4>
          <ul className="text-sm text-[#779385] space-y-2">
            <li>• La dirección principal se usará por defecto en tus compras</li>
            <li>• Puedes tener múltiples direcciones (casa, oficina, etc.)</li>
            <li>• Las instrucciones especiales ayudan al mensajero con la entrega</li>
            <li>• Actualiza tu teléfono para que el mensajero pueda contactarte</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddressBook;