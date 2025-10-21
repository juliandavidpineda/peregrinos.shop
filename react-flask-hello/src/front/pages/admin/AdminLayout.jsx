import React, { useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // 🔥 SOLUCIÓN: Usar useMemo para que se recalcule cuando cambie isSuperAdmin
  const menuItems = useMemo(() => {
        
    const items = [
      { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', show: true },
      { path: '/admin/products', label: 'Productos', icon: '👕', show: true },
      { path: '/admin/categories', label: 'Categorías', icon: '📁', show: true },
      { path: '/admin/orders', label: 'Pedidos', icon: '📦', show: true },
      { path: '/admin/users', label: 'Usuarios', icon: '👥', show: isSuperAdmin() },
    ];

    const visibleItems = items.filter(item => item.show);
    
    return visibleItems;
  }, [isSuperAdmin]); // Se recalcula cuando cambia isSuperAdmin

  return (
    <div className="min-h-screen bg-[#f7f2e7]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#2f4823] text-white shadow-lg z-50">
        {/* Header */}
        <div className="p-6 border-b border-[#779385]/30">
          <h1 className="font-serif font-bold text-2xl">Peregrinos.shop</h1>
          <p className="text-sm text-[#779385] mt-1">Panel Administrativo</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-[#779385]/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#779385] rounded-full flex items-center justify-center">
                <span className="font-semibold">
                  {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-[#779385] capitalize">
                  {user.role === 'superadmin' ? 'Super Admin' : 
                   user.role === 'content_manager' ? 'Content Manager' : 
                   user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#779385] text-white'
                  : 'text-[#779385] hover:bg-[#779385]/20 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#779385]/30 bg-[#2f4823]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;