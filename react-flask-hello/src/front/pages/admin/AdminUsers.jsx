import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import UserFilters from '../../components/admin/users/UserFilters';
import UserList from '../../components/admin/users/UserList';
import UserForm from '../../components/admin/users/UserForm';
import ProfileModal from '../../components/admin/users/ProfileModal';
import ActivityLogs from '../../components/admin/users/ActivityLogs';
import LogsFilters from '../../components/admin/users/LogsFilters';

const AdminUsers = () => {
  const { isSuperAdmin, user: currentUser } = useAuth();
  
  // Estados para datos
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' o 'logs'

  // Estados para paginación
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const [logsPagination, setLogsPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0
  });

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    is_active: '',
    page: 1
  });

  const [logsFilters, setLogsFilters] = useState({
    search: '',
    action: '',
    page: 1
  });

  // Estados para modales y formularios
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Estados para mensajes
  const [message, setMessage] = useState('');

  // Cargar usuarios
  const loadUsers = async () => {
    if (!isSuperAdmin()) return;
    
    setLoading(true);
    try {
      const response = await userService.getAdminUsers(filters);
      setUsers(response.users);
      setPagination({
        page: response.current_page,
        per_page: filters.per_page || 10,
        total: response.total,
        pages: response.pages
      });
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar logs de actividad
  const loadActivityLogs = async () => {
    if (!isSuperAdmin()) return;
    
    setLogsLoading(true);
    try {
      const response = await userService.getActivityLogs(logsFilters.page, logsFilters.per_page);
      setLogs(response.logs);
      setLogsPagination({
        page: response.current_page,
        per_page: logsFilters.per_page || 20,
        total: response.total,
        pages: response.pages
      });
    } catch (error) {
      console.error('Error loading activity logs:', error);
      setMessage('Error al cargar los logs de actividad');
    } finally {
      setLogsLoading(false);
    }
  };

  // Efecto para cargar datos según la pestaña activa
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'logs') {
      loadActivityLogs();
    }
  }, [filters, logsFilters, activeTab, isSuperAdmin]);

  // Manejar cambio de filtros de usuarios
  const handleFiltersChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1 // Resetear a primera página cuando cambian filtros
    }));
  };

  // Manejar cambio de filtros de logs
  const handleLogsFiltersChange = (filterName, value) => {
    setLogsFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1
    }));
  };

  // Limpiar filtros de usuarios
  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: '',
      is_active: '',
      page: 1
    });
  };

  // Limpiar filtros de logs
  const handleClearLogsFilters = () => {
    setLogsFilters({
      search: '',
      action: '',
      page: 1
    });
  };

  // Manejar paginación de usuarios
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Manejar paginación de logs
  const handleLogsPageChange = (newPage) => {
    setLogsFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // === FUNCIONES DE GESTIÓN DE USUARIOS ===

  // Mostrar formulario para crear usuario
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  // Mostrar formulario para editar usuario
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  // Manejar envío del formulario
  const handleSubmitUser = async (userData) => {
    setFormLoading(true);
    setMessage('');

    try {
      if (editingUser) {
        // Actualizar usuario existente
        await userService.updateAdminUser(editingUser.id, userData);
        setMessage('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await userService.createAdminUser(userData);
        setMessage('Usuario creado correctamente');
      }

      setShowUserForm(false);
      setEditingUser(null);
      loadUsers(); // Recargar lista
    } catch (error) {
      setMessage(error.message || 'Error al guardar el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar eliminación de usuario
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.email}?`)) {
      return;
    }

    try {
      await userService.deleteAdminUser(user.id);
      setMessage('Usuario eliminado correctamente');
      loadUsers(); // Recargar lista
    } catch (error) {
      setMessage(error.message || 'Error al eliminar el usuario');
    }
  };

  // Manejar activar/desactivar usuario
  const handleToggleStatus = async (user) => {
    const action = user.is_active ? 'desactivar' : 'activar';
    
    if (!window.confirm(`¿Estás seguro de que quieres ${action} al usuario ${user.email}?`)) {
      return;
    }

    try {
      await userService.toggleUserStatus(user.id);
      setMessage(`Usuario ${action}do correctamente`);
      loadUsers(); // Recargar lista
    } catch (error) {
      setMessage(error.message || `Error al ${action} el usuario`);
    }
  };

  // Si no es superadmin, mostrar mensaje de no autorizado
  if (!isSuperAdmin()) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-600 text-lg mb-2">No autorizado</div>
          <div className="text-gray-500">
            No tienes permisos para acceder a la gestión de usuarios.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios Admin</h1>
          <p className="text-gray-600">Administra usuarios y visualiza actividad del sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Mi Perfil
          </button>
          {activeTab === 'users' && (
            <button
              onClick={handleCreateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Usuario
            </button>
          )}
        </div>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`p-4 rounded-md mb-6 ${
          message.includes('correctamente') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
          <button 
            onClick={() => setMessage('')}
            className="float-right text-sm font-medium"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gestión de Usuarios
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logs de Actividad
          </button>
        </nav>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'users' ? (
        <>
          {/* Filtros de usuarios */}
          <UserFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Estadísticas de usuarios */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
              <div className="text-gray-600">Total Usuarios</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'superadmin').length}
              </div>
              <div className="text-gray-600">Super Admins</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.is_active).length}
              </div>
              <div className="text-gray-600">Usuarios Activos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => !u.is_active).length}
              </div>
              <div className="text-gray-600">Usuarios Inactivos</div>
            </div>
          </div>

          {/* Lista de Usuarios */}
          <UserList
            users={users}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />

          {/* Paginación de usuarios */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-700">
                Página {pagination.page} de {pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Filtros de logs */}
          <LogsFilters
            filters={logsFilters}
            onFiltersChange={handleLogsFiltersChange}
            onClearFilters={handleClearLogsFilters}
          />

          {/* Estadísticas de logs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-900">{logsPagination.total}</div>
              <div className="text-gray-600">Total Registros</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {logs.filter(log => log.action.includes('user_updated')).length}
              </div>
              <div className="text-gray-600">Actualizaciones</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(log => log.action === 'user_created').length}
              </div>
              <div className="text-gray-600">Usuarios Creados</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(log => log.action === 'user_deleted').length}
              </div>
              <div className="text-gray-600">Usuarios Eliminados</div>
            </div>
          </div>

          {/* Lista de Logs */}
          <ActivityLogs
            logs={logs}
            loading={logsLoading}
            pagination={logsPagination}
            onPageChange={handleLogsPageChange}
          />
        </>
      )}

      {/* Modal de Formulario de Usuario */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm
              user={editingUser}
              onSubmit={handleSubmitUser}
              onCancel={() => {
                setShowUserForm(false);
                setEditingUser(null);
              }}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Modal de Perfil Propio */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default AdminUsers;