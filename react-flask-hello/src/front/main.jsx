import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext'
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Importar aquí

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Main = () => {
    
    if(! import.meta.env.VITE_BACKEND_URL ||  import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
              <BackendURL />
        </React.StrictMode>
    );
    
    return (
        <React.StrictMode>  
            {/* ✅ Google OAuth Provider envuelve toda la app */}
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <StoreProvider> 
                    <AuthProvider>
                        <UserAuthProvider>
                            <CartProvider>
                                <RouterProvider router={router} />
                                
                                <Toaster 
                                    position="bottom-center"
                                    toastOptions={{
                                        duration: 3000,
                                        style: {
                                            background: '#f7f2e7',
                                            color: '#2f4823',
                                            border: '1px solid #779385',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            boxShadow: '0 4px 12px rgba(47, 72, 35, 0.1)',
                                        },
                                        success: {
                                            duration: 3000,
                                            style: {
                                                background: '#f0fdf4',
                                                color: '#166534',
                                                border: '1px solid #bbf7d0',
                                                borderRadius: '12px',
                                            },
                                            iconTheme: {
                                                primary: '#16a34a',
                                                secondary: '#fff',
                                            },
                                        },
                                        error: {
                                            duration: 4000,
                                            style: {
                                                background: '#fef2f2',
                                                color: '#dc2626',
                                                border: '1px solid #fecaca',
                                                borderRadius: '12px',
                                            },
                                            iconTheme: {
                                                primary: '#dc2626',
                                                secondary: '#fff',
                                            },
                                        },
                                    }}
                                />
                            </CartProvider>
                        </UserAuthProvider>
                    </AuthProvider>
                </StoreProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);