import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';

const UserLoginPage = () => {
    const { loginWithGoogle, user, logout, loading } = useUserAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // true = login, false = register
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });

    const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('✅ Google Login Success');
      console.log('📦 Full response:', credentialResponse);
      
      // Verificar que viene el credential
      if (!credentialResponse?.credential) {
        console.error('❌ No credential in response');
        alert('Error: No se recibió credencial de Google');
        return;
      }
      
      const result = await loginWithGoogle(credentialResponse.credential);
      
      if (result.success) {
        console.log('✅ Login exitoso:', result.user);
        navigate('/');
      } else {
        console.error('❌ Error en login:', result.error);
        alert('Error en el login: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleGoogleSuccess:', error);
      alert('Error inesperado al iniciar sesión');
    }
};

    const handleGoogleError = () => {
        console.error('Google Login Failed');
        alert('Error al conectar con Google');
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí implementarías el login/registro tradicional
        console.log('Form data:', formData);
        alert(`Funcionalidad de ${isLogin ? 'login' : 'registro'} en desarrollo`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f7f2e7] to-[#e8dfca] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto mb-4"></div>
                    <p className="text-[#2f4823] font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f7f2e7] to-[#e8dfca] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-[#2f4823]/20">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#2f4823]/20">
                            <img 
                                src={user.picture} 
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-[#2f4823] mb-2">¡Hola, {user.name}!</h2>
                        <p className="text-gray-600 mb-6">{user.email}</p>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f7f2e7] to-[#e8dfca] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-[#2f4823]/20">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#2f4823] mb-2">
                        {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Ingresa a tu cuenta de Peregrinos Shop' : 'Únete a nuestra comunidad de fe'}
                    </p>
                </div>

                {/* Toggle Login/Register */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                            isLogin 
                                ? 'bg-[#2f4823] text-white shadow-lg' 
                                : 'text-gray-600 hover:text-[#2f4823]'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                            !isLogin 
                                ? 'bg-[#2f4823] text-white shadow-lg' 
                                : 'text-gray-600 hover:text-[#2f4823]'
                        }`}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Botón de Google */}
                <div className="flex justify-center mb-6">
                    <GoogleLoginButton 
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text={isLogin ? "signin_with" : "signup_with"}
                    />
                </div>
                {/* Separador */}
                <div className="flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">o continúa con</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            
                {/* Formulario Tradicional */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#2f4823] mb-2">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                                placeholder="Tu nombre completo"
                                required={!isLogin}
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-[#2f4823] mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[#2f4823] mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#2f4823] mb-2">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f4823] focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    {isLogin && (
                        <div className="text-right">
                            <button type="button" className="text-sm text-[#779385] hover:text-[#2f4823] transition-colors duration-300">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#2f4823] hover:bg-[#1f3723] text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </button>
                </form>


                

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#779385] hover:text-[#2f4823] font-semibold transition-colors duration-300"
                        >
                            {isLogin ? 'Regístrate' : 'Inicia sesión'}
                        </button>
                    </p>
                    <p className="mt-2">
                        Al {isLogin ? 'iniciar sesión' : 'registrarte'}, aceptas nuestros{' '}
                        <button className="text-[#779385] hover:text-[#2f4823] transition-colors duration-300">
                            términos y condiciones
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;