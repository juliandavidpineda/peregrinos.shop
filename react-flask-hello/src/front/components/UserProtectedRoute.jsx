// components/UserProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto"></div>
          <p className="mt-4 text-[#2f4823]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectedRoute;