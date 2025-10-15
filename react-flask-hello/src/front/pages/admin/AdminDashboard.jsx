import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    recentOrders: [],
    recentActivity: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching dashboard data...');
      
      // Fetch data in parallel
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        productService.getProducts().catch(err => {
          console.error('Error fetching products:', err);
          return { products: [] };
        }),
        categoryService.getCategories().catch(err => {
          console.error('Error fetching categories:', err);
          return { categories: [] };
        }),
        orderService.getAllOrders(localStorage.getItem('admin_token')).catch(err => {
          console.error('Error fetching orders:', err);
          return { orders: [] };
        })
      ]);

      console.log('📊 Data received:', {
        products: productsRes.products?.length || 0,
        categories: categoriesRes.categories?.length || 0,
        orders: ordersRes.orders?.length || 0
      });

      const products = productsRes.products || [];
      const categories = categoriesRes.categories || [];
      const orders = ordersRes.orders || [];

      // Calculate today's orders
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => {
        try {
          const orderDate = new Date(order.created_at);
          return orderDate.toDateString() === today;
        } catch (e) {
          return false;
        }
      });

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyOrders = orders.filter(order => {
        try {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === currentMonth && 
                 orderDate.getFullYear() === currentYear;
        } catch (e) {
          return false;
        }
      });
      
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Get recent orders (last 5)
      const recentOrders = orders.slice(0, 5);

      // Generate recent activity from orders and products
      const recentActivity = generateRecentActivity(orders, products);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        todayOrders: todayOrders.length,
        monthlyRevenue,
        recentOrders,
        recentActivity
      });

      console.log('✅ Dashboard stats calculated:', {
        products: products.length,
        categories: categories.length,
        todayOrders: todayOrders.length,
        monthlyRevenue,
        recentOrders: recentOrders.length
      });

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (orders, products) => {
    const activity = [];
    
    // Add recent orders as activity (max 3)
    const recentOrders = orders.slice(0, 3);
    recentOrders.forEach(order => {
      activity.push({
        type: 'order',
        message: 'Nuevo pedido recibido',
        details: `Orden ${formatOrderId(order.id)} - ${order.customer_name}`,
        timestamp: order.created_at,
        icon: '✅',
        color: 'bg-green-100 text-green-600'
      });
    });

    // Add product activity if we have products
    if (products.length > 0) {
      activity.push({
        type: 'product',
        message: 'Productos disponibles',
        details: `${products.length} productos en tienda`,
        timestamp: new Date().toISOString(),
        icon: '👕',
        color: 'bg-blue-100 text-blue-600'
      });
    }

    // Add category activity if we have categories
    if (products.length === 0) {
      activity.push({
        type: 'info',
        message: 'Configuración inicial',
        details: 'Agrega productos y categorías para comenzar',
        timestamp: new Date().toISOString(),
        icon: '⚙️',
        color: 'bg-gray-100 text-gray-600'
      });
    }

    // Sort by timestamp (newest first)
    return activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatOrderId = (uuid) => {
    return `ORD-${uuid?.slice(0, 8).toUpperCase() || 'N/A'}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        return 'Hace unos segundos';
      } else if (diffMins < 60) {
        return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
      } else if (diffHours < 24) {
        return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
      } else {
        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
      }
    } catch (e) {
      return 'Reciente';
    }
  };

  const formatColombiaTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const colombiaOffset = -5 * 60;
      const localOffset = date.getTimezoneOffset();
      const offsetDiff = colombiaOffset + localOffset;
      const colombiaTime = new Date(date.getTime() + offsetDiff * 60000);
      
      return colombiaTime.toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha no disponible';
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-product':
        navigate('/admin/products');
        break;
      case 'manage-categories':
        navigate('/admin/categories');
        break;
      case 'view-reports':
        navigate('/admin/orders');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full ml-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsData = [
    { 
      label: 'Productos Totales', 
      value: stats.totalProducts.toString(), 
      icon: '👕', 
      color: 'bg-blue-500',
      description: 'Productos en inventario'
    },
    { 
      label: 'Categorías', 
      value: stats.totalCategories.toString(), 
      icon: '📁', 
      color: 'bg-green-500',
      description: 'Categorías activas'
    },
    { 
      label: 'Pedidos Hoy', 
      value: stats.todayOrders.toString(), 
      icon: '📦', 
      color: 'bg-yellow-500',
      description: 'Pedidos del día de hoy'
    },
    { 
      label: 'Ingresos Mes', 
      value: formatPrice(stats.monthlyRevenue), 
      icon: '💰', 
      color: 'bg-purple-500',
      description: 'Ingresos del mes actual'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-serif font-bold text-3xl text-[#2f4823]">
              Dashboard
            </h1>
            <p className="text-[#779385] mt-2">
              Bienvenido de vuelta, <span className="font-semibold">{user?.first_name} {user?.last_name}</span>
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-[#779385]">
              <span>📅 {formatColombiaTime(new Date().toISOString())}</span>
              <span>•</span>
              <span>🔄 <button onClick={fetchDashboardData} className="hover:text-[#2f4823] transition-colors underline">Actualizar datos</button></span>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-[#779385]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#2f4823] mt-1">{stat.value}</p>
                <p className="text-xs text-[#779385] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Activity Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
          <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
            Acciones Rápidas
          </h2>
          <div className="space-y-4">
            <button 
              onClick={() => handleQuickAction('add-product')}
              className="w-full p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl group-hover:scale-110 transition-transform">➕</div>
                <div>
                  <div className="font-medium">Agregar Producto</div>
                  <div className="text-sm">Crear nuevo producto en la tienda</div>
                </div>
              </div>
            </button>
            <button 
              onClick={() => handleQuickAction('manage-categories')}
              className="w-full p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl group-hover:scale-110 transition-transform">📁</div>
                <div>
                  <div className="font-medium">Gestionar Categorías</div>
                  <div className="text-sm">Organizar categorías de productos</div>
                </div>
              </div>
            </button>
            <button 
              onClick={() => handleQuickAction('view-reports')}
              className="w-full p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl group-hover:scale-110 transition-transform">📊</div>
                <div>
                  <div className="font-medium">Ver Reportes</div>
                  <div className="text-sm">Analizar órdenes y ventas</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
          <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-[#f7f2e7] rounded-lg hover:bg-[#e8dfd1] transition-colors">
                  <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-lg`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#2f4823]">{activity.message}</p>
                    <p className="text-sm text-[#779385]">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#779385]">
                <div className="text-4xl mb-2">📝</div>
                <p>No hay actividad reciente</p>
                <p className="text-sm mt-1">Los pedidos y actualizaciones aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif font-bold text-xl text-[#2f4823]">
            Pedidos Recientes
          </h2>
          <span className="text-sm text-[#779385]">
            {stats.recentOrders.length} pedidos
          </span>
        </div>
        <div className="space-y-3">
          {stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-[#f7f2e7] rounded-lg hover:bg-[#e8dfd1] transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-10 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-500' :
                    order.status === 'confirmed' ? 'bg-blue-500' :
                    order.status === 'shipped' ? 'bg-purple-500' :
                    'bg-green-500'
                  } group-hover:scale-110 transition-transform`}></div>
                  <div>
                    <p className="font-medium text-[#2f4823]">{formatOrderId(order.id)}</p>
                    <p className="text-sm text-[#779385]">{order.customer_name} • {order.customer_email}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(order.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#2f4823] text-lg">{formatPrice(order.total)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[#779385]">
              <div className="text-4xl mb-2">📦</div>
              <p>No hay pedidos recientes</p>
              <p className="text-sm mt-1">Los nuevos pedidos aparecerán aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;