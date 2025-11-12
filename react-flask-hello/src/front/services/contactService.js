import { getBackendUrl } from '../utils/backendConfig';

const API_URL = getBackendUrl();

export const contactService = {
    // Enviar mensaje de contacto
    sendMessage: async (messageData) => {
        try {
            const response = await fetch(`${API_URL}/api/contact-messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error enviando mensaje');
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending contact message:', error);
            throw error;
        }
    },

  getAllMessages: async (token) => {
        try {
            const response = await fetch(`${API_URL}/api/contact-messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error obteniendo mensajes');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching contact messages:', error);
            throw error;
        }
    },

    // Actualizar estado del mensaje (admin)
    updateMessageStatus: async (messageId, statusData, token) => {
        try {
            const response = await fetch(`${API_URL}/api/contact-messages/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(statusData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error actualizando mensaje');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    }
};