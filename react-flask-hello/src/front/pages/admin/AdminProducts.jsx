import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductList from './products/ProductList';
import ProductForm from './products/ProductForm';
import ProductFilters from './products/ProductFilters';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formKey, setFormKey] = useState(0); // ✅ Para forzar re-render del form
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, navigate]);

const fetchData = async () => {
  try {
    setLoading(true);
    
    // ✅ Obtener productos
    const productsRes = await productService.getProducts();
    const productsData = productsRes.products || [];
    console.log('📦 Products data:', productsData);
    
    // ✅ Obtener categorías con debug completo
    console.log('🔄 Fetching categories...');
    const categoriesRes = await categoryService.getCategories();
    console.log('📂 Categories response:', categoriesRes);
    
    const categoriesData = categoriesRes.categories || [];
    console.log('🎯 Final categories data:', categoriesData);
    console.log('🔢 Number of categories:', categoriesData.length);

    setProducts(productsData);
    setFilteredProducts(productsData);
    setCategories(categoriesData);
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    setProducts([]);
    setFilteredProducts([]);
    setCategories([]);
  } finally {
    setLoading(false);
  }
};

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      await fetchData();
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Error al eliminar el producto');
    }
  };

const handleSave = async (productData) => {
  try {
    console.log('📦 Saving product data:', productData);
    console.log('🔑 Token exists:', !!localStorage.getItem('admin_token'));
    
    let savedProductResponse;
    
    if (editingProduct) {
      // ✅ ACTUALIZAR PRODUCTO EXISTENTE
      savedProductResponse = await productService.updateProduct(editingProduct.id, productData);
      
      // ✅ Obtener el producto actualizado del servidor
      const refreshedProduct = await productService.getProductById(editingProduct.id);
      const updatedProduct = refreshedProduct.product;
      
      console.log('🔄 Product refreshed from server:', updatedProduct);
      
      // ✅ ACTUALIZAR editingProduct con los datos más recientes
      setEditingProduct(updatedProduct);
      setFormKey(prev => prev + 1);
      
      // ✅ Actualizar la lista de productos
      await fetchData();
      
      // ❌ QUITAR el cierre automático del modal
      // toast.success('✅ Producto actualizado correctamente');
      
    } else {
      // ✅ CREAR PRODUCTO NUEVO
      savedProductResponse = await productService.createProduct(productData);
      const newProduct = savedProductResponse.product;
      
      console.log('🆕 New product created:', newProduct);
      
      // ✅ Cambiar a modo edición con el producto recién creado
      setEditingProduct(newProduct);
      setFormKey(prev => prev + 1);
      
      // ✅ Recargar lista
      await fetchData();
      
      toast.success('✅ Producto creado. Ahora puedes agregar imágenes y videos.');
    }
    
  } catch (error) {
    console.error('Error saving product:', error);
    toast.error(error.message || 'Error al guardar el producto');
  }
};

  const handleFilterChange = (filteredData) => {
    setFilteredProducts(filteredData);
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2f4823] font-serif">
            Gestión de Productos
          </h1>
          <p className="text-[#779385] text-sm mt-1">
            {user?.email} • {filteredProducts.length} productos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="bg-[#779385] hover:bg-[#5a7265] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Actualizar</span>
          </button>
          <button
            onClick={handleCreate}
            className="bg-[#2f4823] hover:bg-[#1f3219] text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <span>➕</span>
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        products={products}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Products List */}
      <ProductList
        products={filteredProducts}
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal Form */}
      {showModal && (
        <ProductForm
          key={formKey}
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onProductUpdate={async (updatedProduct) => {
            console.log('📸 Media change detected:', updatedProduct);
            console.log('📸 New images from server:', updatedProduct.images);

            try {
              // Pequeño delay para asegurar que el servidor procese la eliminación
              await new Promise(resolve => setTimeout(resolve, 500));

              const response = await productService.getProductById(updatedProduct.id);
              const freshProduct = response.product;

              console.log('🔄 Product reloaded:', freshProduct);
              console.log('🔄 Fresh images:', freshProduct.images);

              setEditingProduct(freshProduct);
              setFormKey(prev => prev + 1);

              fetchData().catch(err => console.error('Error updating list:', err));

            } catch (error) {
              console.error('❌ Error reloading product:', error);
              setEditingProduct(updatedProduct);
              setFormKey(prev => prev + 1);
            }
          }}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
            setFormKey(0);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;