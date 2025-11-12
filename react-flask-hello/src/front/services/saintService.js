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
            // ✅ TEMPORAL: No enviar token ya que @jwt_required está comentado
            const response = await fetch(`${API_URL}/api/saints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`  // ← Temporalmente comentado
                },
                body: JSON.stringify(saintData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
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
            // ✅ TEMPORAL: No enviar token ya que @jwt_required está comentado
            const response = await fetch(`${API_URL}/api/saints/${saintId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`  // ← Temporalmente comentado
                },
                body: JSON.stringify(saintData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
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
            // ✅ TEMPORAL: No enviar token ya que @jwt_required está comentado
            const response = await fetch(`${API_URL}/api/saints/${saintId}`, {
                method: 'DELETE',
                headers: {
                    // 'Authorization': `Bearer ${token}`  // ← Temporalmente comentado
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting saint:', error);
            throw error;
        }
    }
};