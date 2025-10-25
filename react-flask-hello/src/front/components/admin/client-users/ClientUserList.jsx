import React, { useState } from 'react';
import ClientUserCard from './ClientUserCard';

const ClientUserList = ({ users, loading, onUpdateUser }) => {
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      setUpdatingUserId(userId);
      await onUpdateUser(userId, { is_active: !currentStatus });
    } catch (error) {
      alert('Error al actualizar usuario: ' + error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto"></div>
        <p className="text-gray-600 mt-4">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {users.map(user => (
        <ClientUserCard
          key={user.id}
          user={user}
          onStatusToggle={handleStatusToggle}
          isUpdating={updatingUserId === user.id}
        />
      ))}
    </div>
  );
};

export default ClientUserList;