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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = () => {
    const token = localStorage.getItem('user_token');
    const currentUser = localStorage.getItem('user_data');

    if (token && currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
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
        body: JSON.stringify({ credential: googleToken }),
      });

      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);

      if (data.success) {
        // ✅ NUEVO: Verificar si necesita aceptar términos
        if (data.needs_terms_acceptance) {
          console.log('📝 Usuario necesita aceptar términos');
          setPendingUser({
            user: data.user,
            token: data.token
          });
          setShowTermsModal(true);
          return { 
            success: true, 
            user: data.user, 
            needsTermsAcceptance: true 
          };
        } else {
          // ✅ Flujo normal - usuario ya aceptó términos
          localStorage.setItem('user_token', data.token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
          setUser(data.user);
          setIsAuthenticated(true);
          return { success: true, user: data.user };
        }
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

  // ✅ NUEVA FUNCIÓN: Aceptar términos legales
  const acceptLegalTerms = async (legalData) => {
    try {
      setLoading(true);
      
      if (!pendingUser) {
        throw new Error('No hay usuario pendiente');
      }

      const response = await fetch('http://localhost:3001/api/auth/accept-legal-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: pendingUser.user.id,
          ...legalData
        }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Guardar token y datos actualizados
        localStorage.setItem('user_token', pendingUser.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        setShowTermsModal(false);
        setPendingUser(null);
        
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || 'Error al aceptar términos');
      }
    } catch (error) {
      console.error('❌ Error en acceptLegalTerms:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Cerrar modal de términos
  const closeTermsModal = () => {
    setShowTermsModal(false);
    setPendingUser(null);
    // También limpiamos el localStorage por seguridad
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
    setShowTermsModal(false);
    setPendingUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    logout,
    checkUserAuth,
    // ✅ NUEVAS PROPIEDADES
    showTermsModal,
    pendingUser,
    acceptLegalTerms,
    closeTermsModal
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};