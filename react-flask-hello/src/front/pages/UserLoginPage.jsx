import React from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const UserLoginPage = () => {
    const { loginWithGoogle, user, logout, loading } = useUserAuth();

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        
        const result = await loginWithGoogle(credentialResponse.credential);
        
        if (result.success) {
            console.log('✅ Login exitoso:', result.user);
            // Redirigir a la página principal
            window.location.href = '/';
        } else {
            console.error('❌ Error en login:', result.error);
            alert('Error en el login: ' + result.error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google Login Failed');
        alert('Error al conectar con Google');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <img 
                        src={user.picture} 
                        alt={user.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">¡Hola, {user.name}!</h2>
                    <p className="text-gray-600 mb-4">{user.email}</p>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
                <p className="text-gray-600 mt-2">Accede a tu cuenta de Peregrinos Shop</p>
            </div>
            
            <div className="flex justify-center">
                <GoogleLoginButton 
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                />
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>Al iniciar sesión, aceptas nuestros términos y condiciones</p>
            </div>
        </div>
    );
};

export default UserLoginPage;