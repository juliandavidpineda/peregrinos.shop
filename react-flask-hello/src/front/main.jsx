import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';  // Importar AuthProvider
import { Toaster } from 'react-hot-toast';  // Importar Toaster para los toast notifications

const Main = () => {
    
    if(! import.meta.env.VITE_BACKEND_URL ||  import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
              <BackendURL/ >
        </React.StrictMode>
        );
    return (
        <React.StrictMode>  
            {/* Provide global state to all components */}
            <StoreProvider> 
                {/* Provide authentication context */}
                <AuthProvider>
                    <CartProvider>
                        {/* Set up routing for the application */} 
                        <RouterProvider router={router}>
                        </RouterProvider>
                        
                        {/* Toast notifications container - debe estar dentro de los providers pero fuera del RouterProvider */}
                        <Toaster 
                            position="top-right"
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
                </AuthProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />);