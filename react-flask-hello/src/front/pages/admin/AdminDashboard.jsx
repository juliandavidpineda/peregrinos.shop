import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './dashboard/hooks/useDashboardData';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsGrid from './dashboard/StatsGrid';
import QuickActions from './dashboard/QuickActions';
import RecentActivity from './dashboard/RecentActivity';
import RecentOrders from './dashboard/RecentOrders';
import SalesChart from './dashboard/SalesChart';
import TopProducts from './dashboard/TopProducts';
import Reminders from './dashboard/Reminders';
import KeyMetrics from './dashboard/KeyMetrics';
import Notifications from './dashboard/Notifications';

const AdminDashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { products, categories, orders, loading, error, refetch } = useDashboardData();

  // Helper functions
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

      if (diffMins < 1) return 'Hace unos segundos';
      if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
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
      case 'add-product': navigate('/admin/products'); break;
      case 'manage-categories': navigate('/admin/categories'); break;
      case 'view-reports': navigate('/admin/orders'); break;
      default: break;
    }
  };

  // Calculate dashboard stats
  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.created_at).toDateString() === today
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Generate recent activity
    const recentActivity = [];
    const recentOrdersForActivity = orders.slice(0, 3);
    
    recentOrdersForActivity.forEach(order => {
      recentActivity.push({
        type: 'order',
        message: 'Nuevo pedido recibido',
        details: `Orden ${formatOrderId(order.id)} - ${order.customer_name}`,
        timestamp: order.created_at,
        icon: '✅',
        color: 'bg-green-100 text-green-600'
      });
    });

    if (products.length > 0) {
      recentActivity.push({
        type: 'product',
        message: 'Productos disponibles',
        details: `${products.length} productos en tienda`,
        timestamp: new Date().toISOString(),
        icon: '👕',
        color: 'bg-blue-100 text-blue-600'
      });
    }

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      todayOrders: todayOrders.length,
      monthlyRevenue,
      recentOrders: orders.slice(0, 5),
      recentActivity: recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    };
  };

  const stats = calculateStats();

  // Auth and loading states
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

  if (!authLoading && !isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  return (
    <div className="space-y-8 p-6">
      <DashboardHeader
        user={user}
        currentTime={formatColombiaTime(new Date().toISOString())}
        onRefresh={refetch}
        error={error}
      />

      <StatsGrid stats={stats} formatPrice={formatPrice} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions onAction={handleQuickAction} />
        <RecentActivity 
          activities={stats.recentActivity} 
          formatTimeAgo={formatTimeAgo} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart orders={orders} />
        <TopProducts products={products} orders={orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders 
          orders={stats.recentOrders}
          formatOrderId={formatOrderId}
          formatPrice={formatPrice}
          formatTimeAgo={formatTimeAgo}
        />
        <Reminders 
          orders={orders}
          formatOrderId={formatOrderId}
          formatTimeAgo={formatTimeAgo}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KeyMetrics orders={orders} products={products} />
        <Notifications products={products} orders={orders} />
      </div>
    </div>
  );
};

export default AdminDashboard;