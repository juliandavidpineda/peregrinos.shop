import React, { useState } from 'react';

const ContactMessageModal = ({ message, onClose, onUpdateStatus, formatDate, getTypeBadge, getStatusBadge }) => {
  const [selectedStatus, setSelectedStatus] = useState(message.status);

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    onUpdateStatus(message.id, newStatus);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      responded: 'bg-green-500', 
      archived: 'bg-gray-500'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-[#2f4823] text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Mensaje de {message.name}</h2>
            <p className="text-[#779385] text-sm">{message.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#779385] text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información del mensaje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Tipo de Mensaje</label>
                <div>{getTypeBadge(message.message_type)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Estado Actual</label>
                <div>{getStatusBadge(message.status)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Fecha de Envío</label>
                <p className="text-[#2f4823] font-medium">{formatDate(message.created_at)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#779385] mb-1">Estado de Lectura</label>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${message.is_read ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className="text-[#2f4823] font-medium">
                    {message.is_read ? 'Leído' : 'No leído'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#779385] mb-3">Mensaje</label>
            <div className="bg-[#f7f2e7] rounded-lg p-4 border border-[#779385]/20">
              <p className="text-[#2f4823] leading-relaxed whitespace-pre-line">
                {message.message}
              </p>
            </div>
          </div>

          {/* Cambiar Estado */}
          <div className="border-t border-[#779385]/20 pt-6">
            <h3 className="font-semibold text-[#2f4823] mb-4">Cambiar Estado del Mensaje</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Pendiente
              </button>
              <button
                onClick={() => handleStatusChange('responded')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'responded'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Respondido
              </button>
              <button
                onClick={() => handleStatusChange('archived')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'archived'
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Archivado
              </button>
            </div>
          </div>

          {/* Mensaje especial para oraciones */}
          {message.message_type === 'oracion' && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🙏</span>
                <div>
                  <p className="font-semibold text-amber-800">Solicitud de Oración</p>
                  <p className="text-amber-700 text-sm">
                    Este mensaje requiere atención espiritual especial
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#779385]/20 p-6">
          <button
            onClick={onClose}
            className="w-full bg-[#2f4823] text-white py-3 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactMessageModal;