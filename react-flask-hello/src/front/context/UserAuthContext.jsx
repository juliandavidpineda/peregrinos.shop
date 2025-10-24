import React, { createContext, useContext, useState, useEffect } from 'react';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth debe ser usado dentro de un UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = () => {
    const token = localStorage.getItem('user_token');
    const currentUser = localStorage.getItem('user_data');
    
    if (token && currentUser) {
      setUser(JSON.parse(currentUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      setLoading(true);
      
      console.log('🎯 Enviando credential al backend...');
      console.log('📦 Credential (primeros 50 chars):', googleToken.substring(0, 50));
      
      const response = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: googleToken }), // ✅ CORREGIDO
      });

      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);

      if (data.success) {
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error en loginWithGoogle:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    logout,
    checkUserAuth
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};