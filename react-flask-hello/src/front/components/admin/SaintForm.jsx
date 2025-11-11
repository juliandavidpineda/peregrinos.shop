import React, { useState, useEffect } from 'react';
import { saintService } from '../../services/saintService';

const SaintForm = ({ saint, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    feast_day: '',
    summary: '',
    biography: '',
    image: '',
    birth_date: '',
    death_date: '',
    canonization_date: '',
    patronage: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (saint) {
      setFormData({
        name: saint.name || '',
        feast_day: saint.feast_day || '',
        summary: saint.summary || '',
        biography: saint.biography || '',
        image: saint.image || '',
        birth_date: saint.birth_date || '',
        death_date: saint.death_date || '',
        canonization_date: saint.canonization_date || '',
        patronage: saint.patronage || '',
        featured: saint.featured || false
      });
    }
  }, [saint]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.name.trim() || !formData.feast_day.trim() || !formData.summary.trim()) {
      setError('Nombre, festividad y resumen son requeridos');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let response;

      if (saint) {
        // Actualizar santo existente
        response = await saintService.updateSaint(saint.id, formData, token);
      } else {
        // Crear nuevo santo
        response = await saintService.createSaint(formData, token);
      }

      if (response.success) {
        onSuccess();
      } else {
        setError(response.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving saint:', error);
      setError('Error de conexión al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-[#2f4823] text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {saint ? 'Editar Santo' : 'Nuevo Santo'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#779385] text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Columna 1 - Información básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="Ej: San Francisco de Asís"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Fecha de festividad *
                </label>
                <input
                  type="text"
                  name="feast_day"
                  value={formData.feast_day}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="Ej: 4 de Octubre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Resumen *
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="Breve descripción del santo..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  URL de imagen
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2f4823] border-[#779385] rounded focus:ring-[#2f4823]"
                />
                <label className="text-sm font-medium text-[#2f4823]">
                  Destacar en página principal
                </label>
              </div>
            </div>

            {/* Columna 2 - Información adicional */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Biografía completa
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows="6"
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="Biografía detallada del santo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="text"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                    placeholder="Ej: 1182"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Fecha de muerte
                  </label>
                  <input
                    type="text"
                    name="death_date"
                    value={formData.death_date}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                    placeholder="Ej: 1226"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Fecha de canonización
                </label>
                <input
                  type="text"
                  name="canonization_date"
                  value={formData.canonization_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="Ej: 16 de Julio de 1228"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Patronazgos
                </label>
                <input
                  type="text"
                  name="patronage"
                  value={formData.patronage}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#2f4823] focus:border-transparent"
                  placeholder="Ej: Animales, ecología, paz"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#779385]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[#779385] text-[#779385] rounded-lg hover:bg-[#779385] hover:text-white transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#2f4823] text-white rounded-lg hover:bg-[#1f3219] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : (saint ? 'Actualizar' : 'Crear Santo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaintForm;