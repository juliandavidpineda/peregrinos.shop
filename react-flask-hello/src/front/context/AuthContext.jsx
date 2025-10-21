import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = authService.getToken();
    const currentUser = authService.getCurrentUser();
    
    if (token && currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.adminLogin(email, password);
      
      setUser(response.admin);
      setIsAuthenticated(true);
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error en el login' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verificar si tiene rol de admin
  const hasRole = (role) => {
  if (!user) return false;
  return user.role?.toLowerCase() === role.toLowerCase();
};

  // Verificar si es superadmin
  const isSuperAdmin = () => {
  if (!user) return false;
  return user.role?.toLowerCase() === 'superadmin';
};

  // Verificar si es admin (cualquier rol)
  const isAdmin = () => {
    return isAuthenticated && user && ['superadmin', 'editor', 'content_manager'].includes(user.role);
  };

  // 🔄 NUEVAS FUNCIONES AGREGADAS
  const refreshUser = async () => {
    try {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();
      if (token && currentUser) {
        // Podríamos hacer una llamada al API para obtener datos frescos
        // Por ahora actualizamos con los datos de localStorage
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const response = await userService.updateOwnProfile(userData);
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('admin_user', JSON.stringify(response.user));
        return { success: true, data: response };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error updating profile' 
      };
    }
  };

  const changePassword = async (newPassword) => {
    try {
      const response = await userService.changeOwnPassword(newPassword);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error changing password' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    isSuperAdmin,
    isAdmin,
    checkAuth,
    // 🔄 NUEVAS FUNCIONES
    refreshUser,
    updateUserProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;