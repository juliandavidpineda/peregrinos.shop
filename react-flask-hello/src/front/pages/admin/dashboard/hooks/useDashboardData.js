import { useState, useEffect } from 'react';
import { orderService } from '../../../../services/orderService';
import { productService } from '../../../../services/productService';
import { categoryService } from '../../../../services/categoryService';

export const useDashboardData = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    orders: [],
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        productService.getProducts().catch(() => ({ products: [] })),
        categoryService.getCategories().catch(() => ({ categories: [] })),
        orderService.getAllOrders(localStorage.getItem('admin_token')).catch(() => ({ orders: [] }))
      ]);

      setData({
        products: productsRes.products || [],
        categories: categoriesRes.categories || [],
        orders: ordersRes.orders || [],
        loading: false,
        error: null
      });

    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los datos del dashboard'
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { ...data, refetch: fetchDashboardData };
};