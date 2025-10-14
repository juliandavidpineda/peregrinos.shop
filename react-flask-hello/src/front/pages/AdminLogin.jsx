import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Error en el login');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 font-serif font-bold text-4xl text-[#2f4823]">
            Peregrinos.shop
          </h2>
          <p className="mt-2 text-sm text-[#779385]">
            Panel Administrativo
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-[#779385]/20" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2f4823] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-4 py-3 border border-[#779385]/30 rounded-lg placeholder-[#779385]/50 text-[#2f4823] focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                placeholder="admin@peregrinos.shop"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2f4823] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-4 py-3 border border-[#779385]/30 rounded-lg placeholder-[#779385]/50 text-[#2f4823] focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-[#2f4823] transition-all bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2f4823] hover:bg-[#1f3219] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f4823] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          {/* Credenciales de prueba */}
          <div className="mt-6 p-4 bg-[#f7f2e7] rounded-lg border border-[#779385]/20">
            <p className="text-xs text-[#779385] text-center">
              <strong>Credenciales de prueba:</strong><br />
              admin@peregrinos.shop / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;