import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image_url: '' });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(category.id);
      toast.success('Categoría eliminada exitosamente');
      fetchCategories();
    } catch (error) {
      const message = error.message || 'Error al eliminar la categoría';
      toast.error(message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Categoría creada exitosamente');
      }

      setShowModal(false);
      fetchCategories();
    } catch (error) {
      const message = error.message || 'Error al guardar la categoría';
      toast.error(message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif font-bold text-3xl text-[#2f4823]">
              Gestión de Categorías
            </h1>
            <p className="text-[#779385] mt-1">
              {categories.length} categorías • {categories.reduce((sum, cat) => sum + (cat.product_count || 0), 0)} productos totales
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-[#2f4823] hover:bg-[#1f3219] text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <span>➕</span>
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Lista de Categorías */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-[#2f4823] mb-2">
              No hay categorías creadas
            </h3>
            <p className="text-[#779385] mb-4">
              Comienza creando tu primera categoría para organizar los productos
            </p>
            <button
              onClick={handleCreate}
              className="bg-[#2f4823] hover:bg-[#1f3219] text-white px-6 py-2 rounded-lg"
            >
              Crear Primera Categoría
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-[#779385]/20 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* IMAGEN DE CATEGORÍA */}
                {category.image_url ? (
                  <div className="mb-3">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-lg bg-[#f7f2e7]"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className="w-full h-32 bg-[#f7f2e7] rounded-lg flex items-center justify-center text-[#779385] hidden"
                    >
                      <span>🖼️ Imagen no disponible</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-[#f7f2e7] rounded-lg flex items-center justify-center text-[#779385] mb-3">
                    <span>📁 Sin imagen</span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-[#2f4823] text-lg">
                    {category.name}
                  </h3>
                  <span className="bg-[#f7f2e7] text-[#2f4823] px-2 py-1 rounded-full text-sm font-medium">
                    {category.product_count || 0} productos
                  </span>
                </div>

                {category.description && (
                  <p className="text-[#779385] text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-[#779385] hover:bg-[#5a7265] text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 px-3 rounded text-sm transition-colors"
                    disabled={category.product_count > 0}
                    title={category.product_count > 0 ? 'No se puede eliminar categoría con productos' : ''}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-[#2f4823] text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold font-serif">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
                  placeholder="Ej: Ropa, Accesorios, Hogar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
                  placeholder="Describe esta categoría..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2f4823] mb-2">
                  URL de imagen (opcional)
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              {formData.image_url && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-[#2f4823] mb-2">
                    Vista previa:
                  </label>
                  <img
                    src={formData.image_url}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover rounded-lg border border-[#779385]/30"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-32 h-32 bg-[#f7f2e7] rounded-lg flex items-center justify-center text-[#779385] text-sm hidden border border-[#779385]/30">
                    Imagen no disponible
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-[#779385] text-[#779385] rounded-lg hover:bg-[#779385]/10 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#2f4823] text-white rounded-lg hover:bg-[#1f3219] transition-colors font-semibold"
                >
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;