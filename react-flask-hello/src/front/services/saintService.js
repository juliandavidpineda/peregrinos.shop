import { getBackendUrl } from '../utils/backendConfig';

const API_URL = getBackendUrl();

export const saintService = {
    // Obtener todos los santos
    getSaints: async () => {
        try {
            const response = await fetch(`${API_URL}/api/saints`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching saints:', error);
            throw error;
        }
    },

    // Obtener santos destacados
    getFeaturedSaints: async () => {
        try {
            const response = await fetch(`${API_URL}/api/saints/featured`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching featured saints:', error);
            throw error;
        }
    },

    // Obtener santo por ID
    getSaint: async (saintId) => {
        try {
            const response = await fetch(`${API_URL}/api/saints/${saintId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching saint:', error);
            throw error;
        }
    },

// Crear santo (admin)
createSaint: async (saintData) => {
    try {
        // ✅ USAR admin_token que es donde realmente está el token
        const token = window.localStorage.getItem('token') || 
                     window.localStorage.getItem('admin_token');

        console.log('🔐 Token admin encontrado:', token ? 'SÍ' : 'NO');
        
        if (!token) {
            throw new Error('No authentication token found. Please log in to admin.');
        }

        const response = await fetch(`${API_URL}/api/saints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(saintData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error creating saint');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating saint:', error);
        throw error;
    }
},

    // Actualizar santo (admin)  
    updateSaint: async (saintId, saintData) => {
        try {
            const token = localStorage.getItem('token'); // ✅ Obtener token
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/api/saints/${saintId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ✅ Enviar token
                },
                body: JSON.stringify(saintData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error updating saint');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating saint:', error);
            throw error;
        }
    },


    // Eliminar santo (admin)
    deleteSaint: async (saintId) => {
        try {
            const token = localStorage.getItem('token'); // ✅ Obtener token
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/api/saints/${saintId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // ✅ Enviar token
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deleting saint');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting saint:', error);
            throw error;
        }
    }
};