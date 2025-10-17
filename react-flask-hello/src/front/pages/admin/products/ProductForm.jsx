import React, { useState, useEffect } from 'react';
import MediaUpload from './MediaUpload';

const ProductForm = ({ product, categories, onSave, onClose, onProductUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    subcategory: '',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [''],
    stock_quantity: 0,
    in_stock: true,
    is_new: false,
    is_on_sale: false,
    material: '',
    cuidados: '',
    origen: '',
    disponibilidad: '',
    costo_prenda: '',
    videos: []
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
  console.log('📊 FormData actual:', {
    images: formData.images,
    imagesCount: formData.images?.length,
    activeTab: activeTab
  });
}, [formData.images, activeTab]);

  useEffect(() => {
    if (product) {
      console.log('🔄 Product changed:', product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category_id: product.category_id || '',
        subcategory: product.subcategory || '',
        images: product.images || [],
        sizes: product.sizes || ['S', 'M', 'L', 'XL'],
        features: product.features?.length > 0 ? product.features : [''],
        stock_quantity: product.stock_quantity || 0,
        in_stock: product.in_stock ?? true,
        is_new: product.is_new || false,
        is_on_sale: product.is_on_sale || false,
        material: product.material || '',
        cuidados: product.cuidados || '',
        origen: product.origen || '',
        disponibilidad: product.disponibilidad || '',
        costo_prenda: product.costo_prenda || '',
        videos: product.videos || []
      });
      console.log('📸 Images loaded:', product.images);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // ✅ CORREGIDO: Actualizar multimedia Y mantener los cambios
  const handleMediaUpdate = (updatedProduct) => {
    console.log('🔄 Media updated:', updatedProduct);
    console.log('📸 New images:', updatedProduct.images);
    console.log('🎥 New videos:', updatedProduct.videos);
    
    // ✅ ACTUALIZAR formData inmediatamente
    setFormData(prev => {
      const newState = {
        ...prev,
        images: updatedProduct.images || [],
        videos: updatedProduct.videos || []
      };
      console.log('✅ FormData actualizado:', newState.images);
      return newState;
    });
    
    // ✅ FORZAR RE-RENDER del MediaUpload para que muestre las imágenes actualizadas
  setTimeout(() => {
    // Esto hará que MediaUpload reciba las nuevas props
  }, 100);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setActiveTab('basic');
      return;
    }

    // ✅ IMPORTANTE: Usar formData.images actualizado por MediaUpload
    const cleanData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      costo_prenda: formData.costo_prenda ? parseFloat(formData.costo_prenda) : null,
      features: formData.features.filter(f => f.trim()),
      // ✅ Asegurar que images y videos se envíen correctamente
      images: formData.images || [],
      videos: formData.videos || []
    };

    console.log('📦 Saving product data:', cleanData);

    onSave(cleanData);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Información Básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2f4823] border-b border-[#779385]/20 pb-2">
          📝 Información Básica
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
            placeholder="Ej: Camiseta San José"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
            placeholder="Describe el producto..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Precio *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="50000"
              min="0"
              step="1000"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Precio Original (opcional)
            </label>
            <input
              type="number"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="70000"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </div>

      {/* Categorización */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2f4823] border-b border-[#779385]/20 pb-2">
          📁 Categorización
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Categoría *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Subcategoría (opcional)
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="Ej: Prenda"
            />
          </div>
        </div>
      </div>

      {/* Tallas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2f4823] border-b border-[#779385]/20 pb-2">
          👕 Tallas Disponibles
        </h3>
        <div className="flex gap-3 flex-wrap">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                formData.sizes.includes(size)
                  ? 'bg-[#2f4823] text-white'
                  : 'bg-[#f7f2e7] text-[#2f4823] hover:bg-[#779385]/20'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Características */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2f4823] border-b border-[#779385]/20 pb-2">
            ✨ Características
          </h3>
          <button
            type="button"
            onClick={addFeatureField}
            className="text-sm text-[#779385] hover:text-[#2f4823] font-medium"
          >
            + Agregar característica
          </button>
        </div>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="Ej: Algodón 100%"
            />
            {formData.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeatureField(index)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Inventario */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2f4823] border-b border-[#779385]/20 pb-2">
          📦 Inventario
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Cantidad en Stock
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
            min="0"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="w-5 h-5 text-[#2f4823] rounded focus:ring-2 focus:ring-[#779385]"
            />
            <span className="text-sm font-medium text-[#2f4823]">
              Disponible para venta
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleChange}
              className="w-5 h-5 text-[#2f4823] rounded focus:ring-2 focus:ring-[#779385]"
            />
            <span className="text-sm font-medium text-[#2f4823]">
              Marcar como nuevo
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_on_sale"
              checked={formData.is_on_sale}
              onChange={handleChange}
              className="w-5 h-5 text-[#2f4823] rounded focus:ring-2 focus:ring-[#779385]"
            />
            <span className="text-sm font-medium text-[#2f4823]">
              En oferta
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2f4823] border-b border-[#779385]/20 pb-2">
          🔍 Detalles del Producto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="Ej: Algodón 100% orgánico"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Origen
            </label>
            <input
              type="text"
              name="origen"
              value={formData.origen}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="Ej: Hecho en Colombia"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2f4823] mb-2">
            Cuidados
          </label>
          <textarea
            name="cuidados"
            value={formData.cuidados}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
            placeholder="Ej: Lavar a mano, no usar blanqueador, secar a la sombra"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Disponibilidad
            </label>
            <input
              type="text"
              name="disponibilidad"
              value={formData.disponibilidad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="Ej: 3-5 días hábiles"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2f4823] mb-2">
              Costo de Prenda (Interno)
            </label>
            <input
              type="number"
              name="costo_prenda"
              value={formData.costo_prenda}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#779385]/30 rounded-lg focus:ring-2 focus:ring-[#779385] focus:border-transparent"
              placeholder="Costo interno para cálculos"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      {product ? (
        <MediaUpload
          key={`media-${product.id}-${formData.images?.length || 0}`} // ✅ Forzar re-render cuando cambien las imágenes
          productId={product.id}
          onMediaUpdate={handleMediaUpdate}
          existingImages={formData.images}
          existingVideos={formData.videos}
        />
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg font-semibold text-[#2f4823] mb-2">
            Primero guarda la información básica
          </p>
          <p className="text-gray-600 mb-4">
            Completa la información en las pestañas "Básico" y "Detalles", luego guarda el producto para poder subir imágenes y videos.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className="px-6 py-3 bg-[#2f4823] text-white rounded-lg hover:bg-[#1f3219] transition-colors font-semibold"
          >
            Ir a Información Básica
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        
        {/* Header */}
        <div className="bg-[#2f4823] text-white p-6 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold font-serif">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#779385] transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#779385]/20">
          <div className="flex space-x-1 px-6 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-white border-t border-l border-r border-[#779385]/30 text-[#2f4823]'
                  : 'text-[#779385] hover:text-[#2f4823]'
              }`}
            >
              📝 Básico
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-white border-t border-l border-r border-[#779385]/30 text-[#2f4823]'
                  : 'text-[#779385] hover:text-[#2f4823]'
              }`}
            >
              🔍 Detalles
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'media'
                  ? 'bg-white border-t border-l border-r border-[#779385]/30 text-[#2f4823]'
                  : 'text-[#779385] hover:text-[#2f4823]'
              }`}
            >
              🖼️ Multimedia ({formData.images?.length || 0})
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
          
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'details' && renderDetails()}
          {activeTab === 'media' && renderMedia()}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#779385]/20 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#779385] text-[#779385] rounded-lg hover:bg-[#779385]/10 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#2f4823] text-white rounded-lg hover:bg-[#1f3219] transition-colors font-semibold"
            >
              {product ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;