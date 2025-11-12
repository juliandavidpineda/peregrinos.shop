import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import ContactMessageModal from '../../components/admin/ContactMessageModal';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, oracion

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // Temporalmente sin token ya que @jwt_required está comentado
      const response = await contactService.getAllMessages();
      
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Marcar como leído si no lo está
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      // Temporalmente sin token
      await contactService.updateMessageStatus(messageId, { is_read: true });
      
      // Actualizar estado local
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => ({ ...prev, is_read: true }));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      // Temporalmente sin token
      await contactService.updateMessageStatus(messageId, { status });
      
      // Actualizar estado local
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filtrar mensajes
  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.is_read;
    if (filter === 'oracion') return message.message_type === 'oracion';
    return true;
  });

  // Estadísticas
  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    oraciones: messages.filter(m => m.message_type === 'oracion').length
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      responded: { color: 'bg-green-100 text-green-800', label: 'Respondido' },
      archived: { color: 'bg-gray-100 text-gray-600', label: 'Archivado' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      sugerencia: { color: 'bg-blue-100 text-blue-800', label: 'Sugerencia' },
      opinion: { color: 'bg-purple-100 text-purple-800', label: 'Opinión' },
      oracion: { color: 'bg-amber-100 text-amber-800', label: 'Oración' },
      reclamo: { color: 'bg-red-100 text-red-800', label: 'Reclamo' },
      info: { color: 'bg-gray-100 text-gray-600', label: 'Información' }
    };
    const config = typeConfig[type] || typeConfig.sugerencia;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto"></div>
        <p className="text-center mt-4 text-[#779385]">Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2f4823]">Mensajes de Contacto</h1>
          <p className="text-[#779385]">Gestiona las consultas y solicitudes de los usuarios</p>
        </div>
        <button
          onClick={loadMessages}
          className="bg-[#2f4823] text-white px-4 py-2 rounded-lg hover:bg-[#1f3219] transition-colors"
        >
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-[#779385]/20">
          <div className="text-2xl font-bold text-[#2f4823]">{stats.total}</div>
          <div className="text-[#779385] text-sm">Total Mensajes</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[#779385]/20">
          <div className="text-2xl font-bold text-amber-600">{stats.unread}</div>
          <div className="text-[#779385] text-sm">No Leídos</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[#779385]/20">
          <div className="text-2xl font-bold text-amber-600">{stats.oraciones}</div>
          <div className="text-[#779385] text-sm">Solicitudes de Oración</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg p-4 border border-[#779385]/20 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' 
                ? 'bg-[#2f4823] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'unread' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            No Leídos ({stats.unread})
          </button>
          <button
            onClick={() => setFilter('oracion')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'oracion' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Oraciones ({stats.oraciones})
          </button>
        </div>
      </div>

      {/* Lista de Mensajes */}
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#779385] text-lg">No hay mensajes</p>
            <p className="text-[#779385] text-sm mt-2">
              {filter === 'all' 
                ? 'No se han recibido mensajes aún' 
                : `No hay mensajes ${filter === 'unread' ? 'no leídos' : 'de oración'}`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7f2e7] border-b border-[#779385]/20">
                <tr>
                  <th className="text-left p-4 text-[#2f4823] font-semibold">Usuario</th>
                  <th className="text-left p-4 text-[#2f4823] font-semibold">Tipo</th>
                  <th className="text-left p-4 text-[#2f4823] font-semibold">Estado</th>
                  <th className="text-left p-4 text-[#2f4823] font-semibold">Fecha</th>
                  <th className="text-left p-4 text-[#2f4823] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message, index) => (
                  <tr 
                    key={message.id} 
                    className={`
                      ${index % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}
                      ${!message.is_read ? 'border-l-4 border-l-amber-500' : ''}
                    `}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-[#2f4823]">{message.name}</p>
                        <p className="text-sm text-[#779385]">{message.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getTypeBadge(message.message_type)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="p-4 text-[#2f4823] text-sm">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Ver
                        </button>
                        {!message.is_read && (
                          <button
                            onClick={() => markAsRead(message.id)}
                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            Marcar Leído
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedMessage && (
        <ContactMessageModal
          message={selectedMessage}
          onClose={() => setShowModal(false)}
          onUpdateStatus={updateMessageStatus}
          formatDate={formatDate}
          getTypeBadge={getTypeBadge}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
};

export default AdminContactMessages;