import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import UserProfileUnified from '../components/user/UserProfileUnified';
import OrderHistory from '../components/user/OrderHistory';
import AddressBook from '../components/user/AddressBook';

const UserProfilePage = () => {
  const { user, isAuthenticated, logout } = useUserAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos del perfil
      const profileResponse = await userService.getUserProfile();
      if (profileResponse.success) {
        setProfileData(profileResponse.user);
      }

      // Cargar pedidos
      const ordersResponse = await userService.getUserOrders();
      if (ordersResponse.success) {
        setOrders(ordersResponse.orders || []);
      }

      // Cargar direcciones
      const addressesResponse = await userService.getUserAddresses();
      if (addressesResponse.success) {
        setAddresses(addressesResponse.addresses || []);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await userService.updateUserProfile(updatedData);
      if (response.success) {
        setProfileData(response.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const response = await userService.addUserAddress(addressData);
      if (response.success) {
        setAddresses(prev => [...prev, response.address]);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleUpdateAddress = async (addressId, addressData) => {
    try {
      const response = await userService.updateUserAddress(addressId, addressData);
      if (response.success) {
        setAddresses(prev => 
          prev.map(addr => addr.id === addressId ? response.address : addr)
        );
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await userService.deleteUserAddress(addressId);
      if (response.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto mb-4"></div>
          <p className="text-[#779385] text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirección manejada en useEffect
  }

  // ✅ NUEVAS PESTAÑAS UNIFICADAS
  const tabs = [
    { id: 'profile', name: 'Mi Perfil', icon: '👤' },
    { id: 'orders', name: 'Mis Pedidos', icon: '📦' },
    { id: 'addresses', name: 'Direcciones', icon: '🏠' }
  ];

  return (
    <div className="min-h-screen bg-[#f7f2e7]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
            Mi Cuenta
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Gestiona tu información, pedidos y direcciones en Peregrinos Shop
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-lg border border-[#779385]/20 overflow-hidden">
          
          {/* Header with User Info */}
          <div className="bg-gradient-to-r from-[#f7f2e7] to-[#e8dfca] p-6 border-b border-[#779385]/20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="relative">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {!user.picture && (
                    <div className="w-16 h-16 bg-[#2f4823] text-white rounded-full flex items-center justify-center font-semibold text-xl border-4 border-white shadow-lg">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2f4823] font-serif">
                    {user.name}
                  </h2>
                  <p className="text-[#779385]">{user.email}</p>
                  {profileData?.user_segment && (
                    <span className="inline-block mt-1 px-2 py-1 bg-[#2f4823] text-white text-xs rounded-full font-medium">
                      {profileData.user_segment.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/shop-page')}
                  className="px-4 py-2 border border-[#2f4823] text-[#2f4823] rounded-2xl font-semibold hover:bg-[#2f4823] hover:text-white transition-all duration-300"
                >
                  Seguir Comprando
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all duration-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[#779385]/20">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#2f4823] border-b-2 border-[#2f4823] bg-[#f7f2e7]'
                      : 'text-[#779385] hover:text-[#2f4823] hover:bg-[#f7f2e7]/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <UserProfileUnified 
                user={profileData || user} 
                onUpdate={handleUpdateProfile}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrderHistory 
                orders={orders}
                onRefresh={loadUserData}
              />
            )}
            
            {activeTab === 'addresses' && (
              <AddressBook 
                addresses={addresses}
                onAdd={handleAddAddress}
                onUpdate={handleUpdateAddress}
                onDelete={handleDeleteAddress}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;