import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClientUserList from '../../components/admin/client-users/ClientUserList';
import ClientUserFilters from '../../components/admin/client-users/ClientUserFilters';
import { clientUserService } from '../../services/clientUserService';

const AdminClientUsers = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    terms_accepted: 'all'
  });

  // ✅ AGREGAR DEBUG
  console.log('🔧 AdminClientUsers - adminUser:', adminUser);
  console.log('🔧 AdminClientUsers - role:', adminUser?.role);
  console.log('🔧 AdminClientUsers - isSuperAdmin?', adminUser?.role === 'superadmin');

  useEffect(() => {
    if (adminUser && adminUser.role?.toLowerCase() === 'superadmin') {
      loadUsers();
    }
  }, [adminUser, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await clientUserService.getClientUsers(filters);
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await clientUserService.updateClientUser(userId, userData);
      await loadUsers(); // Recargar la lista
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  if (adminUser?.role?.toLowerCase() !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios Clientes</h1>
          <p className="text-gray-600 mt-2">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
            <div className="text-2xl font-bold text-[#2f4823]">{users.length}</div>
            <div className="text-gray-600">Total Usuarios</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.is_active).length}
            </div>
            <div className="text-gray-600">Usuarios Activos</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.terms_accepted).length}
            </div>
            <div className="text-gray-600">Términos Aceptados</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.marketing_emails).length}
            </div>
            <div className="text-gray-600">Marketing Aceptado</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ClientUserFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            onRefresh={loadUsers}
          />
        </div>

        {/* User List */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2f4823]/20">
          <ClientUserList 
            users={users}
            loading={loading}
            onUpdateUser={handleUpdateUser}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminClientUsers;