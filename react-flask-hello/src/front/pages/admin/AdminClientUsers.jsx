import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClientUserList from '../../components/admin/client-users/ClientUserList';
import ClientUserFilters from '../../components/admin/client-users/ClientUserFilters';
import { clientUserService } from '../../services/clientUserService';
import toast, { Toaster } from 'react-hot-toast';

const AdminClientUsers = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    terms_accepted: 'all',
    marketing_emails: 'all'
  });

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

  // ✅ NUEVA FUNCIÓN: Exportar usuarios
  const exportUsers = async (marketingOnly = false) => {
    try {
      setExporting(true);
      console.log('🔧 Exportando usuarios...', { marketingOnly });
      
      const response = await clientUserService.exportClientUsers(marketingOnly);
      console.log('🔧 Respuesta de exportación:', response);
      
      if (response.success) {
        // Convertir a CSV
        const csvContent = response.csv_data.map(row => 
          row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        // Crear y descargar archivo
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        const type = marketingOnly ? 'marketing' : 'todos';
        link.download = `usuarios_peregrinos_${type}_${timestamp}.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success(`✅ ${response.total_users} usuarios exportados correctamente`);
      }
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('❌ Error al exportar usuarios: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  // ✅ CONDICIÓN CORREGIDA - DEJA ESTA ACTIVA:
  if (!adminUser || adminUser.role?.toLowerCase() !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p className="text-sm text-gray-600 mt-2">
            Rol actual: {adminUser?.role} | Se requiere: superadmin
          </p>
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

        {/* Stats con botones de exportación */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
            <div className="text-2xl font-bold text-[#2f4823]">{users.length}</div>
            <div className="text-gray-600">Total Usuarios</div>
            <button 
              onClick={() => exportUsers(false)}
              disabled={exporting}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? '⏳ Exportando...' : '📥 Exportar Todos'}
            </button>
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
            <button 
              onClick={() => exportUsers(true)}
              disabled={exporting}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? '⏳ Exportando...' : '📧 Exportar Marketing'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#2f4823]/20">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => !u.is_active).length}
            </div>
            <div className="text-gray-600">Usuarios Inactivos</div>
          </div>
        </div>

        {/* ✅ NUEVO: Botones de Exportación Principales */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => exportUsers(false)}
            disabled={exporting || users.length === 0}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Exportar Todos los Usuarios ({users.length})</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => exportUsers(true)}
            disabled={exporting || users.filter(u => u.marketing_emails).length === 0}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <span>📧</span>
                <span>Exportar Solo Marketing ({users.filter(u => u.marketing_emails).length})</span>
              </>
            )}
          </button>
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