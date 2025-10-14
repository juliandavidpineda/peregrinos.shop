import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, hasRole, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto"></div>
          <p className="mt-4 text-[#2f4823]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login guardando la ubicación actual
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2f4823] mb-4">Acceso Denegado</h2>
          <p className="text-[#779385]">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-[#779385] mt-2">
            Rol actual: <span className="font-semibold">{user?.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;