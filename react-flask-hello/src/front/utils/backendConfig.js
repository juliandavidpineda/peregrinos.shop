export const getBackendUrl = () => {
  // En desarrollo, usa localhost:3001 (backend Flask)
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3001';
  }
  // En producción, usa tu URL de Render/Heroku
  return import.meta.env.VITE_BACKEND_URL || 'https://tu-backend.onrender.com';
};

export const BACKEND_URL = getBackendUrl();